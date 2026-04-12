// app/layout.tsx
import "./globals.css";
import { urbanist } from "@/lib/fonts";
import InitialLoader from "@/components/common/InitialLoader";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";   // ✅ ADD THIS

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body
        className={`${urbanist.className} min-h-screen bg-gray-50 antialiased`}
      >
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb, 0 0 5px #2563eb"
        />

        {/* Global Splash */}
        <InitialLoader />

        {children}

        {/* ✅ Toast Provider */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "16px",
              padding: "12px 16px",
            },
          }}
        />
      </body>
    </html>
  );
}