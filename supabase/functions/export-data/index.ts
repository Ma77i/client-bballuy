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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all user data (GDPR-compliant export)
    const [
      profile,
      teams,
      teamMemberships,
      courts,
      matches,
      matchParticipations,
      messages,
      reports,
      consentRecords,
    ] = await Promise.all([
      supabaseClient.from("users_public").select("*").eq("id", user.id).single(),
      supabaseClient.from("teams").select("*").eq("captain_id", user.id),
      supabaseClient.from("team_members").select("*").eq("user_id", user.id),
      supabaseClient.from("courts").select("*").eq("created_by", user.id),
      supabaseClient.from("matches").select("*").eq("created_by", user.id),
      supabaseClient.from("match_participants").select("*").eq("user_id", user.id),
      supabaseClient.from("messages").select("*").eq("sender_id", user.id),
      supabaseClient.from("reports").select("*").eq("reporter_id", user.id),
      supabaseClient.from("consent_records").select("*").eq("user_id", user.id),
    ]);

    const exportData = {
      profile: profile.data,
      teams: teams.data,
      teamMemberships: teamMemberships.data,
      courts: courts.data,
      matches: matches.data,
      matchParticipations: matchParticipations.data,
      messages: messages.data,
      reports: reports.data,
      consentRecords: consentRecords.data,
      exportedAt: new Date().toISOString(),
    };

    // Log audit event
    await supabaseClient.from("audit_logs").insert({
      actor_id: user.id,
      action: "data_export",
      metadata: { timestamp: new Date().toISOString() },
    });

    return new Response(JSON.stringify(exportData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="user-data-${user.id}.json"`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});