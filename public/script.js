document.getElementById('urlForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const urlInput = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="sr-only">Đang kiểm tra...</span></div>';

    try {
        const response = await fetch(`/check-url?url=${encodeURIComponent(urlInput)}`);
        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
        } else {
            resultDiv.innerHTML = `<div class="alert alert-success">Trang đích: <a href="${data.originalUrl}" target="_blank">${data.originalUrl}</a></div>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `<div class="alert alert-danger">Có lỗi xảy ra, vui lòng thử lại.</div>`;
    }
});
