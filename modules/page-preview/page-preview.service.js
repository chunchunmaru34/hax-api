const cheerio = require('cheerio');

const { getBrowser } = require('../../services/puppeteer');
const { getDb } = require('../../db');


const browser = getBrowser();
const collection = getDb().collection('pagepreviews');

const lookForPreview = async ({ storyId, url }) => {
    let preview = await collection.findOne({ _id: storyId });

    if (preview) {
        return preview;
    }

    preview = await makePagePreview(url);
    if (preview) {
        await cachePagePreview({ preview, storyId });
        return preview;
    }
}

const makePagePreview = async (url) => {
    let page;
    try {
        if (url.endsWith('.pdf') || url.startsWith('https://github.com')) {
            return null;
        }
        
        page = await browser.newPage();
        await page.goto(url, { timeout: 60000 });
        const preview = scrapPagePreview(page);
        return preview;
    } finally {
        await page.close();
    }
    
}

const makePagePreviews = async (urls) => {
    const promises = [];
    urls.forEach(url => {
        promises.push(makePagePreview(url));
    });

    return Promise.all(promises);
}

const cachePagePreview = ({ preview, storyId }) => {
    preview._id = storyId;
    return collection.insertOne(preview);
}




const scrapPagePreview = async (page) => {
    const content = await page.content();
    page.dom = cheerio.load(content);

    const title = await getTitle(page);
    const image = await getImage(page);
    const description = await getDescription(page);

    return { title , description, image };
}

const getTitle = async (page) => {
    const titles = [];
    await page.$$('h1[class*=title]').then(results => titles.push(...results));
   
    if (!titles.length) {
       await page.$$('h1').then(results => titles.push(...results));
    }

    if (!titles.length) {
        await page.$$('h2').then(results => titles.push(...results));
    }

    if (!titles.length) {
        await page.$$('h3').then(results => titles.push(...results));
    }

    if (!titles.length) {
        return null;
     }

    const title = await titles[0].getProperty('innerText');
    const titleJson = await title.jsonValue();

    return titleJson;
}

const getImage = async (page) => {
    const doScreenShot = async () => {
        const screenshot = await makeScreenshot(page);
        return {
            type: 'base64',
            src: screenshot,
        }
    }
    let pImages = await page.$$('img');
    if (!pImages.length) {
        return doScreenShot();
    }

    pImages = await pImages.map(image => Promise.all([
        image.getProperty('width'),
        image.getProperty('height'),
        image.getProperty('src'),
    ]));
    pImages = await Promise.all(pImages);
    pImages = await Promise.all(pImages.map(image => Promise.all(image.map(prop => prop.jsonValue()))));

    let metadata = pImages.map(params => ({ width: params[0], height: params[1], src: params[2] }));

    metadata = metadata.filter(item => item.width && item.height);
    if (!metadata.length) {
        return doScreenShot();
    }
    metadata.sort((a, b) => b.width * b.height - a.width * a.height);

    if (metadata[0].width < 250) {
        return doScreenShot();
    };

    return {
        type: 'url',
        src: metadata[0].src
    }
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

module.exports = {
    makePagePreview,
    makePagePreviews,
    getTitle,
    getDescription,
    getImage,
    lookForPreview,
    cachePagePreview,
    scrapPagePreview
}