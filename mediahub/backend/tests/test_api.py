import unittest
import json
import os
import sys
from unittest.mock import patch

# Insert backend directory in path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.database import db, User, Download, Favorite, Subscription

class MediaHubAPITestCase(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        self.app = create_app()
        self.app.config['TESTING'] = True
        # Use an in-memory SQLite database for test runs
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        
        # Build tables
        with self.app.app_context():
            db.create_all()
            
    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            
    def register_user(self, name, email, password):
        return self.client.post('/api/register', 
            data=json.dumps({
                'name': name,
                'email': email,
                'password': password
            }),
            content_type='application/json'
        )
        
    def login_user(self, email, password):
        return self.client.post('/api/login',
            data=json.dumps({
                'email': email,
                'password': password
            }),
            content_type='application/json'
        )

    def test_registration_success(self):
        response = self.register_user('John Doe', 'john@example.com', 'password123')
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertEqual(data['user']['email'], 'john@example.com')
        
    def test_registration_missing_fields(self):
        response = self.client.post('/api/register', 
            data=json.dumps({'name': 'John'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        
    def test_login_success(self):
        # Register first
        self.register_user('John Doe', 'john@example.com', 'password123')
        # Login
        response = self.login_user('john@example.com', 'password123')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        
    def test_login_invalid_credentials(self):
        self.register_user('John Doe', 'john@example.com', 'password123')
        response = self.login_user('john@example.com', 'wrongpassword')
        self.assertEqual(response.status_code, 401)

    def test_google_login_mock(self):
        response = self.client.post('/api/login/google',
            data=json.dumps({
                'name': 'Google User',
                'email': 'guser@example.com'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertEqual(data['user']['name'], 'Google User')

    def test_forgot_password_mock(self):
        response = self.client.post('/api/forgot-password',
            data=json.dumps({'email': 'john@example.com'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['message'])

    @patch('services.ytdlp_service.analyze_url')
    def test_analyze_media_mock(self, mock_analyze):
        mock_analyze.return_value = {
            'title': 'Mock Video Title',
            'thumbnail': 'https://example.com/thumb.jpg',
            'platform': 'YouTube',
            'duration': 120,
            'formats': [{'id': '720p', 'resolution': '720p', 'available': True}]
        }
        
        response = self.client.post('/api/analyze',
            data=json.dumps({'url': 'https://youtube.com/watch?v=123'}),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['title'], 'Mock Video Title')
        self.assertEqual(data['platform'], 'YouTube')

    def test_submit_contact_message(self):
        response = self.client.post('/api/contact',
            data=json.dumps({
                'name': 'Support Request',
                'email': 'support@example.com',
                'message': 'This is a test feedback message.'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('contact', data)
        self.assertEqual(data['contact']['email'], 'support@example.com')

    def test_get_blog_posts(self):
        # Create a mock blog post in DB
        with self.app.app_context():
            from services.db_service import create_blog_post
            create_blog_post('Test Blog Post', 'test-blog-post', 'Test content here', 'image.jpg')
            
        response = self.client.get('/api/blog')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(len(data) >= 1)
        self.assertEqual(data[0]['slug'], 'test-blog-post')

if __name__ == '__main__':
    unittest.main()
