import "./globals.css";

export const metadata = {
  title: "Recipe Generator",
  description: "AI-powered recipe generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
