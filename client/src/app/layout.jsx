import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex items-center min-h-screen min-w-[98dvw]">
        {children}
      </body>
    </html>
  );
}
