const { getTopStoriesIds } = require('../../services/hackernews-api/stories');
const { getTopStoriesDetails } = require('./stories.service');

const getTopStories = async (req, res) => {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    let ids = await getTopStoriesIds();
    
    if (page && pageSize) {
        const pageStart = (page - 1) * pageSize;
        const pageEnd = pageStart + pageSize;
        ids = ids.slice(pageStart, pageEnd);
    }

    const stories = await getTopStoriesDetails(ids);
    
    return res.json(stories);
}


module.exports = (api) => {
    api.get('/topstories', getTopStories);
}