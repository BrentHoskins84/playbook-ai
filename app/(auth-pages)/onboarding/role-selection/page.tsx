"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RoleSelectionPage() {
  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-header">
        <CardTitle className="text-2xl font-semibold text-black">
          Welcome to Playbook AI
        </CardTitle>
        <p className="text-sm text-gray-500">
          Let's get started by selecting your role
        </p>
      </CardHeader>
      <CardContent className="auth-card-content">
        <Button asChild variant="default" size="lg" className="auth-button">
          <Link href="/onboarding/create-team">I am a Head Coach</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="auth-button bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
        >
          <Link href="/onboarding/join-team">I am an Assistant Coach</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
