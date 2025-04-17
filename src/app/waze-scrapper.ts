"use server"

import puppeteer from 'puppeteer';
import chromium from "@sparticuz/chromium";

export async function scrapeWazePage(url: string) {
    console.log('מתחיל את התהליך...');
    console.log(`פותח את הדף: ${url}`);

    // אפשרויות מורחבות לשרת
    const browserOptions = {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',  // מונע בעיות עם זיכרון משותף
            '--disable-gpu',            // לא צריך GPU בשרת
            '--disable-features=IsolateOrigins',
            '--disable-site-isolation-trials',
            '--no-zygote'               // מונע יצירת תהליכים נוספים
        ],
        executablePath: process.env.CHROME_BIN,  // אפשרות להגדיר נתיב מותאם אישית לכרום
    };

    // בדיקת זיכרון לדיאגנוסטיקה
    const memUsage = process.memoryUsage();
    console.log(`שימוש בזיכרון לפני הפעלת הדפדפן: ${JSON.stringify({
        rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB'
    })}`);

    let browser;
    try {
        // הפעלת דפדפן
        console.log('מנסה לפתוח דפדפן עם האפשרויות:', JSON.stringify(browserOptions));
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        // פתיחת דף חדש
        const page = await browser.newPage();

        // הגדרת User-Agent - לפעמים יעזור לעקוף הגבלות
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

        // הגדרת זמן המתנה ארוך יותר (30 שניות)
        await page.setDefaultNavigationTimeout(30000);

        console.log('מנסה לנווט לדף:', url);
        // ניווט לדף הרצוי
        const response = await page.goto(url, {waitUntil: 'networkidle2'});
        console.log(`סטטוס התגובה: ${response?.status()}`);
        console.log('הדף נטען');

        // המתנה נוספת כדי לוודא שכל האלמנטים טעונים
        console.log('ממתין לסלקטור h1.wm-poi-name-and-address__name');
        try {
            await page.waitForSelector('h1.wm-poi-name-and-address__name', {timeout: 15000});
            console.log('הסלקטור נמצא');
        } catch (error) {
            console.error(error)
            console.log('לא נמצא הסלקטור בזמן ההמתנה - ממשיך בכל מקרה');
            console.log('מבנה הדף הנוכחי:');
            // הדפסת מבנה בסיסי של הדף לדיאגנוסטיקה
            const pageStructure = await page.evaluate(() => {
                return {
                    title: document.title,
                    bodyChildren: Array.from(document.body.children).map(el => el.tagName),
                    h1Elements: Array.from(document.querySelectorAll('h1')).map(el => el.className || 'no-class')
                };
            });
            console.log(JSON.stringify(pageStructure, null, 2));
        }

        // שליפת הטקסט מהאלמנט
        const poiName = await page.evaluate(() => {
            const element = document.querySelector('h1.wm-poi-name-and-address__name');
            return element ? element.innerHTML : 'לא נמצא אלמנט התואם לסלקטור';
        });

        console.log('התוכן שנשלף:', poiName);

        // צילום מסך לדיאגנוסטיקה
        await page.screenshot({path: 'waze-page.png'});
        console.log('צילום מסך נשמר בקובץ waze-page.png');

        return poiName;

    } catch (error) {
        console.error('אירעה שגיאה במהלך התהליך:', error);
        return null;
    } finally {
        // סגירת הדפדפן
        if (browser) {
            await browser.close();
            console.log('הדפדפן נסגר');
        }
    }
}

export async function wazeScrapperV2(url: string) {
    let result = null;
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        await page.goto(url);

        result = await page.title();
    } catch (error) {
        console.log(error)
        throw new Error("Failed")
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
    return result
}
