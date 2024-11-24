import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">Welcome to Playbook AI</CardTitle>
          <CardDescription className="text-xl text-center mt-4">
            Your AI-powered softball practice planning assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}