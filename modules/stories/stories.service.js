const difference = require('lodash/difference');

const { getDb } = require('../../db');
const { getStories } = require('../../services/hackernews-api/stories');


const db = getDb();
const collection = db.collection('topstories');

const getTopStoriesDetails = async (ids) => {
    const stories = await getCachedTopStories(ids);
    
    const foundIds = stories.map(story => story._id)
    const notFoundIds = difference(ids, foundIds);
   
    if (notFoundIds.length) {
        const storiesToCache = await getStories(notFoundIds);
        await cacheStories(storiesToCache);
        
        stories.push(...storiesToCache)
    } 

    return stories;
}

const getCachedTopStories = async (ids) => {
    const stories = await collection.find({ _id: { $in: ids } }).toArray();

    return stories;
}

const cacheStories = (stories) => {
    return collection.insertMany(stories);
}

const cacheStory = (story) => {
    // TODO: not implemented
}

module.exports = {
    getTopStoriesDetails,
    getCachedTopStories,
    cacheStories
}