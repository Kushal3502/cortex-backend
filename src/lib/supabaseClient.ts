import { createClient } from "@supabase/supabase-js";
import { config } from "../config/config";

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey
);
