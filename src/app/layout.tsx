import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/providers/ThemeProvider";

export const metadata = {
  title: "Spybee Challenge",
  description: "Incident Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}