import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleProfile, handleProfile } from "./actions";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  try {
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next");
    const error = requestUrl.searchParams.get("error");
    const error_description = requestUrl.searchParams.get("error_description");

    // Handle OAuth errors
    if (error) {
      console.error("OAuth error:", { error, description: error_description });
      return NextResponse.redirect(
        new URL(
          `/oauth?error=${encodeURIComponent(error_description || error)}`,
          requestUrl.origin
        )
      );
    }

    if (!code) {
      console.error("No code provided in callback");
      return NextResponse.redirect(
        new URL("/oauth?error=no_code", requestUrl.origin)
      );
    }

    const supabase = await createClient();

    console.log("Starting auth callback...");

    // Exchange code for session
    const {
      data: { user, session },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    console.log("Session check:", {
      hasUser: !!user,
      hasSession: !!session,
      userId: user?.id,
    });

    // Try to get the session directly
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    console.log("Current session check:", {
      hasSession: !!currentSession,
    });

    if (sessionError || !session || !user) {
      console.error("Session error:", sessionError);
      return NextResponse.redirect(
        new URL("/oauth?error=auth_failed", requestUrl.origin)
      );
    }

    // Extract Google profile data
    const googleData: GoogleProfile = {
      email: user.email!,
      full_name: user.user_metadata.full_name || null,
      avatar_url: user.user_metadata.avatar_url || null,
    };

    // Handle profile creation/update
    const profileResult = await handleProfile(supabase, user.id, googleData);

    // Determine redirect based on profile status
    let redirectUrl = "/dashboard";
    if (profileResult.isNew) {
      redirectUrl = "/onboarding/role-selection";
    } else {
      // Check if user has team association
      const { data: teamMember } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!teamMember) {
        redirectUrl = "/onboarding/role-selection";
      }
    }

    // Create response with security headers
    const response = NextResponse.redirect(
      new URL(next || redirectUrl, requestUrl.origin)
    );

    // Set security headers
    const securityHeaders = {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy":
        "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      new URL("/oauth?error=auth_failed_catch", requestUrl.origin)
    );
  }
}
