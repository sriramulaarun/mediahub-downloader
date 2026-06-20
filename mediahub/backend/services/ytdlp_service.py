import os
import re
import shutil
import uuid
import glob
import yt_dlp

def is_ffmpeg_available():
    return shutil.which('ffmpeg') is not None or shutil.which('ffmpeg.exe') is not None

def detect_platform(url):
    url_lower = url.lower()
    if 'youtube.com' in url_lower or 'youtu.be' in url_lower:
        return 'YouTube'
    elif 'instagram.com' in url_lower:
        return 'Instagram'
    elif 'facebook.com' in url_lower or 'fb.watch' in url_lower:
        return 'Facebook'
    elif 'twitter.com' in url_lower or 'x.com' in url_lower:
        return 'Twitter'
    else:
        return 'Unknown'

def sanitize_filename(name):
    # Remove characters that aren't letters, numbers, spaces, dots, or dashes
    return re.sub(r'[^\w\s\.-]', '', name).strip()

def analyze_url(url):
    platform = detect_platform(url)
    
    # We load standard cookies.txt if it exists in backend root
    cookies_path = 'cookies.txt'
    ydl_opts = {
        'skip_download': True,
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False
    }
    
    if os.path.exists(cookies_path):
        ydl_opts['cookiefile'] = cookies_path
        
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
        if not info:
            raise Exception("No metadata returned by yt-dlp")
            
        # Parse titles and assets
        title = info.get('title', 'Unknown Media')
        duration = info.get('duration', 0) # in seconds
        
        # Get highest resolution thumbnail
        thumbnail = None
        thumbnails = info.get('thumbnails', [])
        if thumbnails:
            # Sort by width or area to get best resolution
            sorted_thumbs = sorted(thumbnails, key=lambda x: x.get('width', 0) or 0, reverse=True)
            thumbnail = sorted_thumbs[0].get('url')
        else:
            thumbnail = info.get('thumbnail')
            
        # Determine available formats from the yt-dlp formats
        # We will map standard options to frontend: 360p, 720p, 1080p, and mp3
        # Estimate file sizes based on format data
        formats_list = info.get('formats', [])
        
        has_360p = False
        has_720p = False
        has_1080p = False
        
        for f in formats_list:
            height = f.get('height')
            if height:
                if height >= 1080:
                    has_1080p = True
                elif height >= 720:
                    has_720p = True
                elif height >= 360:
                    has_360p = True
                    
        # Construct standard options list
        options = []
        
        # 360p
        options.append({
            'id': '360p',
            'resolution': '360p',
            'ext': 'mp4',
            'label': '360p (Standard MP4)',
            'size': 'Estimated ~5-15 MB',
            'available': True # 360p is practically always available
        })
        
        # 720p
        options.append({
            'id': '720p',
            'resolution': '720p',
            'ext': 'mp4',
            'label': '720p (HD MP4)',
            'size': 'Estimated ~15-40 MB',
            'available': has_720p or not platform == 'YouTube' # Default true as fallback
        })
        
        # 1080p
        options.append({
            'id': '1080p',
            'resolution': '1080p',
            'ext': 'mp4',
            'label': '1080p (Full HD MP4)',
            'size': 'Estimated ~40-100 MB',
            'available': has_1080p
        })
        
        # MP3
        options.append({
            'id': 'mp3',
            'resolution': 'Audio',
            'ext': 'mp3',
            'label': 'MP3 Audio (High Quality)',
            'size': 'Estimated ~3-8 MB',
            'available': True
        })
        
        # Format warning if FFmpeg is missing
        ffmpeg_warning = None
        if not is_ffmpeg_available():
            ffmpeg_warning = "FFmpeg is not installed on the server. High-quality (1080p) merging and direct MP3 conversions will fall back to best pre-merged format / standard audio streams."
            
        return {
            'title': title,
            'thumbnail': thumbnail,
            'platform': platform,
            'duration': duration,
            'formats': options,
            'warning': ffmpeg_warning
        }
        
    except Exception as e:
        raise Exception(f"Failed to analyze URL: {str(e)}")

def download_media(url, format_id, download_dir):
    # Generates a random file prefix
    file_id = str(uuid.uuid4())
    out_tmpl = os.path.join(download_dir, f"{file_id}.%(ext)s")
    
    cookies_path = 'cookies.txt'
    ffmpeg_present = is_ffmpeg_available()
    
    # Configure download options based on selection
    ydl_opts = {
        'outtmpl': out_tmpl,
        'quiet': True,
        'no_warnings': True,
    }
    
    if os.path.exists(cookies_path):
        ydl_opts['cookiefile'] = cookies_path
        
    if format_id == 'mp3':
        if ffmpeg_present:
            ydl_opts['format'] = 'bestaudio/best'
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        else:
            # Fallback when FFmpeg is not available
            # Just grab standard audio or best pre-merged
            ydl_opts['format'] = 'bestaudio/best'
    elif format_id == '1080p':
        if ffmpeg_present:
            ydl_opts['format'] = 'bestvideo[height<=1080]+bestaudio/best'
            ydl_opts['merge_output_format'] = 'mp4'
        else:
            # Fallback to pre-merged video (usually 720p)
            ydl_opts['format'] = 'best[ext=mp4]/best'
    elif format_id == '720p':
        if ffmpeg_present:
            ydl_opts['format'] = 'bestvideo[height<=720]+bestaudio/best'
            ydl_opts['merge_output_format'] = 'mp4'
        else:
            ydl_opts['format'] = 'best[height<=720]/best'
    elif format_id == '360p':
        if ffmpeg_present:
            ydl_opts['format'] = 'bestvideo[height<=360]+bestaudio/best'
            ydl_opts['merge_output_format'] = 'mp4'
        else:
            ydl_opts['format'] = 'best[height<=360]/best'
    else:
        # Default best format
        ydl_opts['format'] = 'best[ext=mp4]/best'

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # First extract title
            info = ydl.extract_info(url, download=True)
            title = info.get('title', 'media_file')
            
        # Find the downloaded file in the directory
        search_pattern = os.path.join(download_dir, f"{file_id}.*")
        matching_files = glob.glob(search_pattern)
        
        if not matching_files:
            # Fallback check if it was converted and has a different name
            # Check files starting with file_id
            all_files = os.listdir(download_dir)
            matching_files = [os.path.join(download_dir, f) for f in all_files if f.startswith(file_id)]
            
        if not matching_files:
            raise Exception("Downloaded file could not be found.")
            
        filepath = matching_files[0]
        ext = os.path.splitext(filepath)[1].replace('.', '')
        
        # Calculate size
        file_size = os.path.getsize(filepath)
        
        return {
            'filepath': filepath,
            'filename': f"{sanitize_filename(title)}.{ext}",
            'title': title,
            'file_size': file_size,
            'platform': detect_platform(url),
            'extension': ext
        }
        
    except Exception as e:
        # Clean up any partial files if download failed
        search_pattern = os.path.join(download_dir, f"{file_id}.*")
        for temp_file in glob.glob(search_pattern):
            try:
                os.remove(temp_file)
            except:
                pass
        raise Exception(f"Download failed: {str(e)}")
