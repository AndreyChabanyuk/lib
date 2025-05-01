import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import AuthChecker from "@/components/AuthChecker";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthChecker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}