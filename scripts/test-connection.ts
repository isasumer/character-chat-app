/**
 * Simple connection test to diagnose Supabase issues
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 Testing Supabase Connection...\n");
console.log("URL:", supabaseUrl);
console.log("Key length:", supabaseKey?.length, "characters");
console.log("Key format looks valid:", supabaseKey?.startsWith("eyJ") ? "✅" : "❌");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("\n📡 Testing basic connection...");
  
  // Test 1: Try to query auth (should always work)
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("✅ Auth endpoint accessible");
  } catch (e) {
    console.log("❌ Auth endpoint failed:", e);
  }

  // Test 2: Check if characters table exists
  console.log("\n📋 Checking if 'characters' table exists...");
  try {
    const { data, error } = await supabase
      .from("characters")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.log("❌ Characters table error:", error.message);
      console.log("   Code:", error.code);
      console.log("   Details:", error.details);
      console.log("   Hint:", error.hint);
      
      if (error.code === "42P01") {
        console.log("\n💡 The 'characters' table does not exist!");
        console.log("   Action needed: Run schema-clean.sql in Supabase SQL Editor");
      } else if (error.code === "PGRST301") {
        console.log("\n💡 RLS policy might be blocking access");
        console.log("   Action needed: Check RLS policies in Supabase");
      }
    } else {
      console.log("✅ Characters table exists");
      console.log(`   Records: ${data || 0}`);
    }
  } catch (e: any) {
    console.log("❌ Unexpected error:", e.message);
  }

  // Test 3: Try to list all tables (this might not work with anon key)
  console.log("\n📊 Database info:");
  console.log("   Project URL:", supabaseUrl);
  console.log("   Using anon key: Yes");
}

testConnection().then(() => {
  console.log("\n✨ Connection test complete");
  process.exit(0);
}).catch((error) => {
  console.error("\n💥 Test failed:", error);
  process.exit(1);
});

