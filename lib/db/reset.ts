import postgres from "postgres";

async function reset() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("Dropping all tables...");
  await sql`DROP TABLE IF EXISTS work_orders CASCADE`;
  await sql`DROP TABLE IF EXISTS tenants CASCADE`;
  await sql`DROP TABLE IF EXISTS technicians CASCADE`;
  await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;

  console.log("Reset complete. Run: pnpm db:migrate && pnpm db:seed");
  await sql.end();
}

reset().catch(console.error);
