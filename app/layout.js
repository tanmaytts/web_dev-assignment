import "./globals.css";

export const metadata = {
  title: "Notes App",
  description: "A full-stack Notes App built with Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
