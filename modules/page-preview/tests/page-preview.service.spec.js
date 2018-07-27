const assert = require('chai').assert;
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

    it('should always get image from article', async () => {
        await page.goto('https://www.sparkfun.com/news/2571');
        const image = await service.getDescription(page);

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
})