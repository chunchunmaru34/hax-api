const { getArticleContent } = require('./page-summary.service');
const { getStoryById } = require('../stories/stories.service.js');


const getContent = async (req, res, next) => {
    const { url, id } = req.query;

    if (!url && !id) {
        next(new Error('No url is provided'));
    }

    if (url) {
        const content = await getArticleContentByUrl(url);
        return res.json({ html: content });
    }

    if (id) {
        const story = await getStoryById(+id);
        
        if (!story) {
            return null;
        }

        const content = await getArticleContent(story.url);``
        return res.json(({ html: content }));
    }
}

module.exports = (app) => {
    app.get('/pageSummary', getContent);
}