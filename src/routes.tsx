import Facebook from "@/components/icons/Facebook";
import {
  CreditCard,
  MessageSquareMore,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Instagram from "./components/icons/Instagram";
import Discord from "./components/icons/Discord";

export const publicRoutes = ["/", "/pricing", "/about", "/test", "/contact-us"];

export const apiAuthPrefix = "/api";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

export const signInHref = "/auth/sign-in";
export const signUpHref = "/auth/sign-up";
export const forgotPasswordHref = "/auth/forgot-password";
export const authErrorHref = "/auth/error";
export const emailVerificationHref = "/auth/verification";
export const resetPasswordHref = "/auth/reset-password";

export const authRoutes = [
  signInHref,
  signUpHref,
  authErrorHref,
  emailVerificationHref,
  forgotPasswordHref,
  resetPasswordHref,
];

export const PROTECTED_BASE_URL = "/dashboard";

export const NAV_LINKS = [
  {
    title: "About.title",
    href: "/about",
  },
  {
    title: "Pricing.title",
    href: "/pricing",
  },
  {
    title: "ContactUs.title",
    href: "/contact-us",
  },
];

export const FOOTER_LINKS = [
  {
    title: "About.title",
    href: "/about",
  },
  {
    title: "Pricing.title",
    href: "/pricing",
  },
  {
    title: "ContactUs.title",
    href: "/contact-us",
  },
];

export const DASHBOARD_LINKS = [
  {
    title: "Profile",
    href: `${PROTECTED_BASE_URL}/settings`,
    icon: <UserRound className="size-[18px]" />,
  },
  {
    title: "Billing",
    href: `${PROTECTED_BASE_URL}/settings/billing`,
    icon: <CreditCard className="size-[18px]" />,
  },
  {
    title: "Security",
    href: `${PROTECTED_BASE_URL}/settings/security`,
    icon: <ShieldCheck className="size-[18px]" />,
  },
  {
    title: "Support",
    href: `${PROTECTED_BASE_URL}/settings/support`,
    icon: <MessageSquareMore className="size-[18px]" />,
  },
];

export const USER_DASHBOARD_LINKS = [
  {
    title: "Profile",
    href: `${PROTECTED_BASE_URL}/settings`,
    icon: <UserRound className="size-4" />,
  },
  {
    title: "Billing",
    href: `${PROTECTED_BASE_URL}/settings/billing`,
    icon: <CreditCard className="size-4" />,
  },
  {
    title: "Support",
    href: `${PROTECTED_BASE_URL}/settings/support`,
    icon: <MessageSquareMore className="size-4" />,
  },
];

export const ADMIN_DASHBOARD_LINKS = [
  {
    title: "Overview",
    href: `${PROTECTED_BASE_URL}/admin`,
  },
  {
    title: "Mail",
    href: `${PROTECTED_BASE_URL}/admin/mail`,
  },
];

export const SOCIAL_LINKS = [
  {
    title: "Facebook",
    href: "#",
    icon: (
      <Facebook className="size-5 text-muted-foreground hover:text-accent-foreground" />
    ),
  },
  {
    title: "Instagram",
    href: "#",
    icon: (
      <Instagram className="size-5 text-muted-foreground hover:text-accent-foreground" />
    ),
  },
  {
    title: "Discord",
    href: "#",
    icon: (
      <Discord className="size-5 text-muted-foreground hover:text-accent-foreground" />
    ),
  },
];
