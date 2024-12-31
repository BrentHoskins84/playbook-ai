"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
const teamSettingsSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  division: z.string().min(1, "Please select a division"),
  season: z.string().min(1, "Please select a season"),
  venue: z.string().min(2, "Venue must be at least 2 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters"),
  primaryColor: z.string().min(4, "Please select a primary color"),
  secondaryColor: z.string().min(4, "Please select a secondary color"),
});

// Dummy team data
const teamData = {
  teamName: "Thunderbolts",
  division: "U12",
  season: "Spring 2024",
  venue: "Central Sports Complex",
  description:
    "A competitive youth basketball team focused on player development and teamwork.",
  primaryColor: "#2563eb",
  secondaryColor: "#fbbf24",
};

export default function TeamSettingsPage() {
  const form = useForm<z.infer<typeof teamSettingsSchema>>({
    resolver: zodResolver(teamSettingsSchema),
    defaultValues: teamData,
  });

  function handleSubmit(values: z.infer<typeof teamSettingsSchema>) {
    console.log(values);
    // Handle form submission here
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Team Settings</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="U8">Under 8</SelectItem>
                          <SelectItem value="U10">Under 10</SelectItem>
                          <SelectItem value="U12">Under 12</SelectItem>
                          <SelectItem value="U14">Under 14</SelectItem>
                          <SelectItem value="U16">Under 16</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Spring 2024">
                            Spring 2024
                          </SelectItem>
                          <SelectItem value="Summer 2024">
                            Summer 2024
                          </SelectItem>
                          <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                          <SelectItem value="Winter 2024">
                            Winter 2024
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter home venue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter team description"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Team Settings</Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
