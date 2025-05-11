import React from "react";
import "./styles.css";
import { getPayload } from "payload";
import config from "@/payload.config";

const Layout: React.FC<any> = async ({ children }) => {
  const p = await getPayload({ config });

  return (
    <html lang="en" className="">
      <body className="relative">
        <main className="z-10 min-h-[75dvh]">{children}</main>
      </body>
    </html>
  );
};

export default Layout;
