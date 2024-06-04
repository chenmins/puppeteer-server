const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3200;

app.get('/screenshot', async (req, res) => {
    const { url, cookies } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],

            // headless: false, // 非无头模式
            // devtools: true   // 启用 DevTools
        });
        // 设置视口大小为全屏
        const page = await browser.newPage();

        // 设置视口大小
        await page.setViewport({ width: 1920, height: 1080 });

        // 解析并设置 cookies（如果提供的话）
        if (cookies) {
            const parsedCookies = JSON.parse(decodeURIComponent(cookies));
            await page.setCookie(...parsedCookies);
        }

        await page.goto(url, { waitUntil: 'networkidle2' });

        // 截取完整页面的截图
        const screenshot = await page.screenshot({ fullPage: true });

        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        res.status(500).send(`Error taking screenshot: ${error.message}`);
    }
});

app.get('/pdf', async (req, res) => {
    const { url, cookies } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],

            // headless: false, // 非无头模式
            // devtools: true   // 启用 DevTools
        });
        // 设置视口大小为全屏
        const page = await browser.newPage();

        // 设置视口大小
        await page.setViewport({ width: 1920, height: 1080 });

        // 解析并设置 cookies（如果提供的话）
        if (cookies) {
            const parsedCookies = JSON.parse(decodeURIComponent(cookies));
            await page.setCookie(...parsedCookies);
        }

        await page.goto(url, { waitUntil: 'networkidle2' });


        // const pdf = await page.pdf();
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        res.set('Content-Type', 'application/pdf');
        res.send(pdf);
    } catch (error) {
        res.status(500).send(`Error generating PDF: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
