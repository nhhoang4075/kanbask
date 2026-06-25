import "./globals.css";

export const metadata = {
  title: {
    default: "Kanbask",
    template: "%s · Kanbask"
  },
  description: "Collaborative task management solution for teams",
  keywords: ["task management", "collaboration", "project management", "team productivity"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <body className="flex items-center min-h-screen min-w-screen">{children}</body>
    </html>
  );
}
