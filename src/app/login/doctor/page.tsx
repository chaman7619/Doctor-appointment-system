
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function DoctorLoginPage() {
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await login(values, "doctor");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Doctor Login</CardTitle>
          <CardDescription>Enter your username to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your.username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            Don't have an account?{" "}
            <Button variant="link" asChild className="p-0">
              <Link href="/register/doctor">Sign Up Here</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
