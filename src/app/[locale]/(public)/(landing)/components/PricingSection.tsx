import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PRICING_PLANS, PricingPlan } from "@/content/pricing";
import { signUpUrl } from "@/config/config";

const PricingSection = () => {
  const t = useTranslations("public.Pricing");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {PRICING_PLANS.map(
        ({
          title,
          price,
          cta,
          duration,
          features,
          isFeatured,
        }: PricingPlan) => (
          <Card key={`${title}-plan`}>
            <CardHeader className="space-y-2">
              <Typography variant="h3" className="text-primary">
                {t(title as any)}
              </Typography>
              <Typography className="text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Typography>
            </CardHeader>
            <CardContent>
              <p className="mb-4 flex items-center gap-1.5 font-semibold">
                <span className="text-3xl">${price}</span>
                <span className="text-sm">/ {t(duration as any)}</span>
              </p>
              <Link
                className={cn(
                  buttonVariants({
                    variant: isFeatured ? "default" : "outline",
                  }),
                  "w-full",
                )}
                href={signUpUrl}
              >
                {t(cta as any)}
              </Link>
            </CardContent>
            <CardFooter>
              <ul className="flex flex-col gap-y-2 text-sm">
                {features.map((feature) => (
                  <li
                    key={`${t(feature.title as any)}-feature`}
                    className="bg-success flex items-center gap-x-2"
                  >
                    <CircleCheck className="size-5 text-primary" />
                    {t(feature.title as any)}
                  </li>
                ))}
              </ul>
            </CardFooter>
          </Card>
        ),
      )}
    </div>
  );
};

export default PricingSection;
