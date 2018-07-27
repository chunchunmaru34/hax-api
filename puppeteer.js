const puppeteer = require('puppeteer');

const puppeteerConfig = {
    headless: false
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