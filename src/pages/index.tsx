import Image from "next/image";
import {useState} from "react";


export default function Home() {
    const [wazeUrl, setWazeUrl] = useState("");
    const [googleUrl, setGoogleUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setGoogleUrl("");
        try {
            const res = await fetch("/api/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url: wazeUrl}),
            });
            const data = await res.json();
            if (res.ok) {
                setGoogleUrl(data);
            } else {
                setError(data.error || "אירעה שגיאה");
            }
        } catch (err) {
            console.error(err)
            setError("שגיאה בעת שליחת הבקשה");
        }
        setLoading(false);
    };

    return (
        <div dir="rtl"
             className="min-h-screen flex flex-col items-center justify-center p-4 bg-radial from-green-100 from-25% to-blue-100">
            <Image src={"/logo.png"} alt={"Google and Waze shaking hands"} width={200} height={200}/>
            <h1 className="text-2xl test font-bold mb-4 text-center">המרת קישור מ-Waze ל-Google Maps</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <input
                    type="text"
                    className="w-full border p-2 rounded-xl mb-2"
                    placeholder="הדבק כאן קישור מ-Waze"
                    value={wazeUrl}
                    onChange={(e) => setWazeUrl(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-xl disabled:opacity-50"
                    disabled={loading || !wazeUrl.trim()}
                >
                    {loading ? "טוען..." : "המר"}
                </button>
                {loading && <p className={"text-xs"}>
                    זמן הבקשה אורך כ-עד 20 שניות
                </p>}
            </form>
            {googleUrl && (
                <div className="mt-4 text-center">
                    <p className="mb-2">קישור ל-Google Maps:</p>
                    <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {googleUrl}
                    </a>

                    <div className="flex gap-2 mt-4 item-center justify-center pointer">
                        <button className={"bg-blue-200 py-2 px-5 rounded-xl grow"}
                                onClick={() => navigator.clipboard.writeText(googleUrl)}>
                            העתק
                        </button>
                        <button className={"bg-blue-200 py-2 px-5 rounded-xl grow"}
                                onClick={() => navigator.canShare() && navigator.share({url: googleUrl})}>
                            שתף
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}


            <div className={"fixed bottom-0 text-gray-800 text-xs p-3"}>
                Created By <a href={"https://yeudaby.com"} target={"_blank"}>YeudaBy</a>
            </div>
        </div>
    );
}
