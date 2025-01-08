import { CardWrapper } from "@/components/card-wrapper";
import { ClientDrillActions } from "@/components/drills/client-drill-actions";
import {
  DrillRow,
  DrillWithTags,
  TeachingPoints,
} from "@/components/drills/forms/manual/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import YoutubePlayer from "@/components/youtube-player";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDrill, getInitialUserStatus } from "../drill-actions";

type DrillType = DrillRow & {
  teaching_points: TeachingPoints;
  required_equipment: string[];
  tags: string[];
  created_by: string;
};

export default async function DrillDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const { id } = await params;

  if (!id || !uuidRegex.test(id)) {
    notFound();
  }

  try {
    const [drill, initialUserStatus] = (await Promise.all([
      getDrill(id),
      getInitialUserStatus(),
    ])) as [DrillWithTags, { isAdmin: boolean; isCoach: boolean }];

    if (!drill) {
      notFound();
    }

    // Update the parsing of required_equipment
    const equipmentList = drill.required_equipment || [];

    // Parse teaching_points from JSON string
    const { main_points, setup, execution, coaching_cues } =
      drill.teaching_points;

    // Remove this line
    // const { main_points, setup, execution, coaching_cues } = teachingPoints;

    return (
      <div className="container mx-auto px-4 py-8">
        <CardWrapper title={drill.title} colSpan={4}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{drill.title}</h1>
              <ClientDrillActions
                drill={drill}
                initialUserStatus={initialUserStatus}
              />
            </div>

            {drill.video_url && (
              <div className="aspect-video">
                <YoutubePlayer url={drill.video_url} />
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{drill.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Drill Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="font-semibold">Category</dt>
                      <dd className="capitalize">{drill.primary_category}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Skill Level</dt>
                      <dd className="capitalize">{drill.skill_level}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Duration</dt>
                      <dd>{drill.duration_minutes} minutes</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Players</dt>
                      <dd>
                        {drill.player_count_min} - {drill.player_count_max}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Space Required</dt>
                      <dd className="capitalize">{drill.space_required}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    {Array.isArray(equipmentList) &&
                      equipmentList.map((item: string, index: number) => (
                        <li key={index} className="capitalize">
                          {item}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Teaching Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {main_points?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Main Points</h4>
                      <ul className="list-disc list-inside">
                        {main_points.map((point: string, index: number) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {setup?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Setup</h4>
                      <ol className="list-decimal list-inside">
                        {setup.map((step: string, index: number) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {execution?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Execution</h4>
                      <ol className="list-decimal list-inside">
                        {execution.map((step: string, index: number) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {coaching_cues?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Coaching Cues</h4>
                      <ul className="list-disc list-inside">
                        {coaching_cues.map((cue: string, index: number) => (
                          <li key={index}>{cue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {drill.tags?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {drill.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="text-sm text-muted-foreground">
              Created by: {drill.created_by}
            </div>

            <div className="flex justify-between items-center">
              <Button asChild>
                <Link href="/drills">Back to Drills</Link>
              </Button>
            </div>
          </div>
        </CardWrapper>
      </div>
    );
  } catch (error) {
    console.error("Error rendering drill details:", error);
    notFound();
  }
}
