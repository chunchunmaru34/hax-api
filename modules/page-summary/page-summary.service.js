const cheerio = require('cheerio');

const { getBrowser } = require('../../services/puppeteer');


const browser = getBrowser();

const getArticleContent = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    return scrapArticle(page);
}

const scrapArticle = async (page) => {
    await page.addScriptTag({ path: './utils/just-read-copy.js'});
    await page.addStyleTag({ path: './modules/page-summary/page.css' });
    const frames = await page.frames();
    const articleFrame = frames.find(frame => frame._name === 'simple-article');


    await articleFrame.addStyleTag({ path: './modules/page-summary/required-styles.css' });
    await articleFrame.addStyleTag({ path: './modules/page-summary/default-styles.css' });

    const iframeHtml = await articleFrame.content();
    return iframeHtml;
}


module.exports = {
    getArticleContent
}