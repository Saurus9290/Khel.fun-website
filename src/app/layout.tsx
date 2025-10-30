import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Use a path relative to the project root from the location of layout.tsx
// src/app/layout.tsx -> ../../public/fonts/KnightWarrior.otf
const knightWarrior = localFont({
    src: "../../public/fonts/KnightWarrior.otf", // Corrected relative path
    display: "swap", 
    variable: "--font-knight-warrior",
});

export const metadata: Metadata = {
    title: "Khel.fun - Onchain Gaming Platform",
    description: "Khel.fun is an innovative onchain gaming platform bringing competitive gaming to the blockchain",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${knightWarrior.variable} antialiased` }  suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
