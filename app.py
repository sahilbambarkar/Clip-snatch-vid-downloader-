from flask import Flask, render_template, request, send_file, jsonify
import os
import yt_dlp
import uuid

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()
    video_url = data.get('url')
    
    if not video_url:
        return jsonify({'error': 'No URL provided'}), 400

    video_id = str(uuid.uuid4())
    output_path = os.path.join('downloads', f'{video_id}.mp4')

    ydl_opts = {
    'format': 'best[ext=mp4]',
    'outtmpl': output_path,
    'quiet': True,
}

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        return send_file(output_path, as_attachment=True, download_name=f'{video_id}.mp4')
    except yt_dlp.utils.DownloadError as e:
        error_message = f"DownloadError: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500
    except Exception as e:
        error_message = f"Unexpected error: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    if not os.path.exists('downloads'):
        os.makedirs('downloads')
    app.run(debug=True)
