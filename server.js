// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3200;

app.get('/screenshot', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const screenshot = await page.screenshot({ fullPage: true });
        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        res.status(500).send('Error taking screenshot');
    }
});

app.get('/pdf', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        res.set('Content-Type', 'application/pdf');
        res.send(pdf);
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
