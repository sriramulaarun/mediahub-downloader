from models.database import db, User, Download, Favorite, Subscription, ContactMessage, BlogPost
from datetime import datetime, timedelta

def create_user(name, email, password_hash, role='user'):
    user = User(name=name, email=email, password_hash=password_hash, role=role)
    db.session.add(user)
    db.session.commit()
    
    # Initialize a free subscription automatically
    create_or_update_subscription(user.id, plan='free', status='active', expiry_days=365)
    return user

def get_user_by_email(email):
    return User.query.filter_by(email=email).first()

def get_user_by_id(user_id):
    return User.query.get(user_id)

def get_all_users():
    return User.query.all()

def add_download(user_id, url, platform, title, format, file_size):
    download = Download(
        user_id=user_id, 
        url=url, 
        platform=platform, 
        title=title, 
        format=format, 
        file_size=file_size
    )
    db.session.add(download)
    db.session.commit()
    return download

def get_downloads_by_user(user_id):
    return Download.query.filter_by(user_id=user_id).order_by(Download.created_at.desc()).all()

def get_all_downloads():
    return Download.query.order_by(Download.created_at.desc()).all()

def get_favorite_assoc(user_id, download_id):
    return Favorite.query.filter_by(user_id=user_id, download_id=download_id).first()

def add_favorite(user_id, download_id):
    existing = get_favorite_assoc(user_id, download_id)
    if existing:
        return existing
    
    fav = Favorite(user_id=user_id, download_id=download_id)
    db.session.add(fav)
    db.session.commit()
    return fav

def remove_favorite(user_id, download_id):
    fav = get_favorite_assoc(user_id, download_id)
    if fav:
        db.session.delete(fav)
        db.session.commit()
        return True
    return False

def get_favorites_by_user(user_id):
    return Favorite.query.filter_by(user_id=user_id).all()

def get_user_subscription(user_id):
    # Returns the latest subscription
    return Subscription.query.filter_by(user_id=user_id).order_by(Subscription.id.desc()).first()

def create_or_update_subscription(user_id, plan, status='active', expiry_days=30):
    sub = get_user_subscription(user_id)
    expiry = datetime.utcnow() + timedelta(days=expiry_days)
    
    if sub:
        sub.plan = plan
        sub.status = status
        sub.expiry_date = expiry
    else:
        sub = Subscription(user_id=user_id, plan=plan, status=status, expiry_date=expiry)
        db.session.add(sub)
        
    db.session.commit()
    return sub

def get_all_subscriptions():
    return Subscription.query.all()

def add_contact_message(name, email, message):
    msg = ContactMessage(name=name, email=email, message=message)
    db.session.add(msg)
    db.session.commit()
    return msg

def get_all_contact_messages():
    return ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()

def get_all_blog_posts():
    return BlogPost.query.order_by(BlogPost.created_at.desc()).all()

def get_blog_post_by_slug(slug):
    return BlogPost.query.filter_by(slug=slug).first()

def create_blog_post(title, slug, content, image=None):
    post = BlogPost(title=title, slug=slug, content=content, image=image)
    db.session.add(post)
    db.session.commit()
    return post

