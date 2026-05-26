import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

// This file is web-only and used to configure the root HTML for every page in your app.
// It is only used during static rendering or pre-rendering.
export default function HTML({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* ScrollViewStyleReset makes web scrolling behave like React Native */}
        <ScrollViewStyleReset />

        {/* Global style to force dark background, disable text selection on layout, and add a premium custom scrollbar */}
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const globalStyles = `
  html, body {
    background-color: #0B0B0F !important;
    color: #FFFFFF !important;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  
  #root, #main {
    background-color: #0B0B0F !important;
    min-height: 100vh;
  }

  /* Custom premium scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #0B0B0F;
  }
  ::-webkit-scrollbar-thumb {
    background: #1C1D27;
    border: 2px solid #0B0B0F;
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #00FF88;
  }
`;
