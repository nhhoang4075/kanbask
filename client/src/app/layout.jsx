import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex font-roboto items-center min-h-screen min-w-screen">{children}</body>
    </html>
  );
}
