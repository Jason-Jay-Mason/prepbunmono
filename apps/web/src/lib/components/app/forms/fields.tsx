"use client";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/shadcn/form";
import { Input } from "@/lib/ui/Input";

export function TextField<T extends FieldValues>({
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
