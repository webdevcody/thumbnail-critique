"use client";
"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Must include an email.",
  }),
});

export default function AccountPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useSession();
  const user = useQuery(
    api.users.getMyUser,
    isAuthLoading || !isAuthenticated ? "skip" : undefined
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const updateMyUser = useMutation(api.users.updateMyUser);

  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    form.setValue("name", user.name ?? "");
  }, [user, form]);

  return (
    <div className="mb-12">
      <h2 className="text-4xl font-bold mb-8">Account Settings</h2>

      <Form {...form}>
        <form
          className="max-w-sm"
          onSubmit={form.handleSubmit(async (values) => {
            await updateMyUser({
              name: values.name,
            })
              .then(() => {
                toast({
                  title: "Update Successful",
                  description: "Your display name was updated",
                  variant: "default",
                });
              })
              .catch((error) => {
                toast({
                  title: "Something went wrong",
                  description: "Could not update your display name",
                  variant: "destructive",
                });
              });
            form.reset();
          })}
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }: { field: any }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel className="flex flex-row space-x-1 items-center">
                  Display Name
                </FormLabel>
                <div className="flex items-center gap-4 mt-6 max-w-lg">
                  <FormControl>
                    <Input {...field} type="text" required />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button className="w-fit mt-4" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
