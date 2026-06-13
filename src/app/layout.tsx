import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Image from "next/image";

export const metadata = {
  title: "Spybee | Gestión de Incidencias",
  description: "Sistema de gestion de incidencias",

  icons: {
    icon: "/icon.png",
  },

  applicationName:
    "Spybee",
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