import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionPageProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

const SectionPage = ({ eyebrow, title, description, actions, children }: SectionPageProps) => (
  <div className="space-y-6">
    <Card className="border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p> : null}
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="max-w-3xl text-sm sm:text-base">{description}</CardDescription>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </CardHeader>
    </Card>
    {children}
  </div>
);

export default SectionPage;