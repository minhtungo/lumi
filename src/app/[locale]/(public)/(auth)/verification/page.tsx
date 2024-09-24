import Page from "@/components/layout/Page";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import VerificationForm from "./VerificationForm";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "pages.EmailVerification",
  });

  return {
    title: t("title"),
  };
}

const VerificationPage = ({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) => {
  unstable_setRequestLocale(locale);

  return (
    <Page className="flex h-full w-full items-center justify-center">
      <Suspense>
        <VerificationForm />
      </Suspense>
    </Page>
  );
};

export default VerificationPage;
