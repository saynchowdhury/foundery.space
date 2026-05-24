import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, serviceKey);

interface RawProgram {
  name: string;
  url: string;
  description: string;
  images: string[];
  source: string;
  relevance: string;
  category: string;
  query_match: string;
  organizer: string;
  notes: string;
}

function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

async function seed() {
  const raw: RawProgram[] = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "..", "scraped-data", "discovery", "new_programs_found.json"),
      "utf-8"
    )
  );

  console.log(`Found ${raw.length} programs to seed`);

  let inserted = 0;
  let skipped = 0;

  for (const p of raw) {
    const id = generateId(p.name);

    const { data: existing } = await supabase
      .from("opportunities")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      console.log(`  Skipping "${p.name}" — already exists`);
      skipped++;
      continue;
    }

    const logoUrl = p.images?.[0] || `/logos/${id}.avif`;
    const shareImageUrl = p.images?.[1] || `/images/${id}.avif`;
    const tags = [p.category, p.source, p.relevance];

    const { error } = await supabase.from("opportunities").insert({
      id,
      name: p.name,
      logo_url: logoUrl,
      share_image_url: shareImageUrl,
      description: p.description,
      full_description: p.description,
      open_date: null,
      close_date: null,
      tags,
      category: p.category,
      region: "Global",
      country: null,
      eligibility: "",
      apply_link: p.url,
      benefits: [],
      organizer: p.organizer || p.name,
      duration: null,
      funding: null,
      application_video: null,
    });

    if (error) {
      console.error(`  Error inserting "${p.name}":`, error.message);
      continue;
    }

    console.log(`  Inserted "${p.name}" (${id})`);
    inserted++;
  }

  console.log(`\nDone! ${inserted} inserted, ${skipped} skipped`);
}

seed().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
