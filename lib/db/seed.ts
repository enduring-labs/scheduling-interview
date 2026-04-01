import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { technicians, workOrders, tenants, tenantAvailability } from "./schema";

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

  console.log("Seeding work orders...");
  const workOrdersData = await db
    .insert(workOrders)
    .values([
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
    ])
    .returning();

  console.log("Seeding tenant availability...");
  const now = new Date();
  await db.insert(tenantAvailability).values([
    {
      tenantId: alice.id,
      workOrderId: workOrdersData[0].id,
      startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now, 9 AM
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 2 days from now, 1 PM
    },
    {
      tenantId: bob.id,
      workOrderId: workOrdersData[1].id,
      startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now, 10 AM
      endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 1 day from now, 1 PM
    },
    {
      tenantId: carol.id,
      workOrderId: workOrdersData[2].id,
      startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now, 2 PM
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3 days from now, 4 PM
    },
    {
      tenantId: david.id,
      workOrderId: workOrdersData[3].id,
      startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now, 9 AM
      endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 1 day from now, 5 PM
    },
    {
      tenantId: emma.id,
      workOrderId: workOrdersData[4].id,
      startTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now, 11 AM
      endTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 4 days from now, 2 PM
    },
    {
      tenantId: frank.id,
      workOrderId: workOrdersData[5].id,
      startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now, 3 PM
      endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 days from now, 5 PM
    },
    {
      tenantId: grace.id,
      workOrderId: workOrdersData[6].id,
      startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now, 9 AM
      endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 5 days from now, 3 PM
    },
    {
      tenantId: henry.id,
      workOrderId: workOrdersData[7].id,
      startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now, 10 AM
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 3 days from now, 3 PM
    },
  ]);

  console.log("Seed complete.");
  await client.end();
}

seed().catch(console.error);
