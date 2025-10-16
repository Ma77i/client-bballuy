import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  "auth/signup": { requests: 5, windowMs: 3600000 },
  "auth/signin": { requests: 10, windowMs: 900000 },
  "messages/send": { requests: 60, windowMs: 60000 },
  "reports/create": { requests: 10, windowMs: 3600000 },
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

    const { endpoint, userId, ipAddress } = await req.json();

    if (!endpoint) {
      return new Response(JSON.stringify({ error: "Missing endpoint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const limit = RATE_LIMITS[endpoint];
    if (!limit) {
      return new Response(
        JSON.stringify({ allowed: true, message: "No rate limit configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const windowStart = new Date(
      Date.now() - (Date.now() % limit.windowMs)
    ).toISOString();

    // Check rate limit
    const { data: existing } = await supabaseClient
      .from("rate_limits")
      .select("request_count")
      .eq("endpoint", endpoint)
      .eq("window_start", windowStart)
      .or(
        userId ? `user_id.eq.${userId}` : `ip_address.eq.${ipAddress}`
      )
      .single();

    if (existing && existing.request_count >= limit.requests) {
      return new Response(
        JSON.stringify({
          allowed: false,
          message: "Rate limit exceeded",
          retryAfter: limit.windowMs / 1000,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Increment or create rate limit record
    if (existing) {
      await supabaseClient
        .from("rate_limits")
        .update({ request_count: existing.request_count + 1 })
        .eq("endpoint", endpoint)
        .eq("window_start", windowStart)
        .or(
          userId ? `user_id.eq.${userId}` : `ip_address.eq.${ipAddress}`
        );
    } else {
      await supabaseClient.from("rate_limits").insert({
        user_id: userId || null,
        ip_address: ipAddress || null,
        endpoint,
        window_start: windowStart,
        request_count: 1,
      });
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        remaining: limit.requests - (existing?.request_count || 0) - 1,
      }),
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
