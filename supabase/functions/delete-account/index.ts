import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(token);

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log audit event before deletion
    await supabaseClient.from("audit_logs").insert({
      actor_id: user.id,
      action: "account_deletion",
      metadata: {
        timestamp: new Date().toISOString(),
        email: user.email,
      },
    });

    // Anonymize user data (soft delete approach)
    // Hard delete PII, retain minimal audit metadata
    await supabaseClient
      .from("users_public")
      .update({
        display_name: "Deleted User",
        avatar_url: null,
        bio: null,
        city: null,
        discoverable: false,
        profile_visibility: "private",
      })
      .eq("id", user.id);

    // Delete user sessions
    await supabaseClient.from("user_sessions").delete().eq("user_id", user.id);

    // Delete consent records (retain in audit_logs)
    await supabaseClient.from("consent_records").delete().eq("user_id", user.id);

    // Delete blocked users relationships
    await supabaseClient.from("blocked_users").delete().eq("blocker_id", user.id);
    await supabaseClient.from("blocked_users").delete().eq("blocked_id", user.id);

    // Delete auth user (cascades to users_public via FK)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
