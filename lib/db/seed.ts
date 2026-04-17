import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { tenants, technicians, workOrders } from "./schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log("Seeding tenants...");
  const [alice, bob, carol, david, emma, frank, grace, henry] = await db
    .insert(tenants)
    .values([
      { name: "Alice Johnson", phone: "+15552001001" },
      { name: "Bob Martinez", phone: "+15552001002" },
      { name: "Carol White", phone: "+15552001003" },
      { name: "David Kim", phone: "+15552001004" },
      { name: "Emma Davis", phone: "+15552001005" },
      { name: "Frank Lopez", phone: "+15552001006" },
      { name: "Grace Patel", phone: "+15552001007" },
      { name: "Henry Nguyen", phone: "+15552001008" },
    ])
    .returning();

  console.log("Seeding technicians...");
  const [mike, sarah, carlos] = await db
    .insert(technicians)
    .values([
      { name: "Mike Torres", phone: "+15551001001", specialty: "plumbing" },
      { name: "Sarah Chen", phone: "+15551001002", specialty: "electrical" },
      { name: "Carlos Rivera", phone: "+15551001003", specialty: "general" },
    ])
    .returning();

  console.log("Seeding work orders...");
  await db.insert(workOrders).values([
    {
      title: "Kitchen faucet leaking",
      description:
        "Faucet in the kitchen has been dripping constantly for two days. Water is pooling under the sink.",
      status: "open",
      priority: "normal",
      tenantId: alice.id,
      propertyAddress: "742 Evergreen Terrace",
      unitNumber: "2B",
      assignedTechnicianId: mike.id,
    },
    {
      title: "AC not blowing cold air",
      description:
        "Central AC unit turns on but only blows warm air. Thermostat is set to 72.",
      status: "open",
      priority: "high",
      tenantId: bob.id,
      propertyAddress: "1600 Pennsylvania Ave",
      unitNumber: "4A",
      assignedTechnicianId: null,
    },
    {
      title: "Bathroom outlet not working",
      description:
        "The GFCI outlet next to the bathroom sink stopped working. Reset button does nothing.",
      status: "open",
      priority: "normal",
      tenantId: carol.id,
      propertyAddress: "221B Baker Street",
      unitNumber: null,
      assignedTechnicianId: sarah.id,
    },
    {
      title: "Garbage disposal jammed",
      description: "Disposal makes a humming sound but won't spin. Tried the reset button.",
      status: "open",
      priority: "low",
      tenantId: david.id,
      propertyAddress: "742 Evergreen Terrace",
      unitNumber: "1A",
      assignedTechnicianId: mike.id,
    },
    {
      title: "Broken window lock",
      description:
        "Lock mechanism on the bedroom window is broken. Window can't be secured shut.",
      status: "open",
      priority: "high",
      tenantId: emma.id,
      propertyAddress: "350 Fifth Avenue",
      unitNumber: "12C",
      assignedTechnicianId: carlos.id,
    },
    {
      title: "Water heater making noise",
      description:
        "Water heater in the utility closet is making loud popping/knocking sounds. Hot water still works.",
      status: "open",
      priority: "normal",
      tenantId: frank.id,
      propertyAddress: "1600 Pennsylvania Ave",
      unitNumber: "2A",
      assignedTechnicianId: null,
    },
    {
      title: "Dishwasher not draining",
      description:
        "After a cycle the dishwasher has standing water at the bottom. Tried running it twice.",
      status: "open",
      priority: "normal",
      tenantId: grace.id,
      propertyAddress: "221B Baker Street",
      unitNumber: null,
      assignedTechnicianId: mike.id,
    },
    {
      title: "Ceiling fan wobbling badly",
      description:
        "The living room ceiling fan wobbles so much at high speed it feels like it might fall.",
      status: "open",
      priority: "high",
      tenantId: henry.id,
      propertyAddress: "350 Fifth Avenue",
      unitNumber: "8B",
      assignedTechnicianId: carlos.id,
    },
  ]);

  console.log("Seed complete.");
  await client.end();
}

seed().catch(console.error);
