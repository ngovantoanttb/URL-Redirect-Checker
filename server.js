const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

// Cấu hình máy chủ để phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Hàm sử dụng Puppeteer để lấy địa chỉ URL đích
async function getRedirectUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const finalUrl = page.url();
    await browser.close();

    return finalUrl;
}

// Route handler để xử lý yêu cầu GET đến '/check-url'
app.get('/check-url', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.json({ error: 'URL không hợp lệ.' });
    }

    try {
        const redirectUrl = await getRedirectUrl(url);
        res.json({ originalUrl: redirectUrl });
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ trang đích:', error);
        res.json({ error: 'Không thể truy cập URL.' });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
