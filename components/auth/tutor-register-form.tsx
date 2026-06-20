"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/app/actions/auth";

const SUBJECTS = [
  { value: "MATH", label: "Mathematics" },
  { value: "ENGLISH", label: "English" },
  { value: "SCIENCE", label: "Science" },
  { value: "MEDIA", label: "Media & Arts" },
  { value: "OTHER", label: "Other" },
];

export function TutorRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TUTOR" },
  });

  async function onSubmit(data: RegisterInput) {
    if (selectedSubjects.length === 0) {
      toast({
        title: "Validation error",
        description: "Please select at least one subject",
        variant: "destructive",
      });
      return;
    }

    const result = await registerUser({ ...data, role: "TUTOR" });

    if (!result.success) {
      toast({
        title: "Registration failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created!",
      description: "Welcome! Complete your profile to start teaching.",
    });
    router.push("/profile/edit");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create your tutor account
        </h1>
        <p className="text-sm text-muted-foreground">
          Share your knowledge and teach courses.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            className="h-11 rounded-lg"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-11 rounded-lg"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjects">Primary subjects</Label>
          <Select
            value={selectedSubjects[0] || ""}
            onValueChange={(value) => {
              if (!selectedSubjects.includes(value)) {
                setSelectedSubjects([...selectedSubjects, value]);
              }
            }}
          >
            <SelectTrigger className="h-11 rounded-lg">
              <SelectValue placeholder="Select subjects..." />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subject) => (
                <SelectItem
                  key={subject.value}
                  value={subject.value}
                  disabled={selectedSubjects.includes(subject.value)}
                >
                  {subject.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() =>
                    setSelectedSubjects(
                      selectedSubjects.filter((s) => s !== subject)
                    )
                  }
                  className="text-sm bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20"
                >
                  {SUBJECTS.find((s) => s.value === subject)?.label} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 rounded-lg pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-11 rounded-lg"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-lg"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
