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

const getManyPagePreviews = async (ws, req) => {
    ws.on('message', (msg) => {
        const previewInfos = JSON.parse(msg);
        
        for (info of previewInfos) {
            try {
                const preview = await lookForPreview({ url, storyId: _id });
                ws.send(JSON.stringify({ preview, _id}));    
            } catch(err) {
                console.log(err);
            }
        }
    })
}

module.exports = (api) => {
    api.get('/pagePreview', getPagePreview);

    api.ws('/pagePreviews', getManyPagePreviews);
}
    