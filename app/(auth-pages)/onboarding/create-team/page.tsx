"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash";
import { AlertCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkTeamName, createTeam, requestTeamAccess } from "./actions";

interface SimilarTeam {
  name: string;
  similarity: number;
}

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [teamLevel, setTeamLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similarTeams, setSimilarTeams] = useState<SimilarTeam[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Debounced function to check team name
  const debouncedCheckName = debounce(async (name: string) => {
    if (name.length < 3) return;

    setIsChecking(true);
    try {
      const similar = await checkTeamName(name);
      setSimilarTeams(similar);
    } catch (err) {
      console.error("Error checking team name:", err);
    } finally {
      setIsChecking(false);
    }
  }, 500);

  useEffect(() => {
    if (teamName.length >= 3) {
      debouncedCheckName(teamName);
    } else {
      setSimilarTeams([]);
    }
    return () => debouncedCheckName.cancel();
  }, [teamName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (similarTeams.length > 0) {
      setError("Please choose a different team name to avoid duplicates.");
      setLoading(false);
      return;
    }

    try {
      const teamCode = await createTeam(teamName, teamLevel, ageGroup);
      router.push(`/onboarding/success?code=${teamCode}`);
    } catch (err) {
      setError("Failed to create team. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-header">
        <CardTitle className="text-2xl font-semibold text-black">
          Create Your Team
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your team's information to get started
        </p>
      </CardHeader>
      <CardContent className="auth-card-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Alert className="auth-alert">
              <Info className="h-4 w-4" />
              <AlertTitle>Important Information</AlertTitle>
              <AlertDescription>
                Please ensure this team hasn't been registered before. You can
                only create up to 3 teams within 24 hours.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                required
                minLength={3}
                maxLength={50}
                className={`auth-input ${
                  similarTeams.length > 0 ? "border-orange-500" : ""
                }`}
              />
              {isChecking && (
                <p className="text-sm text-muted-foreground">
                  Checking team name...
                </p>
              )}
              {similarTeams.length > 0 && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Team Already Exists</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>This team is already registered:</p>
                    <ul className="list-disc pl-4">
                      {similarTeams.map((team, index) => (
                        <li key={index}>{team.name}</li>
                      ))}
                    </ul>
                    <Button
                      onClick={async () => {
                        try {
                          await requestTeamAccess(teamName, similarTeams[0]);
                          toast({
                            title: "Request Sent",
                            description: "The head coach has been notified.",
                          });
                        } catch (err) {
                          toast({
                            title: "Error",
                            description:
                              "Failed to send request. Please try again.",
                            variant: "destructive",
                          });
                        }
                      }}
                      variant="secondary"
                      className="auth-button auth-button-secondary mt-2"
                    >
                      Request Access
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamLevel">Team Level</Label>
              <Select onValueChange={setTeamLevel} required>
                <SelectTrigger id="teamLevel" className="auth-select-trigger">
                  <SelectValue placeholder="Select team level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rec">Rec</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageGroup">Age Group</Label>
              <Select onValueChange={setAgeGroup} required>
                <SelectTrigger id="ageGroup" className="auth-select-trigger">
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8u">8U</SelectItem>
                  <SelectItem value="10u">10U</SelectItem>
                  <SelectItem value="12u">12U</SelectItem>
                  <SelectItem value="14u">14U</SelectItem>
                  <SelectItem value="16u">16U</SelectItem>
                  <SelectItem value="18u">18U</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading || similarTeams.length > 0}
              className="auth-button"
            >
              {loading ? "Creating Team..." : "Create Team"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
