"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { joinTeam } from "./actions";

export default function JoinTeamPage() {
  const [teamCode, setTeamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await joinTeam(teamCode.toUpperCase());
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to join team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-header">
        <CardTitle className="text-2xl font-semibold text-black">
          Join Your Team
        </CardTitle>
        <p className="text-sm text-gray-500">
          Enter the team code provided by your head coach
        </p>
      </CardHeader>
      <CardContent className="auth-card-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teamCode">Team Code</Label>
            <Input
              id="teamCode"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter 6-character code"
              required
              minLength={6}
              maxLength={6}
              className="auth-input uppercase"
            />
            <p className="text-sm text-muted-foreground">
              The code should be 6 characters long
            </p>
          </div>

          <Button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Joining Team..." : "Join Team"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
