# PRD: Maintenance Scheduling

## 1. Overview

A scheduling layer for a property maintenance platform that lets tenants submit their availability, dispatchers book appointments by matching tenant windows with technician schedules, and technicians view their daily job lineup. Today, all scheduling happens over the phone and lives in the dispatcher's head. This feature replaces that with a shared, visible schedule that all three parties can act on independently.

## 2. Problem

- **Tenants have no way to communicate availability.** They receive phone calls to coordinate times, leading to missed calls, phone tag, and delays in getting repairs done.
- **Dispatchers track schedules mentally.** There is no centralized view of which technicians are free, which tenants are available, or which work orders still need scheduling. This causes double-bookings and forgotten work orders.
- **Technicians don't know their daily plan until they're told.** They have no persistent view of what jobs they have, when they start, or where they need to be — they rely on calls or texts from dispatch.
- **Multi-day jobs are invisible.** Some repairs (e.g., water heater replacement) span multiple visits. There is no way to block out time across days or track partial completion.
- **Scheduling is the bottleneck, not the work itself.** Work orders sit in "open" status not because no one can do them, but because no one has coordinated the appointment yet.

## 3. Solution

The system introduces three connected views built around a shared appointment model:

**Tenant availability submission** — When a tenant has an open work order, they see a weekly calendar grid and can tap time blocks to mark when they're home and available. They can submit many windows at once across different days. Once the dispatcher books an appointment, the tenant's view updates to show the confirmed date, time, and assigned technician.

**Dispatcher scheduling board** — The dispatch page has two tabs: Work Orders and Technicians. The Work Orders tab lists all work orders (filterable to unscheduled). Clicking a work order opens a 7-day calendar grid showing the tenant's availability as active 30-minute slots. The dispatcher selects a technician from a list to overlay that tech's availability in green, then selects time slots where both overlap (adjacent slots merge into one appointment). For multi-day jobs, the dispatcher books one day at a time, potentially with different technicians. The Technicians tab lists all technicians as cards; clicking one shows their schedule, where the dispatcher can click booked times to see the associated work order details.

**Technician daily schedule** — Each technician sees a chronological list of their appointments for the selected day: the time, the job title, the property address, and tenant name. They can tap into any appointment to see full work order details.

The three views are connected by a single appointments table. When the dispatcher books, it appears on both the technician's schedule and the tenant's portal immediately.

## 4. User Stories

### Tenant

- **As a tenant, I want to mark multiple time windows when I'm available this week, so that the dispatcher has flexibility to schedule my repair.**
- **As a tenant, I want to submit availability for a specific work order, so that the dispatcher knows which job the time windows are for.**
- **As a tenant, I want to see my confirmed appointment date, time, and technician name, so that I know when to expect someone.**
- **As a tenant, I want to update my availability if my schedule changes, so that the dispatcher doesn't book a time I can no longer make.**

### Dispatcher

- **As a dispatcher, I want to see all unscheduled work orders in one list, so that I know what still needs booking.**
- **As a dispatcher, I want to see a tenant's submitted availability on a 7-day calendar when scheduling their work order, so that I only book times the tenant can actually do.**
- **As a dispatcher, I want to select a technician and see their availability overlaid on the tenant's calendar, so that I can find times that work for both.**
- **As a dispatcher, I want to select adjacent time slots that merge into a single appointment, so that I control the duration of each visit.**
- **As a dispatcher, I want to book one appointment per day and assign different technicians to different days, so that I can handle multi-day jobs flexibly.**
- **As a dispatcher, I want to browse all technicians and view their schedules, so that I can check workload and see what's booked.**
- **As a dispatcher, I want to click a booked appointment on a technician's schedule to see the work order details, so that I have full context.**
- **As a dispatcher, I want to see technician specialties alongside their names, so that I assign the right tech for the job type.**

### Technician

- **As a technician, I want to see my appointments for today in chronological order, so that I know where to go and when.**
- **As a technician, I want to see the property address and tenant name for each appointment, so that I can plan my route and know who to contact.**
- **As a technician, I want to navigate to other days, so that I can see what's coming up tomorrow or later this week.**
- **As a technician, I want to see the full work order details for any appointment, so that I understand the problem before I arrive.**

## 5. Core Features

### 1. Tenant Availability Picker

The tenant portal (`/tenant?phone=...`) shows each open work order as a card. Each card has a "Set Availability" button that expands into an inline weekly grid.

