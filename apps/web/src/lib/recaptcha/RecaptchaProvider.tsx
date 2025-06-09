"use client";
import { env } from "@/config/env";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const RecaptchaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      {children}
    </GoogleReCaptchaProvider>
  );
};
