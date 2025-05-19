"use server";

import { ActionResult } from "next/dist/server/app-render/types";
export async function Login(f: FormData): Promise<ActionResult> {
  return {
    success: false,
    errors: "Incorrect email or password",
  };
}
