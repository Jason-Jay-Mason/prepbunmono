"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/lib/ui/shadcn/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/shadcn/form";
import { Input } from "@/lib/ui/Input";
import { LoginFormFields, loginFormSchema } from "@/lib/zod/validators";
import { TextField } from "./fields";

export const LoginForm: React.FC<any> = (p) => {
  const form = useForm<LoginFormFields>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(f: LoginFormFields) {
    return;
  }
  return (
    <div className="w-full max-w-[425px]">
      <h1 className="text-3xl font-bold mb-6">Log In To Prepbun</h1>
      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <TextField
            name="username"
            type="text"
            control={form.control}
            label="Email or Username"
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative gap-0">
                <div className="flex w-full justify-between">
                  <FormLabel className="font-bold text-md">Password</FormLabel>
                  <Link href="/password/reset" className="underline">
                    Forgot?
                  </Link>
                </div>

                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="lg" className="w-full mt-5" type="submit">
            Sign In
          </Button>

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
      </Form>
    </div>
  );
};
