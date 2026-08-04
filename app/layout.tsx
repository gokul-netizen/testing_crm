import { Toaster } from "sonner";
import "./globals.css";
import { UserProvider } from "@/app/context/userContext";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className="antialiased">
        <UserProvider>
          <main>
            {children}
          </main>
        </UserProvider>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}