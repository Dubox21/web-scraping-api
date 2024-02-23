const express = require('express');
const { chromium } = require('playwright');

const app = express();
const port = 3001;

app.use(express.json());

app.get('/scrape', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }

    try {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(url);

        const title = await page.title();
        const description = await page.$eval('meta[name="description"]', element => element.content);

        await browser.close();

        const metadata = {
            title,
            description,
            url
        };

        res.json(metadata);
    } catch (error) {
        console.error('Error scraping:', error);
        res.status(500).json({ error: 'Error scraping the provided URL' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});