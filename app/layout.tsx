"use client"
import "@mantine/core/styles.css";
import React, {useEffect, useState} from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "../theme";
import "@mantine/dropzone/styles.css";
import { HydrationOverlay } from "@builder.io/react-hydration-overlay";


// export const metadata = {
//   title: "Exabytes CIS",
//   description: "Image Uploader app for CIS purposes",
// };

export default function RootLayout({ children }: { children: any }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <title>Exabytes CIS</title>
      </head>
      <body>
]        <MantineProvider theme={theme} forceColorScheme="dark">
          <HydrationOverlay>{children}</HydrationOverlay>
        </MantineProvider>
      </body>
    </html>
  );
}
