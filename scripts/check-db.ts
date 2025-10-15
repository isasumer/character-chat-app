/**
 * Database Check Script
 * Quick script to check your database connection and view existing data
 * 
 * Usage: npx tsx scripts/check-db.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing environment variables!");
  console.error("Please ensure your .env.local file has:");
  console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  console.error("  - NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("🔍 Checking database connection...\n");
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

  try {
    // Test connection by fetching characters
    console.log("📋 Fetching characters from database...");
    const { data: characters, error } = await supabase
      .from("characters")
      .select("*")
      .order("name");

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!characters || characters.length === 0) {
      console.log("\n⚠️  No characters found in database!");
      console.log("\n💡 To seed the database, run:");
      console.log("   npx tsx scripts/seed.ts");
      return;
    }

    console.log(`\n✅ Connection successful! Found ${characters.length} character(s):\n`);
    
    characters.forEach((char: any, index: number) => {
      console.log(`${index + 1}. 🎭 ${char.name}`);
      console.log(`   ID: ${char.id}`);
      console.log(`   📝 Description: ${char.description}`);
      console.log(`   💭 Personality: ${char.personality || "N/A"}`);
      console.log(`   💬 Style: ${char.conversation_style || "N/A"}`);
      console.log(`   🖼️  Avatar: ${char.avatar_url || "N/A"}`);
      console.log(`   📅 Created: ${new Date(char.created_at).toLocaleDateString()}\n`);
    });

    // Check other tables
    console.log("📊 Database Statistics:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const { count: profileCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    console.log(`   👤 Profiles: ${profileCount || 0}`);

    const { count: sessionCount } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact", head: true });
    console.log(`   💬 Chat Sessions: ${sessionCount || 0}`);

    const { count: messageCount } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true });
    console.log(`   📨 Messages: ${messageCount || 0}`);
    
    console.log(`   🎭 Characters: ${characters.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("🎉 Database is working perfectly!");
    console.log("\n🚀 Next steps:");
    console.log("   - Start dev server: npm run dev");
    console.log("   - View characters: http://localhost:3000/test-data");
    console.log("   - Start building Phase 2!");

  } catch (error) {
    console.error("\n❌ Database check failed!");
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      
      console.log("\n💡 Possible issues:");
      console.log("   1. Database schema not created (run schema-clean.sql in Supabase)");
      console.log("   2. Wrong credentials in .env.local");
      console.log("   3. Supabase project is paused or deleted");
      console.log("   4. Network connection issues");
    }
    process.exit(1);
  }
}

// Run the check
checkDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error:", error);
    process.exit(1);
  });

