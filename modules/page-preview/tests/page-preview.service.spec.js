const assert = require('chai').assert;
const cheerio = require('cheerio');
const { getBrowser } = require('../../../puppeteer');

describe('Page preview service', () => {
    let service;
    let browser;
    let page;

    before(async () => {
        service = require('../page-preview.service');
        browser = getBrowser();
        page = await browser.newPage();
    })

    it('should get title from article if it have one', async () => {
        await page.goto('https://www.sparkfun.com/news/2571');
        const title = await service.getTitle(page);

        assert.isNotNull(title);
    })

    it.only('should always get image from article', async () => {
        // const URL = 'https://www.sparkfun.com/news/2571;
        const URL = 'https://www.bloomberg.com/news/features/2018-07-31/inside-the-life-of-waymo-s-driverless-test-family';
        page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36');
        await page.goto(URL, { timeout: 9999999 });
        const content = await page.content();
        page.dom = cheerio.load(content);
        const image = await service.getImage(page);

        assert.isNotNull(image);
    })

    it('should get description from article if it have one', async () => {
        await page.goto('https://www.theringer.com/movies/2018/7/23/17601024/movie-trailer-editors-marvel-pixar-how-made');
        const image = await service.getDescription(page);

        assert.isNotNull(image);
    })

    it('should return page preview', async () => {
        const pagePreview = await service.makePagePreview('https://www.theringer.com/movies/2018/7/23/17601024/movie-trailer-editors-marvel-pixar-how-made');

        assert.hasAllKeys(pagePreview, ['title', 'image', 'description']);
    })

    // takes 20+ seconds to complete
    it('should return many page previews', async () => {
        const pagePreviews = await service.makePagePreviews([
            'https://www.theringer.com/movies/2018/7/23/17601024/movie-trailer-editors-marvel-pixar-how-made',
            'https://www.sparkfun.com/news/2571',
            'https://en.wikipedia.org/wiki/Launch_loop',
            'https://stripe.com/issuing',
            'https://www.bloomberg.com/news/articles/2018-07-26/slack-and-atlassian-team-up-to-take-on-microsoft-in-chat-software',
        ])

        assert.equal(pagePreviews.length, 5);
    })
    
})