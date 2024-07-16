document.addEventListener("DOMContentLoaded", () => {
    const downloadButton = document.getElementById('downloadButton');
    const videoUrlInput = document.getElementById('videoUrl');
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progress-container');
    const message = document.getElementById('message');

    downloadButton.addEventListener('click', async () => {
        const videoUrl = videoUrlInput.value;

        if (videoUrl) {
            message.textContent = '';
            progressBar.style.width = '0%';
            loader.style.display = 'block';
            progressContainer.style.display = 'block';
            downloadButton.disabled = true;

            try {
                const response = await fetch('/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: videoUrl }),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'video.mp4';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    message.textContent = 'Download Complete!';
                } else {
                    const errorData = await response.json();
                    message.textContent = `Error: ${errorData.error}`;
                }
            } catch (error) {
                message.textContent = `Error: ${error.message}`;
            } finally {
                loader.style.display = 'none';
                progressBar.style.width = '100%';
                downloadButton.disabled = false;
            }
        } else {
            message.textContent = 'Please enter a valid video URL';
        }
    });
});
