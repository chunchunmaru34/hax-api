const { getBrowser } = require('../../puppeteer')
const { getDb } = require('../../db');


const browser = getBrowser();

const getPagePreview = async (req, res, next) => {
    try {
        if (!req.query.url) {
            throw new Error('No url provided');
        }

        const pagePreview = await makePagePreview(req.query.url);

        return res.json(pagePreview); 
    } catch (error) {
        return next(error);
    }
   
}

const makePagePreview = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);

    const title = await getTitle(page);
    const image = await getImage(page);
    const description = await getDescription(page);

    return { title , description, image }
}

const getTitle = async (page) => {
    const titles = [];
    await page.$$('h1[class*=title]').then(results => titles.push(...results));
   
    if (!titles.length) {
       await page.$$('h1').then(results => titles.push(results[0]));
    }

    const title = await titles[0].getProperty('innerText');
    const titleJson = await title.jsonValue();

    return titleJson;
}

const getImage = async (page) => {
    // const images = [];
    // await page.$$('img').then(results => images.push(...results));

    // const properties = [];
    // images.forEach(image => properties.push(image.getProperties()));
    // const results = await Promise.all(properties);

    return makeScreenshot(page);
}

const makeScreenshot = async (page) => {
    const viewPortWidth = page.viewport().width;

    const config = {
        type: 'jpeg',
        quality: 75,
        clip: {
            x: 0,
            y: 100,
            height: 350,
            width: viewPortWidth,
        },
        encoding: 'base64'
    };

    const buffer = await page.screenshot(config)
    return buffer;
}

const getDescription = async (page) => {
    let smallTitles = await page.$$('h2');

    if (!smallTitles.length) {
        smallTitles = await page.$$('h3');
    } 
    
    if (!smallTitles.length) {
        return null;
    }

    const desc = await smallTitles[0].getProperty('innerText').then(text => text.jsonValue());
    
    return desc;
}

module.exports = (api) => {
    api.get('/pagePreview', getPagePreview)
}
    