"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpAction } from "@/lib/actions/actions";
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

export const SignUpForm: React.FC<any> = () => {
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

  async function onSubmit(f: SignUpFormFields) {
    const res = await signUpAction(f);
    console.log(res);
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
            Sign Up
          </Button>
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
