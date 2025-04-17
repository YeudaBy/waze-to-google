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
                setGoogleUrl(data.googleUrl);
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
        <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">המרת קישור מ-Waze ל-Google Maps</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <input
                    type="text"
                    className="w-full border p-2 rounded mb-2"
                    placeholder="הדבק כאן קישור מ-Waze"
                    value={wazeUrl}
                    onChange={(e) => setWazeUrl(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
                    disabled={loading || !wazeUrl.trim()}
                >
                    {loading ? "טוען..." : "המר"}
                </button>
            </form>
            {googleUrl && (
                <div className="mt-4 text-center">
                    <p className="mb-2">קישור ל-Google Maps:</p>
                    <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {googleUrl}
                    </a>
                </div>
            )}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
}
