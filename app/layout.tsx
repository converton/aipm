import "./globals.css";
import { Sidebar } from "@/components/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="md:flex">
          <Sidebar />
          <main className="w-full p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
