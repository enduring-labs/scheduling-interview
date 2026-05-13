import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  tenants,
  technicians,
  workOrders,
  availabilityWindows,
  appointments,
} from "./schema";

function dateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

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
  const [wo1, wo2, wo2b, wo3, wo4, wo5, wo6, wo7, wo8] = await db
    .insert(workOrders)
    .values([
      // Alice: 3 work orders — one open with availability, one single-appt scheduled, one multi-appt scheduled
      {
        title: "Kitchen faucet leaking",
        description:
          "Faucet in the kitchen has been dripping constantly for two days. Water is pooling under the sink.",
        status: "open",
        priority: "normal",
        tenantId: alice.id,
        propertyAddress: "742 Evergreen Terrace",
        unitNumber: "2B",
      },
      {
        title: "Bathroom tile cracked",
        description: "Large crack in the shower floor tile. Water might be seeping underneath.",
        status: "scheduled",
        priority: "normal",
        tenantId: alice.id,
        propertyAddress: "742 Evergreen Terrace",
        unitNumber: "2B",
      },
      // Alice: multi-day job — water heater replacement (2 visits)
      {
        title: "Water heater replacement",
        description: "Old water heater needs full replacement. Requires two visits: disconnect old unit, then install new one.",
        status: "scheduled",
        priority: "high",
        tenantId: alice.id,
        propertyAddress: "742 Evergreen Terrace",
        unitNumber: "2B",
      },
      // Bob: open with availability
      {
        title: "AC not blowing cold air",
        description:
          "Central AC unit turns on but only blows warm air. Thermostat is set to 72.",
        status: "open",
        priority: "high",
        tenantId: bob.id,
        propertyAddress: "1600 Pennsylvania Ave",
        unitNumber: "4A",
      },
      // Carol: open, no availability yet
      {
        title: "Bathroom outlet not working",
        description:
          "The GFCI outlet next to the bathroom sink stopped working. Reset button does nothing.",
        status: "open",
        priority: "normal",
        tenantId: carol.id,
        propertyAddress: "221B Baker Street",
        unitNumber: null,
      },
      // David: scheduled
      {
        title: "Garbage disposal jammed",
        description: "Disposal makes a humming sound but won't spin. Tried the reset button.",
        status: "scheduled",
        priority: "low",
        tenantId: david.id,
        propertyAddress: "742 Evergreen Terrace",
        unitNumber: "1A",
      },
      // Emma: open with availability
      {
        title: "Broken window lock",
        description:
          "Lock mechanism on the bedroom window is broken. Window can't be secured shut.",
        status: "open",
        priority: "high",
        tenantId: emma.id,
        propertyAddress: "350 Fifth Avenue",
        unitNumber: "12C",
      },
      // Frank: open, no availability
      {
        title: "Water heater making noise",
        description:
          "Water heater in the utility closet is making loud popping/knocking sounds.",
        status: "open",
        priority: "normal",
        tenantId: frank.id,
        propertyAddress: "1600 Pennsylvania Ave",
        unitNumber: "2A",
      },
      // Grace: scheduled
      {
        title: "Dishwasher not draining",
        description:
          "After a cycle the dishwasher has standing water at the bottom.",
        status: "scheduled",
        priority: "normal",
        tenantId: grace.id,
        propertyAddress: "221B Baker Street",
        unitNumber: null,
      },
    ])
    .returning();

  console.log("Seeding availability windows...");
  await db.insert(availabilityWindows).values([
    // Alice's open work order (wo1) — a few slots over 2 days
    { workOrderId: wo1.id, date: dateStr(1), startTime: "09:00", endTime: "10:00" },
    { workOrderId: wo1.id, date: dateStr(1), startTime: "10:00", endTime: "11:00" },
    { workOrderId: wo1.id, date: dateStr(1), startTime: "14:00", endTime: "15:00" },
    { workOrderId: wo1.id, date: dateStr(3), startTime: "08:00", endTime: "09:00" },
    { workOrderId: wo1.id, date: dateStr(3), startTime: "09:00", endTime: "10:00" },
    // Bob's open work order (wo3) — morning block
    { workOrderId: wo3.id, date: dateStr(2), startTime: "08:00", endTime: "09:00" },
    { workOrderId: wo3.id, date: dateStr(2), startTime: "09:00", endTime: "10:00" },
    { workOrderId: wo3.id, date: dateStr(2), startTime: "10:00", endTime: "11:00" },
    { workOrderId: wo3.id, date: dateStr(4), startTime: "13:00", endTime: "14:00" },
    { workOrderId: wo3.id, date: dateStr(4), startTime: "14:00", endTime: "15:00" },
    // Emma's open work order (wo6) — afternoon slots
    { workOrderId: wo6.id, date: dateStr(1), startTime: "13:00", endTime: "14:00" },
    { workOrderId: wo6.id, date: dateStr(1), startTime: "14:00", endTime: "15:00" },
    { workOrderId: wo6.id, date: dateStr(5), startTime: "10:00", endTime: "11:00" },
    { workOrderId: wo6.id, date: dateStr(5), startTime: "11:00", endTime: "12:00" },
  ]);

  console.log("Seeding appointments...");
  await db.insert(appointments).values([
    // Alice's single-appointment work order (wo2)
    {
      workOrderId: wo2.id,
      technicianId: mike.id,
      date: dateStr(2),
      startTime: "10:00",
      endTime: "11:00",
      notes: "Bring replacement tiles",
    },
    // Alice's multi-appointment work order (wo2b) — 2 visits, different days & techs
    {
      workOrderId: wo2b.id,
      technicianId: mike.id,
      date: dateStr(3),
      startTime: "09:00",
      endTime: "11:00",
      notes: "Disconnect and remove old water heater",
    },
    {
      workOrderId: wo2b.id,
      technicianId: carlos.id,
      date: dateStr(5),
      startTime: "10:00",
      endTime: "13:00",
      notes: "Install new water heater and test",
    },
    // David's scheduled work order (wo5)
    {
      workOrderId: wo5.id,
      technicianId: carlos.id,
      date: dateStr(3),
      startTime: "09:00",
      endTime: "10:00",
      notes: null,
    },
    // Grace's scheduled work order (wo8)
    {
      workOrderId: wo8.id,
      technicianId: sarah.id,
      date: dateStr(4),
      startTime: "14:00",
      endTime: "15:00",
      notes: "Check drain hose first",
    },
  ]);

  console.log("Seed complete.");
  await client.end();
}

seed().catch(console.error);
