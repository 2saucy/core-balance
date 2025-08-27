import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalculatorPageLayoutProps {
  title: string;
  description: string;
  form: React.ReactNode;
  infoTitle: string;
  infoDescription: string;
  infoContent: React.ReactNode;
  results: React.ReactNode;
}

export function CalculatorPageLayout({
  title,
  description,
  form,
  infoTitle,
  infoDescription,
  infoContent,
  results,
}: CalculatorPageLayoutProps) {
  return (
    <div className="flex justify-center py-12 px-4 md:px-12 lg:px-[15%]">
      <div className="flex-1 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">{title} Calculator</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Top Section: Form and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Calculator Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your {title}</CardTitle>
              <CardDescription>Enter your information below.</CardDescription>
            </CardHeader>
            <CardContent>{form}</CardContent>
          </Card>

          {/* Right Column: Information Card */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>{infoTitle}</CardTitle>
              <CardDescription>{infoDescription}</CardDescription>
            </CardHeader>
            <ScrollArea className="text-sm text-muted-foreground p-0 max-h-[420px]">
              <div className="p-6 space-y-4">
                {infoContent}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Bottom Section: Results Card */}
        <div className="space-y-8">{results}</div>
      </div>
    </div>
  );
}