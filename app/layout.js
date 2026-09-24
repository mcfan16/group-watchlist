import "./globals.css";

export const metadata = {
  title: "GroupWatchlist",
  description: "A shared watch queue for the family",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
