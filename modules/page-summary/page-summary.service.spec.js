const assert = require('chai').assert;

const { getBrowser } = require('../../services/puppeteer');

describe('Page summary service', () => {
    let service;
    let browser;
    before(async () => {
        service = require('./page-summary.service');
        browser = await getBrowser();
    })

    it('should get article content', async () => {
        const URL = 'https://medium.freecodecamp.org/the-top-data-structures-you-should-know-for-your-next-coding-interview-36af0831f5e3';

        const content = await service.getArticleContent(URL);
        console.log(content);
    })
})