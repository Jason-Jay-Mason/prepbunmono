import { SignUpForm } from "@/lib/components/app/forms/signup";
import { MessagePage } from "@/lib/components/site/MessagePage";

const Page: React.FC<any> = () => {
  //TODO: if authed in, redirect to the authed page in middleware
  if (process.env.NODE_ENV === "production") {
    return (
      <MessagePage
        headline="We're Building"
        blurb="This part of the site is under construction. Prepare to have your mind blown..."
        videoSrc="https://res.cloudinary.com/daki5cwn0/video/upload/v1744836872/mindblowwn_ko7hhm.mov"
      />
    );
  }

  return <SignUpForm />;
};

export default Page;
