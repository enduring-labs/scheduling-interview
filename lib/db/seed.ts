import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { technicians, workOrders } from "./schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

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
      tenantName: "Alice Johnson",
      tenantPhone: "+15552001001",
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
      tenantName: "Bob Martinez",
      tenantPhone: "+15552001002",
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
      tenantName: "Carol White",
      tenantPhone: "+15552001003",
      propertyAddress: "221B Baker Street",
      unitNumber: null,
      assignedTechnicianId: sarah.id,
    },
    {
      title: "Garbage disposal jammed",
      description: "Disposal makes a humming sound but won't spin. Tried the reset button.",
      status: "open",
      priority: "low",
      tenantName: "David Kim",
      tenantPhone: "+15552001004",
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
      tenantName: "Emma Davis",
      tenantPhone: "+15552001005",
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
      tenantName: "Frank Lopez",
      tenantPhone: "+15552001006",
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
      tenantName: "Grace Patel",
      tenantPhone: "+15552001007",
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
      tenantName: "Henry Nguyen",
      tenantPhone: "+15552001008",
      propertyAddress: "350 Fifth Avenue",
      unitNumber: "8B",
      assignedTechnicianId: carlos.id,
    },
  ]);

  console.log("Seed complete.");
  await client.end();
}

seed().catch(console.error);
