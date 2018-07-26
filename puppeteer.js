const puppeteer = require('puppeteer');

const puppeteerConfig = {
    headless: false
}

let browser;

const initPuppeteer = async () => {
    browser = await puppeteer.launch(puppeteerConfig);
}

const getBrowser = () => {
    return browser;
}

module.exports = {
    initPuppeteer,
    getBrowser
}