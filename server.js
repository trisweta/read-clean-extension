const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/process', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        //page content
        const pageContent = await page.content();
        const $ = cheerio.load(pageContent);

        //unwanted elements
        const selectorsToRemove = [
            'img', 'iframe', 'script', 'style', 'nav', 'footer', 'aside', 'header', 'ins', '.ad', '.advertisement',  'li', 'ul', 'ol'];
        selectorsToRemove.forEach(selector => $(selector).remove());

        //extract and clean content
        let cleanedContent = $('body').html();
        cleanedContent = sanitizeHtml(cleanedContent, {
            allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote',],
            allowedAttributes: {},
            allowedStyles: {}
        });

        const style = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    line-height: 1.6;
                    color: #333;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-weight: bold;
                    margin-top: 20px;
                }
                p {
                    margin: 10px 0;
                }
                blockquote {
                    margin: 20px 0;
                    padding: 10px 20px;
                    background-color: #f9f9f9;
                    border-left: 5px solid #ccc;
                }
                li {
                    margin: 5px 0;
                }
            </style>
        `;

        //resp
        res.json({ content: cleanedContent, style });
    } catch (error) {
        console.error('Error processing page:', error);
        res.status(500).send('Error processing page');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
