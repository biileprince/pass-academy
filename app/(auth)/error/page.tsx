import { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Authentication Error" };

export default function AuthErrorPage() {
  return (
    <Card>
      <CardHeader className="text-center space-y-2">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <CardTitle>Authentication Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          Something went wrong during sign in. This could be because the account
          doesn&apos;t exist or the provider is not configured.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild>
          <Link href="/login">Try again</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
