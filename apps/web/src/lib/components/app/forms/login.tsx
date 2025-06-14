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
import { rpc } from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClientError } from "@/lib/error/types";

export const LoginForm: React.FC<any> = (p) => {
  const router = useRouter();

  const form = useForm<LoginFormFields>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: async (f: LoginFormFields) => {
      const res = await rpc.api.v1.auth.signin.$post({
        json: f,
      });
      const j = await res.json();
      if (!res.ok || !j.data) {
        throw new ClientError(j.error || "Server error", {
          description:
            j.message ||
            "There was a problem with our services, please try again in a few hours.",
        });
      }
      return j;
    },
    onSuccess: (j) => {
      const userData = {
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        ...j.data,
      };

      queryClient.setQueryData(["user"], userData);

      toast.success("Login success", {
        description: "You have been successfully logged in.",
      });

      router.push("/");
    },
    onError: (e: ClientError) => {
      form.setError("root", {
        message: e.description,
      });
      toast.error(e.message, {
        description: e.description,
      });
    },
  });

  return (
    <div className="w-full max-w-[425px]">
      <h1 className="text-3xl font-bold mb-6">Log In To Prepbun</h1>
      <Form {...form}>
        <form
          className="w-full"
          onSubmit={form.handleSubmit((f) => loginMutation.mutate(f))}
        >
          <TextField
            name="email"
            type="text"
            control={form.control}
            label="Email"
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
          {form.formState.errors.root && (
            <FormMessage className="text-center pt-2 text-red-600">
              {form.formState.errors.root.message}
            </FormMessage>
          )}

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
