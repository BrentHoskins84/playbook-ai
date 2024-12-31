import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bot, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { DrillForm } from "./forms/manual";
import { DrillFormData } from "./forms/manual/types";
import { VideoSubmission } from "./forms/video-submission";

export function AddDrillModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiData, setAiData] = useState<Partial<DrillFormData> | null>(null);
  const { toast } = useToast();

  const handleFormSuccess = () => {
    toast({
      title: "Success",
      description: "Drill saved successfully",
    });
    setAiData(null);
    setTimeout(() => setIsOpen(false), 1500);
  };

  const handleFormError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error,
    });
  };

  const handleVideoProcessingComplete = (data: Partial<DrillFormData>) => {
    setAiData(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="mr-2 h-4 w-4" /> Add Drill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto pb-0">
        <DialogHeader>
          <DialogTitle>Add New Drill</DialogTitle>
          <DialogDescription>
            Create a new drill by entering details manually or by analyzing a
            video.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">
              <FileText className="mr-2 h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="mr-2 h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <DrillForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          </TabsContent>
          <TabsContent value="ai">
            {aiData ? (
              <DrillForm
                initialData={aiData}
                onSuccess={handleFormSuccess}
                onError={handleFormError}
              />
            ) : (
              <VideoSubmission
                onProcessingComplete={handleVideoProcessingComplete}
                onError={handleFormError}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
