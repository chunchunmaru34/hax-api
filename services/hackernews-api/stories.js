const axios = require('axios');

const API = 'https://hacker-news.firebaseio.com/v0';
const ITEM_PATH = `${API}/item`;
const TOP_STORIES_PATH = `${API}/topstories`;


const getStory = id => {
    return axios.get(`${ITEM_PATH}/${id}.json`)
        .then(res => {
            const { data } = res;

            data._id = data.id;
            delete data.id;

            return data;
        });
}

const getStories = (storyIds) => {
    const promises = [];

    storyIds.forEach(storyId => {
        promises.push(getStory(storyId));
    })

    return Promise.all(promises);
}

const getTopStoriesIds = () => {
    return axios.get(TOP_STORIES_PATH + '.json').then(res => res.data);
}

module.exports = {
    getStories,
    getStory,
    getTopStoriesIds
};
