import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

export async function wazeScrapperV3(url: string) {
    let browser = null;

    // if (process.env.NODE_ENV === 'development') {
    //     browser = await puppeteer.launch({
    //         args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //         headless: true,
    //     });
    // }
    // if (process.env.NODE_ENV === 'production') {
    browser = await puppeteerCore.launch({
        args: [
            ...chromium.args,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });
    // }
    if (!browser) {
        return
    }
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    console.log('הדף נטען בהצלחה');

    await page.waitForSelector('h1.wm-poi-name-and-address__name', {timeout: 50000})
        .catch(() => {
            console.error('לא נמצא הסלקטור בזמן ההמתנה - ממשיך בכל מקרה')
        });

    const poiName = await page.evaluate(() => {
        const element = document.querySelector('h1.wm-poi-name-and-address__name');
        return element ? element.innerHTML : 'לא נמצא אלמנט התואם לסלקטור';
    });

    await browser.close();

    console.log('התוכן שנשלף:', poiName);
    return poiName;
}
