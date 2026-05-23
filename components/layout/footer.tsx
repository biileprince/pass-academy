import Image from "next/image";
import Link from "next/link";
import { APP_NAME, SOCIAL_LINKS, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl"
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
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering students through mentorship, quality tutorials, and
              career guidance. Learn. Create. Connect.
            </p>
            <div className="flex gap-4">
              {Object.entries(SOCIAL_LINKS).map(([name, href]) => (
                <Link
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground capitalize text-sm transition-colors"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Platform</h3>
            <ul className="space-y-2">
              {NAV_LINKS.slice(2).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Enroll
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for students everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
