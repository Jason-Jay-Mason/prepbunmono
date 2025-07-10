import { PageProps } from ".next/types/app/(app)/(auth)/signup/confirm/page";
import { env } from "@/config/env";
import { siteConfig } from "@/config/site";
import { SecurityCodeForm } from "@/lib/components/app/forms/securitycode";
import { PendingUserModel } from "@/lib/db/models/pendingUsers";
import { jwt } from "@/lib/jwt/jwt";
import { cookies } from "next/headers";
import posthog from "posthog-js";
import { cookieKeys } from "@/lib/api/types";

//UPNEXT:
//TODO: token input endpoint
//TODO: Error page component
//TODO: Clean up code
//TODO: Clean up services and models
const ErrorPage: React.FC<any> = () => {
  return (
    <div>
      <h1>Access Denied</h1>
      <p>Invalid authentication token. Please sign up again.</p>
    </div>
  );
};

export const revalidate = 300; // 5 minutes in seconds (siteConfig.auth.confirmationCodeTtl / 1000)
const Page: React.FC<PageProps> = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieKeys.confirmationSessionToken);
  const now = new Date();

  if (!session || !session.value) {
    return <ErrorPage />;
  }

  const claims = jwt.parse(session.value, env.JWT_STUDENT_SECRET);
  if (claims.isErr()) {
    switch (claims.error.type) {
      case "Invalid JWT signature":
      case "JWT malformed":
      case "Invalid claims object":
        return <ErrorPage />;
      default:
        posthog.captureException(claims.error);
        return <ErrorPage />;
    }
  }

  const pendingUser = await PendingUserModel.readPendingUserByUid(
    claims.value.uid,
  );
  if (pendingUser.isErr()) {
    switch (pendingUser.error.type) {
      case "No pending user found":
        return <ErrorPage />;
      default:
        posthog.captureException(pendingUser.error);
        return <ErrorPage />;
    }
  }
  if (
    pendingUser.value.sessionToken !== session.value ||
    !pendingUser.value.confirmationTokenExpires ||
    !pendingUser.value.confirmationToken
  ) {
    return <ErrorPage />;
  }

  if (
    pendingUser.value.confirmationTokenExpires < now &&
    pendingUser.value.expiresAt < now
  ) {
    //send new token screen
    return <ErrorPage />;
  }

  return <SecurityCodeForm />;
};

export default Page;
