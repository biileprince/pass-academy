import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = { feature: string; phase?: number };

export function ComingSoon({ feature, phase = 2 }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 gap-6">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Clock className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <Badge variant="secondary">Phase {phase}</Badge>
        <h2 className="text-3xl font-bold">{feature}</h2>
        <p className="text-muted-foreground max-w-md">
          This feature is coming soon. We&apos;re working hard to bring you{" "}
          {feature.toLowerCase()} — stay tuned!
        </p>
      </div>
    </div>
  );
}
