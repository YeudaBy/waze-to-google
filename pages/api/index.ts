import {NextApiRequest, NextApiResponse} from "next";
import {wazeScrapperV3} from "@/waze-scrapper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

    const {url} = req.body;
    if (!url || typeof url !== "string") return res.status(400).json({error: "Missing or invalid URL"});

    try {
        const points = await wazeScrapperV3(url)
        const googleUrl = "https://www.google.com/maps/place/" + points

        return res.status(200).json({googleUrl});
    } catch (e) {
        return res.status(500).json({error: "שגיאה בשרת: " + (e instanceof Error ? e.message : e)});
    }
}
