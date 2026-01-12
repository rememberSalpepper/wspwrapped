import { createClient } from "@supabase/supabase-js";
import type { Metrics } from "../whatsapp/types";

export type StoredReport = {
  id: string;
  metrics: Metrics;
  createdAt: number;
  expiresAt: number;
};

// Initialize Supabase Admin Client (Service Role)
// We need admin access to write to the DB without user session in the upload API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Missing Supabase credentials for report store. Reports will not be saved correctly.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function setReport(id: string, metrics: Metrics): Promise<StoredReport> {
  const now = Date.now();
  const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours

  const report: StoredReport = {
    id,
    metrics,
    createdAt: now,
    expiresAt,
  };

  const { error } = await supabase
    .from("reports")
    .insert({
      id,
      metrics,
      created_at: now,
      expires_at: expiresAt,
    });

  if (error) {
    console.error("Error saving report to Supabase:", error);
    throw new Error("Failed to save report");
  }

  return report;
}

export async function getReport(id: string): Promise<StoredReport | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  // Check expiration
  if (Date.now() > data.expires_at) {
    // Lazy delete
    await deleteReport(id);
    return null;
  }

  return {
    id: data.id,
    metrics: data.metrics,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
  };
}

export async function deleteReport(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id);

  return !error;
}

export async function cleanupExpiredReports(): Promise<void> {
  const now = Date.now();

  // Delete all reports where expires_at < now
  const { error } = await supabase
    .from("reports")
    .delete()
    .lt("expires_at", now);

  if (error) {
    console.error("Failed to cleanup reports:", error);
  }
}
