const { getTopStoriesIds } = require('../../services/hackernews-api/stories');
const { getTopStoriesDetails } = require('./stories.service');

const getTopStories = async (req, res) => {
    const { page } = req.query;

    const ids = await getTopStoriesIds();
    const stories = await getTopStoriesDetails(ids);
    //TODO: paginate
    return res.json(stories);
}


module.exports = (api) => {
    api.get('/topstories', getTopStories);
}