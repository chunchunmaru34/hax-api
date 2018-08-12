const difference = require('lodash/difference');
const uniq = require('lodash/uniq');

const { getStory, getTopStoriesIds } = require('./services/hackernews-api/stories');
const { getCachedTopStories, cacheStories } = require('./modules/stories/stories.service');
const { scrapPagePreview, cachePagePreview } = require('./modules/page-preview/page-preview.service');
const { scrapArticle, cachePageSummary } = require('./modules/page-summary/page-summary.service');
const { getBrowser } = require('./services/puppeteer');

// avoid parallel execution because of lack of resources and huge data amount
module.exports = async () => {

    //stories
    let ids = await getTopStoriesIds();
    ids = uniq(ids);
    const cachedTopStories = await getCachedTopStories(ids);
    const cachedIds = cachedTopStories.map(story => story._id);

    const idsToFetch = difference(ids, cachedIds);

    console.log(`Preloading ${idsToFetch.length} stories`);

    const stories = [];
    for (id of idsToFetch) {
        await getStory(id).then(story => stories.push(story));
    }

    if (!stories.length) {
        return;
    }

    await cacheStories(stories);

    // previews & summaries
    const browser = await getBrowser();

    for (story of stories) {
        if (story.url && !story.url.endsWith('.pdf') && !story.url.startsWith('https://github.com/')) {
            let page = await browser.newPage();
            try {
                await page.goto(story.url, { timeout: 60000 });

                const preview = await scrapPagePreview(page);
                if (preview) {
                    await cachePagePreview({ preview, storyId: story._id });
                }

                const summary = await scrapArticle(page);
                if (summary) {
                    await cachePageSummary({ id: story._id, summary});
                }   
                
            } catch (error) {
                console.log(error);
            } finally {
                await page.close();
            }
        }
    }
};