import { LoginLayout } from "@/lib/components/app/layouts/LoginLayout";
import { RecaptchaProvider } from "@/lib/recaptcha/RecaptchaProvider";

const Layout: React.FC<any> = async ({ children }) => {
  return (
    <LoginLayout>
      <RecaptchaProvider>{children}</RecaptchaProvider>
    </LoginLayout>
  );
};

export default Layout;
