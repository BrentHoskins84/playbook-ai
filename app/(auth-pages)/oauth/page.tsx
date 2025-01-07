"use client";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function OAuthPage() {
  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-header">
        <CardTitle className="text-2xl font-semibold text-black text-center">
          Sign in to your account
        </CardTitle>
        <p className="text-sm text-gray-500 text-center">
          Start creating your practice plans
        </p>
      </CardHeader>
      <CardContent className="auth-card-content text-center">
        <GoogleSignInButton />
        <p className="text-xs text-center text-gray-500 mt-4">
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary hover:text-primary/90">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:text-primary/90">
            Privacy Policy
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

export default OAuthPage;
