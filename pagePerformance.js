const puppeteer = require('puppeteer');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('Configuration.properties');
var Logger = require('./Logger');
var logger =  new Logger().getInstance();
const fs = require('fs');
//const influx = require('./dataModelInflux');
var performanceTiming;

//utils.readProps(properties)
const ignoreHTTPSErrorsVal=properties.get('browser.ignoreHTTPSErrors') || true;
const headlessVal=properties.get('browser.headless') || true;
const slomoVal=properties.get('browser.slomo') || 100;
const viewportWidthVal=properties.get('browser.viewportWidth') || 1280;
const viewportHeigthVal=properties.get('browser.viewportHeight') || 720;
const deviceScaleFactorVal=properties.get('browser.deviceScaleFactor') || 1;
const setCacheEnabledVal=properties.get('page.setCacheEnabled') || true;
const setDefaultTimeoutVal=properties.get('page.setDefaultTimeout') || 60000;
const hostname=properties.get('host');
const sessions=properties.get('sessions');


function loadtest() {
  (async () => {
    
    logger.info("Initiating the browser process")
    const browser = await puppeteer.launch({
      args: ['--enable-features=NetworkService',"--start-fullscreen"],
      ignoreHTTPSErrors: ignoreHTTPSErrorsVal,
      headless: headlessVal,
      //timeout: 40000
      slowMo: slomoVal
    });
    
    if(browser == null) {
        logger.error("Error while launching the browser.");
    }

    //For running test in first tab of browser only
    const pages = await browser.pages();
    const page = pages[0];

    //Printing page url when onload event occurs
    page.on('load', () => logger.debug("Loaded:"+hostname));
    logger.info("Host is " + hostname);

    try {
      //setting view port of opened page. This will render opened page in given width & height
      await page.setViewport({
        width: viewportWidthVal,
        height: viewportHeigthVal,
        deviceScaleFactor: deviceScaleFactorVal,
      });
      await page.setCacheEnabled(setCacheEnabledVal);
      await page.setDefaultTimeout(setDefaultTimeoutVal);
      
      logger.info("Instrumenting render process..");
      for(var i=0;i<sessions;i++) {
        await page.goto(hostname);
        await Promise.all([
          page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] }),
        ]);
        performanceTiming = JSON.parse(
          await page.evaluate(() => JSON.stringify(window.performance.timing))
          );

        //pushing data samples to influx db
        //influx.insertSample(performanceTiming);
        console.log(JSON.stringify(performanceTiming));
        }
    }
    catch (error) {
      logger.error(error);
    }
    finally {
      logger.info("Closing browser sessions.");
      try{
        await page.close();
        await browser.close();
      }
      catch(error) {
          logger.warn("Error while closing the browser. Please check for the zombie processes.");
      }
    }
  })();
}

// execution of test cases in iterative manner
loadtest()