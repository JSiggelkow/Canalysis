import type {Metadata} from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css"
import "@mantine/notifications/styles.css";
import React from "react";
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {FileProvider} from "@/app/provider/FileProvder";
import {KeywordProvider} from "@/app/provider/KeywordProvider";
import {ResultProvider} from "@/app/provider/ResultProvider";
import {ComposedFileProvider} from "@/app/provider/ComposedFileProvider";

export const metadata: Metadata = {
    title: "Canalysis",
    description: "Course Outline Analysis Tool",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript/>
        </head>
        <body
        >
        <MantineProvider>
            <Notifications/>
            <FileProvider>
                <KeywordProvider>
                    <ResultProvider>
                        <ComposedFileProvider>
                            {children}
                        </ComposedFileProvider>
                    </ResultProvider>
                </KeywordProvider>
            </FileProvider>
        </MantineProvider>
        </body>
        </html>
    );
}
