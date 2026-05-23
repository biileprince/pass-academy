"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/app/actions/password";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormInput = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormInput) {
    const result = await requestPasswordReset(data.email);
    if (!result.success) {
      toast({ title: "Request failed", description: result.error, variant: "destructive" });
      return;
    }
    setSent(true);
    if (result.data.resetUrl) setDevUrl(result.data.resetUrl);
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
          <MailCheck className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your inbox</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
        </div>
        {devUrl && (
          <div className="text-left rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
            <p className="font-semibold text-amber-800 mb-1">Dev mode — reset link:</p>
            <Link
              href={devUrl.replace(/^https?:\/\/[^/]+/, "")}
              className="text-primary break-all hover:underline"
            >
              {devUrl}
            </Link>
          </div>
        )}
        <Link
          href="/login"
          className="block text-sm font-semibold text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-11 rounded-lg"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <Button
          type="submit"
          className="w-full h-11 rounded-lg bg-brand-gradient shadow-brand text-white border-0 hover:opacity-90 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
