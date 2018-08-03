const puppeteer = require('puppeteer');

const puppeteerConfig = {
    headless: false,
    timeout: 0,
    // slowMo: 1000,
    // args: [
    //     '--disable-extensions-except=/media/aliaksei/Storage/projects/test/page-parser/utils/just-read.crx',
    //     '--load-extension=/media/aliaksei/Storage/projects/test/page-parser/utils/just-read.crx',
    // ]
}

let browser;

const initBrowser = async () => {
    browser = await puppeteer.launch(puppeteerConfig);
}

const closeBrowser = () => {
    return browser.close();
}

const getBrowser = () => {
    return browser;
}

module.exports = {
    initBrowser,
    getBrowser,
    closeBrowser
}