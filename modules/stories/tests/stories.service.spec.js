const assert = require('chai').assert;

const mockStories = require('./mock-stories');
const { getDb } = require('../../../db');

describe('Story caching service', () => {
    let service;
    let collection;

    before(async () => {
        service = require('../stories.service');
        let db = getDb();
        collection = db.collection('topstories');
    });
    
    beforeEach(() => {
        collection.deleteMany({});
    })

    it('should save stories to db', async () => {
        await service.cacheStories(mockStories);

        const ids = mockStories.map(story => story.id);
        const savedStories = await collection.find({ id: { $in: ids } }).toArray();

        assert.sameDeepMembers(mockStories, savedStories);
    })
    

    it('should get stories from db', async () => {
        await collection.insertMany(mockStories);

        const ids = mockStories.map(story => story._id);
        const stories = await service.getCachedTopStories(ids);

        assert.sameDeepMembers(mockStories, stories);
    })

    it('should get top stories and cache it if not', async () => {
        await collection.insertMany(mockStories.slice(0, -2));

        const allIds = mockStories.map(story => story._id);
        const stories = await service.getTopStoriesDetails(allIds);

        const returnedStoriesIds = stories.map(story => story._id);

        assert.sameDeepMembers(allIds, returnedStoriesIds);
    })
    
})