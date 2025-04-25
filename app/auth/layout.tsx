
import { Footer } from "@/components/shared/Footer";
import { ReactNode } from "react";




const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
       <h2 className="text-3xl mx-auto my-0">Информационный библиотечный комплекс</h2>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default AuthLayout;

/* export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <AuthChecker />
        <header className="flex items-center mt-15">
        <h2 className="text-3xl mx-auto my-0">Информационный библиотечный комплекс</h2>
        </header>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
} */
