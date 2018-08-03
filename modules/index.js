const pagePreviewController = require('./page-preview/page-preview.controller');
const pageSummaryController = require('./page-summary/page-summary.controller');
const storiesController = require('./stories/stories.controller');

module.exports = (api) => {
    pagePreviewController(api);
    storiesController(api);
    pageSummaryController(api);
}