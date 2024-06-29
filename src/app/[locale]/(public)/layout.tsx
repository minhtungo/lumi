import Footer from "@/components/Footer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import NavButtons from "@/components/NavButtons";
import Navbar from "@/components/Navbar";
import { locales } from "@/lib/config";
import { unstable_setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function GuestLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  return (
    <>
      <Navbar navButtons={<NavButtons />} />
      <MaxWidthWrapper className="min-h-[calc(100vh-180px)] w-full">
        {children}
      </MaxWidthWrapper>
      <Footer />
    </>
  );
}
