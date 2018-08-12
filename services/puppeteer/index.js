const puppeteer = require('puppeteer');

const puppeteerConfig = {
    // headless: false,
    timeout: 300000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless', '--disable-gpu'],
    executablePath: '/usr/bin/chromium-browser'
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