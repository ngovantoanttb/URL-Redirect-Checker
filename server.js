const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Cấu hình máy chủ để phục vụ các tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Hàm sử dụng Puppeteer để lấy địa chỉ URL đích
async function getRedirectUrl(url) {
    // const proxy = 'http://proxy.example.com:8080'; // Địa chỉ proxy và cổng

    const browser = await puppeteer.launch({
        args: [
            `--proxy-server=${proxy}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080',
            '--disable-notifications',
            '--disable-web-security',
            '--disable-infobars',
            '--start-fullscreen',
            '--no-first-run',
            '--hide-scrollbars',
            '--disable-extensions'
        ]
    });

    const page = await browser.newPage();
    // await page.authenticate({
    //     username: 'user123', // Thay bằng tên người dùng của bạn
    //     password: 'pass123'  // Thay bằng mật khẩu của bạn
    // });

    try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 }); // Thêm timeout
    } catch (error) {
        console.error('Lỗi khi truy cập URL:', error);
        await browser.close();
        throw error;
    }

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
                // API
        // const redirectUrl = await getRedirectUrl(url);
        // // Sử dụng axios để gọi API geo.ipify.org
        // const apiKey = 'at_J45NhBuGQSyLmNfrVP5LtLVP2PvoX'; // Thay bằng API key của bạn
        // const ipifyUrl = `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${req.ip}`;

        // const response = await axios.get(ipifyUrl);
        // const country = response.data.location.country;

        // res.json({ originalUrl: redirectUrl, country });


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
