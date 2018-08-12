const cheerio = require('cheerio');

const { getBrowser } = require('../../services/puppeteer');
const { getDb } = require('../../db');

const browser = getBrowser();
const db = getDb();
const summariesCollection = db.collection('pagesummaries');
const storiesCollection = db.collection('topstories');


const getPageSummary = async (storyId) => {
    let summary = await summariesCollection.findOne({ _id: storyId });

    if (summary) {
        return summary.html;
    }

    let story = await storiesCollection.findOne({ _id: storyId });
    if (!story) {
        //TODO: think about other solutions
        return null;
    }

    summary = await getArticleContent(story.url);
    if (summary) {
        await cachePageSummary({ id: storyId, summary });
    }

    return summary;
}

const cachePageSummary = async ({ id, summary }) => {
    return summariesCollection.insertOne({
        _id: id,
        html: summary
    })
}

const getArticleContent = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    const content = await scrapArticle(page);
    await page.close();
    return content;
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
    getPageSummary,
    getArticleContent
}