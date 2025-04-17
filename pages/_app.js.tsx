import {NextPage} from "next";
import {ReactNode} from "react";
import "../styles/global.css"
import "../styles/main.scss"


export default function MyApp({Component}: {
    Component: NextPage
}) {
    return (
        <Layout>
            <Component/>
        </Layout>
    )
}

function Layout({children}: { children: ReactNode }) {
    return (
        <>
            <main className={"about-language"}>{children}</main>
        </>
    )
}
