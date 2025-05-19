"use client";
import { useEffect } from "react";

export function Hubspot() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      // Create and inject the HubSpot script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "hs-script-loader";
      script.async = true;
      script.defer = true;
      script.src = "https://js-na2.hs-scripts.com/242583344.js";

      script.onload = () => {
        console.log("HubSpot script loaded successfully");
      };

      script.onerror = () => {
        console.error("Failed to load HubSpot script");
      };

      // Append the script to the document head
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (typeof window !== "undefined") {
        const script = document.getElementById("hs-script-loader");
        if (script) {
          script.remove();
        }
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything
}
