import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "ResumeATS — AI-Powered ATS Resume Generator",
  description: "Generate ATS-optimized resumes and cover letters tailored to any job description using AI. Beat the applicant tracking system and land more interviews.",
  keywords: "resume, ATS, cover letter, AI, job application, career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="animated-bg" />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
