import React from "react";
import "../(prepbun)/styles.css";
import { VideoOverlay } from "@/lib/ui/VideoOverlat";
import { LoginLayout } from "@/lib/components/app/layouts/LoginLayout";

const Layout: React.FC<any> = async ({ children }) => {
  return (
    <html lang="en" className="">
      <body className="relative">
        <VideoOverlay />
        <LoginLayout>{children} </LoginLayout>
      </body>
    </html>
  );
};

export default Layout;
