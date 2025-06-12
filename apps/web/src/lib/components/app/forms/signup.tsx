"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/lib/ui/shadcn/button";
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
import { SignUpFormFields, signUpFormSchema } from "@/lib/zod/validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { TextField } from "./fields";
import { rpc } from "@/lib/api/client";

export const SignUpForm: React.FC<any> = () => {
  const router = useRouter();
  const form = useForm<SignUpFormFields>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
      firstName: "",
      lastName: "",
    },
    mode: "onBlur",
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  async function onSubmit(f: SignUpFormFields) {
    try {
      if (!executeRecaptcha) return;
      const token = await executeRecaptcha("signup");
      const res = await rpc.api.v1.auth.signup.$post({
        json: {
          form: f,
          recaptcha: token,
        },
      });
      if (!res.ok) {
        toast.error("Unable to create account", {
          description:
            "We are having issues with our services at the moment. Please try again in a few hours.",
        });
        return;
      }
      const data = await res.json();
      if (data.error === "Existing account.") {
        toast.info("Account found!", {
          description: "We've sent a login code to your email.",
        });
        return;
        // return router.push("/login/code");
      }
      toast.success("Success", {
        description: "Please confirm your email.",
      });
      router.push("/signup/confirm");
    } catch (err) {
      toast.error("Unable to create account", {
        description:
          "We are having issues with our services at the moment. Please try again in a few hours.",
      });
    }
  }

  return (
    <div className="w-full max-w-[425px]">
      <h1 className="text-3xl font-bold mb-6">Create Prepbun Account</h1>
      <Form {...form}>
        <form
          className="w-full gap-2 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid md:grid-cols-2 gap-3">
            <TextField
              name="firstName"
              type="text"
              control={form.control}
              label="First Name"
            />

            <TextField
              name="lastName"
              type="text"
              control={form.control}
              label="Last Name"
            />
          </div>

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
                <FormLabel className="font-bold text-md">Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem className="relative gap-0">
                <FormLabel className="font-bold text-md">
                  Confirm Password
                </FormLabel>

                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="lg" className="w-full mt-5" type="submit">
            {form.formState.isSubmitting ? "Please wait..." : "Sign Up"}
          </Button>
          {form.formState.errors.root?.message && (
            <div className="text-destructive text-center pt-5">
              {form.formState.errors.root?.message}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
