import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const AUTH_BG =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-dvh flex-col items-center justify-center px-6 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left — image + brand quote */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex">
        <img
          src={AUTH_BG}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-gradient opacity-85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20" />

        <Link
          href="/"
          className="relative z-20 flex items-center gap-2.5 text-lg font-bold"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 ring-1 ring-white/30">
            <Image
              src="/pas-logo.jpeg"
              alt="PAS Academy logo"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>
          {APP_NAME}
        </Link>

        <div className="relative z-20 m-auto max-w-md text-center">
          <blockquote className="space-y-4">
            <p className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
              Learn. Create. Connect.
            </p>
            <footer className="text-lg font-medium text-white/85 drop-shadow-sm">
              Join thousands of students growing through mentorship, quality
              tutorials, and community.
            </footer>
          </blockquote>
        </div>

        <p className="relative z-20 text-sm text-white/70">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="w-full lg:p-8 py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-100">
          <Link
            href="/"
            className="flex items-center justify-center gap-2.5 font-bold text-lg lg:hidden"
          >
            <div className="h-9 w-9 rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5 flex items-center justify-center">
              <Image
                src="/pas-logo.jpeg"
                alt="PAS Academy logo"
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-brand-gradient">{APP_NAME}</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
