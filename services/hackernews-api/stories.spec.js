const { expect } = require('chai').expect;
const assert = require('chai').assert;
const axios = require('axios');

const { getStories, getTopStoriesIds, getStory } = require('./stories');

describe('Hackernews api test', () => {
    describe('Top stories fetching test', async () => {
        let storyIds;
    
        before(async () => {
            storiesIds = await getTopStoriesIds();
        })
    
        it('should fetch array', () => {
            assert.isArray(storiesIds);
        })
    
        it('should not fetch empty array', () => {
            assert.notEqual(storiesIds.length, 0);
        })
    
        it('should fetch array of numbers', () => {
            assert.typeOf(storiesIds[0], 'number');
        })
    });

    describe('Single story fetch', () => {
        let testedStory;
        before(async () => {
            testedStory = await getStory(17612540);
        })

        it('should return an object', () => {
            assert.isObject(testedStory)
        } )
    });

    describe('Multiple stories fetch', () => {
        
        it ('should return all requested stories', async () => {
            const storyIds = [17615068, 17612540, 17600305, 17607845, 17612667, 17608261, 17614310];
            const stories = await getStories(storyIds);
            assert.equal(stories.length, storyIds.length);
        })
    })
})

