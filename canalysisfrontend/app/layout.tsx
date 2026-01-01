import type {Metadata} from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css"
import "@mantine/notifications/styles.css";
import React from "react";
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {FileProvider} from "@/app/provider/FileProvider";
import {KeywordProvider} from "@/app/provider/KeywordProvider";
import {ResultProvider} from "@/app/provider/ResultProvider";
import {ComposedFileProvider} from "@/app/provider/ComposedFileProvider";
import {PromptProvider} from "@/app/provider/PromptProvider";

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
                            <PromptProvider>
                                {children}
                            </PromptProvider>
                        </ComposedFileProvider>
                    </ResultProvider>
                </KeywordProvider>
            </FileProvider>
        </MantineProvider>
        </body>
        </html>
    );
}