The grid shows the next 7 days as columns and time slots (morning, midday, afternoon, evening) as rows. The tenant taps cells to toggle them on or off — selected cells are highlighted. They can select as many windows as they want across all days. A "Save Availability" button submits all selected windows at once.

If availability has already been submitted, the grid shows the saved selections with the option to edit. If an appointment has been booked for that work order, the card shows a confirmation banner with the date, time window, and technician name instead of the availability picker.

### 2. Dispatcher Scheduling Board

The dispatch page (`/dispatch`) has two tabs: **Work Orders** and **Technicians**.

#### Work Orders Tab

A scrollable list of work order cards. By default, the list shows unscheduled work orders (those with no appointments). Each card shows the work order title, tenant name, property address, priority badge, and a summary of submitted availability (e.g., "5 windows available" or "No availability yet").

Clicking a work order opens a **7-day calendar view**. Each column is a day. The rows are 30-minute time slots (8:00 AM to 6:00 PM). Slots where the tenant has submitted availability are active (clickable); slots without tenant availability are greyed out.

**Booking flow:**

1. The dispatcher selects a technician from a list beside the calendar. Each tech shows their name and specialty.
2. Clicking a technician overlays their availability on the calendar in green — slots where the tech has no existing appointments are highlighted.
3. The dispatcher selects one or more adjacent time slots where both the tenant and tech are available. Adjacent selected slots merge into a single appointment (e.g., selecting 9:00–9:30 and 9:30–10:00 creates one 9:00–10:00 appointment).
4. The dispatcher confirms the booking. The appointment is created and the calendar updates to show it.

Each confirmation books one appointment for one day. For multi-day jobs, the dispatcher selects slots on another day (potentially with a different technician) and confirms again. Each day's appointment is independent.

Work orders with existing appointments remain in the list with a badge (e.g., "1 visit scheduled") so the dispatcher can book additional visits.

#### Technicians Tab

A list of technician cards showing each tech's name and specialty. Clicking a technician opens their schedule view — a 7-day calendar showing booked appointments as blocks. The dispatcher can click any appointment block to see the associated work order details (title, tenant, address, priority).

This schedule view uses the same calendar component as the technician portal.

### 3. Technician Daily Schedule

The tech portal (`/tech?id=...`) shows the technician's appointments for the selected day as a vertical list in chronological order.

Each appointment card shows:
- Time range (e.g., "9:00 AM – 11:00 AM")
- Work order title
- Property address and unit number
- Tenant name

A date navigation bar at the top lets the technician switch between days. Days with appointments show a dot indicator.

If the technician has no appointments for the selected day, the page shows an empty state: "No jobs scheduled for today."

### 4. Multi-Day Job Support

A single work order can have multiple appointments across different days, potentially with different technicians. In the dispatcher view, work orders with existing appointments remain in the Work Orders tab with a badge showing "1 visit scheduled" (or however many). The dispatcher clicks the work order, selects slots on another day, picks a tech, and books an additional visit.

In the tenant view, all scheduled appointments for a work order are listed under its card in chronological order. In the tech view, each appointment shows independently in the daily schedule.

## 6. Out of Scope

- **Authentication and login** — Users are identified by URL params (phone number for tenants, UUID for technicians). No login flow.
- **Notifications** — No SMS, email, or push notifications when appointments are booked or changed. Users check their portal.
- **Appointment cancellation or rescheduling** — V1 focuses on creating appointments. Editing or canceling can be done by the dispatcher directly in the database or in a future version.
- **Technician availability or working hours** — Technicians are assumed available during business hours. No PTO or blocked-time system.
- **Automatic scheduling or optimization** — The dispatcher makes all scheduling decisions manually. No auto-assignment or route optimization.
- **Real-time updates or websockets** — Pages show current data on load. No live refresh when another user makes a change.
- **Mobile-native app** — The web app should be usable on mobile browsers, but no native app is planned.

## 7. Success Criteria

- **A tenant can submit availability and see a confirmed appointment** — End-to-end flow from availability submission to appointment visible on tenant portal.
- **A dispatcher can schedule any work order in under 60 seconds** — Given a work order with tenant availability, the dispatcher can find an open tech slot and book it without leaving the dispatch page.
- **All three portals reflect the same appointment data** — An appointment booked by the dispatcher is immediately visible on the tenant portal and the technician's daily schedule on next page load.
- **Multi-day jobs are fully supported** — A work order can have 2+ appointments on different days, and all parties see each visit.
- **Zero unscheduled work orders fall through the cracks** — The dispatcher sidebar clearly shows every work order that still needs an appointment, with visibility into whether the tenant has submitted availability.
