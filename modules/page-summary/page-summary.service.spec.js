const assert = require('chai').assert;

const { getBrowser } = require('../../services/puppeteer');
const { getDb } = require('../../db');

describe('Page summary service', () => {
    let service;
    let browser;
    let db;
    let storiesCollection;
    before(async () => {
        service = require('./page-summary.service');
        browser = await getBrowser();
        db = await getDb();
        storiesCollection = await db.collection('topstories');
    })

    it('should get article content', async () => {
        const URL = 'https://sanderknape.com/2018/08/two-years-with-cloudformation-lessons-learned/';

        const content = await service.getArticleContent(URL);
        
        assert(content);
    })

    it.skip('should fetch at least 90% of summaries', async () => {
        const stories = await storiesCollection.find().limit(50).toArray();
        
        const summaries = [];
        for (story of stories) {
            try {
                const summary = await service.getArticleContent(story.url);
                summaries.push(summary);
            } catch(err) {
                console.log('Error on ' + story.url);
            }
        }

        const summariesPercentage = summaries.length / stories.length;
        assert(summariesPercentage >= 0.9);
    })
})