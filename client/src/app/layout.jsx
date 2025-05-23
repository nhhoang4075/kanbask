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
      <body className="flex items-center min-h-screen min-w-screen">{children}</body>
    </html>
  );
}
