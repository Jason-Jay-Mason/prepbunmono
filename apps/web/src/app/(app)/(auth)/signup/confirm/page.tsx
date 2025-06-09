import { PageProps } from ".next/types/app/(app)/(auth)/signup/confirm/page";
import { env } from "@/config/env";
import { pendingUsers } from "@/lib/db/models/pendingUsers";
import { jwt } from "@/lib/jwt/jwt";
import { cookies } from "next/headers";
import posthog from "posthog-js";

//UPNEXT:
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
const Page: React.FC<PageProps> = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("confirmationSession")?.value;
  const now = new Date();

  if (!session) {
    return <ErrorPage />;
  }

  const claims = jwt.parse(session, env.JWT_SECRET);
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

  const pendingUser = await pendingUsers.readPendingUserByUid(claims.value.uid);
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
    pendingUser.value.expiresAt < now ||
    pendingUser.value.sessionToken !== session ||
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

  return (
    <div>
      <h1>Check this tomorrow</h1>
      <p>{pendingUser.value.confirmationToken}</p>
    </div>
  );
};

export default Page;
