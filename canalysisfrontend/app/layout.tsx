import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css"
import React from "react";
import {ColorSchemeScript, mantineHtmlProps, MantineProvider} from "@mantine/core";

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
          <ColorSchemeScript />
      </head>
      <body
      >
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
