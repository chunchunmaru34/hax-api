const { getBrowser } = require('../../puppeteer')
const { getDb } = require('../../db');


const browser = getBrowser();

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

const { makePagePreview } = require('page-preview.service');

const getPagePreview = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return next(new Error('No url provided'));
    }

    const preview = await makePagePreview();

    return preview;
}

module.exports = (api) => {
    api.get('/pagePreview', getPagePreview)
}
    