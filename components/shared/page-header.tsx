import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, className, children }: Props) {
  return (
    <section className={cn("bg-gradient-to-br from-primary/10 to-secondary/30 py-14 px-4", className)}>
      <div className="container mx-auto max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="text-lg text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
