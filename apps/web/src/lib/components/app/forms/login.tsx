"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/lib/ui/shadcn/button";
import Link from "next/link";
import { Control, FieldPath, FieldValues, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/shadcn/form";
import { Input } from "@/lib/ui/Input";
import {
  LoginFormFields,
  SignUpFormFields,
  signUpFormSchema,
  loginFormSchema,
} from "@/lib/zod/validators";
import { hc } from "hono/client";
import { HonoApp } from "@/app/api/v1/[[...route]]/route";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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

const client = hc<HonoApp>("/");
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
      const res = await client.api.v1.auth.signup.$post({
        json: {
          form: f,
          recaptcha: token,
        },
      });
      if (!res.ok) {
        console.log(await res.json());
        toast.error("Server Error", {
          description: "There was a problem. Try again later.",
        });
        return;
      }
      toast.success("Success", {
        description: "Please confirm your email.",
      });
      router.push("/signup/confirm");
    } catch (err) {
      toast.error("There was a problem on our end. Please try again later.");
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

function TextField<T extends FieldValues>({
  name,
  label,
  control,
  type,
}: {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  type: string;
}) {
  return (
    <FormField
      key={name}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative gap-0">
          <FormLabel className="font-bold text-md">{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
