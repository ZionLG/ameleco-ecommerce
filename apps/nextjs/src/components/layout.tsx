import { Toaster } from "sonner";

import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <>{children}</>
      <Toaster />
      <Footer />
    </>
  );
}
