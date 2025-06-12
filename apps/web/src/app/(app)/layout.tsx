import { QueryProvider } from "@/lib/query/QueryProvider";
import "../(prepbun)/styles.css";
import { VideoOverlay } from "@/lib/ui/VideoOverlat";
import { Toaster } from "sonner";

const Layout: React.FC<any> = async ({ children }) => {
  return (
    <html lang="en" className="">
      <QueryProvider>
        <body className="relative">
          <VideoOverlay />
          <Toaster position="bottom-center" richColors />
          {children}
        </body>
      </QueryProvider>
    </html>
  );
};

export default Layout;
