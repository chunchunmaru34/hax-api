const difference = require('lodash/difference');
const uniq = require('lodash/uniq');

const { getStory, getTopStoriesIds } = require('./services/hackernews-api/stories');
const { getCachedTopStories, cacheStories } = require('./modules/stories/stories.service');
const { makePagePreview, cachePagePreview } = require('./modules/page-preview/page-preview.service');
const { getArticleContent, cachePageSummary } = require('./modules/page-summary/page-summary.service');

// avoid parallel execution because of lack of resources and huge data amount
module.exports = async () => {

    //stories
    let ids = await getTopStoriesIds();
    ids = uniq(ids);
    const cachedTopStories = await getCachedTopStories(ids);
    const cachedIds = cachedTopStories.map(story => story._id);

    const idsToFetch = difference(ids, cachedIds);

    const stories = [];
    for (id of idsToFetch) {
        await getStory(id).then(story => stories.push(story));
    }

    if (!stories.length) {
        return;
    }

    await cacheStories(stories);

    // previews & summaries
    for (story of stories) {
        try {
            if (story.url && !story.url.endsWith('.pdf')) {
                const preview = await makePagePreview(story.url);
                if (preview) {
                    await cachePagePreview({ preview, storyId: story._id });
                }

                const summary = await getArticleContent(story.url);
                if (summary) {
                    await cachePageSummary({ id: story._id, summary});
                }   
            }
        } catch (error) {
            console.log(error);
        }
    }
};