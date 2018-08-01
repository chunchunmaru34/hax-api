const { lookForPreview } = require('./page-preview.service');


const getPagePreview = async (req, res, next) => {
    try {
        if (!req.query.url) {
            throw new Error('No url provided');
        }

        const pagePreview = await makePagePreview(req.query.url);

        return res.json(pagePreview); 
    } catch (error) {
        return next(error);
    }
}

const getManyPagePreviews = (ws, req) => {
    ws.on('message', (msg) => {
        const previewInfo = JSON.parse(msg);
        previewInfo.forEach(({ url, _id }) => url && lookForPreview({ url, storyId: _id }).then(preview => ws.send(JSON.stringify({ preview, _id }))).catch(console.log));
    })
}

module.exports = (api) => {
    api.get('/pagePreview', getPagePreview);

    api.ws('/pagePreviews', getManyPagePreviews);
}
    