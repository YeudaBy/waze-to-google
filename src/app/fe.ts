import * as cheerio from "cheerio";

export default async function getWaze(url: string) {

    try {
        const response = await fetch(url);
        console.log(response.status)

        if (!response.ok) {
            throw new Error("Failed to fetch")
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const text = $("body").text();

        const match = text.match(/\b(\d{1,2}\.\d+),(\d{1,3}\.\d+)\b/);
        if (!match)   throw new Error("cords not found")
        console.log(match)

        const lat = match[1];
        const lon = match[2];
        return  `https://www.google.com/maps?q=${lat},${lon}`
    } catch (e) {
        console.error(e)
    }
}
