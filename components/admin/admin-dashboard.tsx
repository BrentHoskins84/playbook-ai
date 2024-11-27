"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CoachApprovalList } from "@/components/admin/coach-approval-list"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("coach-approvals")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coach-approvals">Coach Approvals</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="system-settings">System Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="coach-approvals">
          <Card>
            <CardHeader>
              <CardTitle>Coach Approvals</CardTitle>
              <CardDescription>Approve or reject coach registration requests</CardDescription>
            </CardHeader>
            <CardContent>
              <CoachApprovalList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management functionality to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system-settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System settings functionality to be implemented.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
