"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Create a separate component for the content that depends on searchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const teamCode = searchParams.get("code");
  const router = useRouter();
  const { toast } = useToast();

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(teamCode || "");
      toast({
        title: "Copied!",
        description: "Team code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-header">
        <CardTitle className="text-2xl font-semibold text-black">
          Team Created Successfully! 🎉
        </CardTitle>
        <p className="text-sm text-gray-500">
          Your team has been created. Share this code with your assistant
          coaches so they can join your team.
        </p>
      </CardHeader>
      <CardContent className="auth-card-content">
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Team Code</p>
          <div className="flex items-center justify-center gap-2">
            <code className="relative rounded bg-white px-3 py-1 font-mono text-xl font-semibold text-gray-900 border border-gray-200">
              {teamCode}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p>👉 Share this code with your assistant coaches</p>
          <p>👉 They will need this code to join your team</p>
          <p>
            👉 Keep this code safe - you can always find it in your team
            settings
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => router.push("/dashboard")}
            className="auth-button"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/team/settings")}
            className="auth-button auth-button-secondary mt-2"
          >
            Team Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading fallback component
function LoadingSkeleton() {
  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-header">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="auth-card-content space-y-6">
        <div className="rounded-lg bg-gray-50 p-6">
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}
