import { Toaster } from "sonner";

 


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className="antialiased">
        <main>
          {children}
        </main>
         <Toaster position="top-right" richColors/>
      </body>
    </html>
  );
}