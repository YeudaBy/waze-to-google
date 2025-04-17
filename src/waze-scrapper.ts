import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";

export async function wazeScrapperV3(url: string) {
    const isDev = process.env.DEV_MODE === "DEV" //!chromium.headless; // דרך נוחה לדעת שאתה לוקאלי
    console.log(isDev)
    const browser = await (isDev ? puppeteer : puppeteerCore).launch({
        args: isDev ? ['--no-sandbox'] : chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: isDev ? undefined : await chromium.executablePath(),
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, {waitUntil: "networkidle2"});

    await page.waitForSelector('h1.wm-poi-name-and-address__name', {timeout: 5000})
        .catch(() => console.warn('לא נמצא הסלקטור - ממשיך'));


    // @ts-expect-error some ts shit
    const poiName = await page.evaluate(() => {
        const el = document.querySelector('h1.wm-poi-name-and-address__name');
        return el ? el.textContent : 'לא נמצא אלמנט תואם';
    });

    await browser.close();
    return poiName;
}

