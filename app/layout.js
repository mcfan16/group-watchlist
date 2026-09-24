import "./globals.css";
import IdentityGate from "@/components/IdentityGate";

export const metadata = {
  title: "GroupWatchlist",
  description: "A shared watch queue for the family",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <IdentityGate>{children}</IdentityGate>
      </body>
    </html>
  );
}
