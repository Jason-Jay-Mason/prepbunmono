"use client";
import { Button } from "@/lib/ui/shadcn/button";
import Link from "next/link";
import { useState } from "react";
import { Login } from "./action";

export const DumbForm: React.FC<any> = () => {
  const [error, setError] = useState<string>("");

  async function handleSubmit(f: FormData) {
    setError("");
    const result = await Login(f);
    console.log(result);

    if (!result.success && result.errors) {
      setError(result.errors);
    }
  }
  return (
    <form className="w-full" action={handleSubmit}>
      <label className="font-bold">Username or Email</label>
      <input
        type="text"
        className="px-5 border mt-1 mb-5 border-border rounded-lg bg-white h-14 w-full"
      />
      <div className="flex justify-between">
        <label className="font-bold">Password</label>
        <Link className="underline text-sm" href="/login">
          forgot?
        </Link>
      </div>
      <input
        type="password"
        className="px-5 border mt-1 border-border rounded-lg bg-white h-14 w-full"
      />
      <Button size="lg" className="w-full mt-10" type="submit">
        Sign In
      </Button>
      {error && <p className="text-destructive text-center mt-5">{error}</p>}
      <p className="w-full text-center mt-5">
        Need an account?{" "}
        <Link
          href="https://meetings-na2.hubspot.com/thao-bui"
          className="underline"
        >
          Schedule your free session.
        </Link>
      </p>
    </form>
  );
};
