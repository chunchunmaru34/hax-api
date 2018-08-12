const { getPageSummary } = require('./page-summary.service');
const { getStoryById } = require('../stories/stories.service.js');


const getSummary = async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        next(new Error('No id is provided'));
    }

    const content = await getPageSummary(+id);
    return res.json(({ html: content }));
    
}

module.exports = (app) => {
    app.get('/pageSummary/:id', getSummary);
}