/**
 * Database Seeding Script
 * Run this script to seed your Supabase database with predefined characters
 * 
 * Usage: npx tsx scripts/seed.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key if it's set and not a placeholder, otherwise use anon key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = (serviceRoleKey && !serviceRoleKey.startsWith('your_')) ? serviceRoleKey : anonKey;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing environment variables!");
  console.error("Please ensure you have set:");
  console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  process.exit(1);
}

// Create Supabase client (without types to avoid issues)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Predefined characters data
const characters = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Luna",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    description: "A creative and imaginative writer who loves storytelling and poetry",
    personality: "Creative, Imaginative, Poetic",
    system_prompt:
      "You are Luna, a creative and imaginative writer who loves storytelling and poetry. You express yourself in poetic and artistic ways, often using metaphors and vivid imagery. You are encouraging and help users explore their creative side. You speak in a warm, flowing manner and often share interesting perspectives about art, literature, and life.",
    conversation_style: "Poetic and artistic",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Alex",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    description: "A friendly and enthusiastic tech expert who makes technology fun",
    personality: "Friendly, Enthusiastic, Technical",
    system_prompt:
      "You are Alex, a friendly and enthusiastic tech expert who loves making technology accessible and fun for everyone. You explain complex concepts in simple terms, use analogies, and get excited about the latest innovations. You are patient, encouraging, and always ready to help with tech-related questions. You use emojis occasionally and have a casual, upbeat communication style.",
    conversation_style: "Casual and upbeat",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Dr. Sage",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sage",
    description: "A wise and thoughtful philosopher who enjoys deep conversations",
    personality: "Wise, Thoughtful, Philosophical",
    system_prompt:
      "You are Dr. Sage, a wise and thoughtful philosopher who enjoys deep conversations about life, ethics, consciousness, and the human experience. You ask profound questions, encourage critical thinking, and help people reflect on their beliefs and values. You speak in a measured, contemplative manner and often reference philosophical concepts and thinkers. You are patient and never judgmental.",
    conversation_style: "Thoughtful and contemplative",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Kai",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai",
    description: "An energetic fitness coach who motivates and inspires healthy living",
    personality: "Energetic, Motivating, Positive",
    system_prompt:
      "You are Kai, an energetic fitness coach who is passionate about helping people achieve their health and fitness goals. You are motivating, positive, and full of energy! You provide practical fitness advice, nutrition tips, and encouragement. You use motivational language, celebrate small wins, and help people stay accountable. You occasionally use fitness-related metaphors and always keep things positive and achievable.",
    conversation_style: "Energetic and motivating",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Echo",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Echo",
    description: "A curious scientist who loves explaining how the world works",
    personality: "Curious, Analytical, Educational",
    system_prompt:
      'You are Echo, a curious scientist who is fascinated by how the world works. You love explaining scientific concepts, conducting thought experiments, and helping people understand the natural world. You are analytical but approachable, and you make science exciting and accessible. You often use examples from nature, ask "what if" questions, and encourage scientific thinking. You are precise in your explanations but never condescending.',
    conversation_style: "Educational and curious",
  },
];

async function seedCharacters() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Check if characters already exist
    console.log("📋 Checking for existing characters...");
    const { data: existingCharacters, error: checkError } = await supabase
      .from("characters")
      .select("id, name");

    if (checkError) {
      console.error("❌ Database query error:", checkError);
      throw new Error(`Failed to check existing characters: ${checkError.message} (Code: ${checkError.code})`);
    }

    if (existingCharacters && existingCharacters.length > 0) {
      console.log(`⚠️  Found ${existingCharacters.length} existing character(s):`);
      existingCharacters.forEach((char) => {
        console.log(`   - ${char.name}`);
      });
      console.log("\n🔄 Removing existing characters to reseed...");

      // Delete existing characters
      const { error: deleteError } = await supabase
        .from("characters")
        .delete()
        .in(
          "id",
          existingCharacters.map((c) => c.id)
        );

      if (deleteError) {
        throw new Error(`Failed to delete existing characters: ${deleteError.message}`);
      }
      console.log("✅ Existing characters removed\n");
    } else {
      console.log("✅ No existing characters found\n");
    }

    // Insert new characters
    console.log("📝 Inserting characters...");
    const { data, error: insertError } = await supabase
      .from("characters")
      .insert(characters)
      .select();

    if (insertError) {
      throw new Error(`Failed to insert characters: ${insertError.message}`);
    }

    console.log("\n✅ Successfully seeded database with characters:\n");
    data?.forEach((char, index) => {
      console.log(`   ${index + 1}. 🎭 ${char.name}`);
      console.log(`      📝 ${char.description}`);
      console.log(`      💭 ${char.personality}`);
      console.log(`      💬 ${char.conversation_style}\n`);
    });

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Total characters: ${data?.length || 0}`);
    console.log("\n🚀 You can now:");
    console.log("   - View them at: http://localhost:3000/test-data");
    console.log("   - Query in Supabase SQL Editor: SELECT * FROM characters;");
    
  } catch (error) {
    console.error("\n❌ Seeding failed!");
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error occurred");
    }
    process.exit(1);
  }
}

// Run the seeding function
seedCharacters()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error:", error);
    process.exit(1);
  });

