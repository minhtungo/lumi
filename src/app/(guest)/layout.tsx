import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
