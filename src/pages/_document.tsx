import {Head, Html, Main, NextScript} from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta property="og:image" content="/gr-sq.png"/>
                <meta property="og:title" content="וויז לגוגל מפות - Waze to Maps" key="title"/>
            </Head>
            <body className="antialiased">
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}
