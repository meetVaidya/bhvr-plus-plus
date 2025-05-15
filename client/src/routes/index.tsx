import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "shared";
import beaver from "../assets/beaver.svg";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const fetchHelloData = async (): Promise<ApiResponse> => {
  const response = await fetch(`${SERVER_URL}/hello`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["helloData"],
    queryFn: fetchHelloData,
    enabled: false,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background/60 to-muted/30">
      <div className="flex flex-col flex-1 items-center justify-center py-12 md:py-16">
        <div className="flex flex-col items-center space-y-4 text-center mb-10">
          <a
            href="https://github.com/stevedylandev/bhvr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform rounded-full overflow-hidden p-1.5 bg-background/80 backdrop-blur-sm ring-1 ring-border shadow-md mb-2"
          >
            <img src={beaver} className="w-20 h-20" alt="beaver logo" />
          </a>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              bhvr
            </h1>
            <h2 className="text-xl text-muted-foreground font-medium">
              Bun + Hono + Vite + React
            </h2>
            <p className="text-xl">A typesafe fullstack monorepo</p>
          </div>
        </div>

        <Card className="w-full max-w-lg border shadow-lg backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              API Interaction
              <Badge
                variant={
                  data
                    ? data.success
                      ? "secondary"
                      : "destructive"
                    : "default"
                }
              >
                {data ? (data.success ? "Success" : "Failed") : "Ready"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-center mb-6">
              <Button onClick={() => refetch()}>Call API</Button>
              <Button variant="outline" asChild>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://bhvr.dev"
                >
                  Docs
                </a>
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertDescription>Error: {error.message}</AlertDescription>
              </Alert>
            )}

            {data && (
              <div className="bg-muted rounded-md p-4 font-mono text-sm">
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <span className="font-semibold text-primary">Message:</span>
                  <span>{data.message}</span>
                  <span className="font-semibold text-primary">Success:</span>
                  <span>{data.success.toString()}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-6">
            API endpoint: {SERVER_URL}/hello
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
