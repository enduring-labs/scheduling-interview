# Database Schema

## tenants

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| name | varchar(128) | NOT NULL |
| phone | varchar(32) | NOT NULL, UNIQUE |
| email | varchar(256) | nullable |
| created_at | timestamp | NOT NULL, default now() |

## technicians

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| name | varchar(128) | NOT NULL |
| phone | varchar(32) | NOT NULL |
| specialty | varchar(64) | NOT NULL |
| created_at | timestamp | NOT NULL, default now() |

## work_orders

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| title | varchar(256) | NOT NULL |
| description | text | nullable |
| status | varchar(32) | NOT NULL, default "open" |
| priority | varchar(32) | NOT NULL, default "normal" |
| tenant_id | uuid | NOT NULL, FK → tenants.id |
| property_address | varchar(256) | NOT NULL |
| unit_number | varchar(32) | nullable |
| created_at | timestamp | NOT NULL, default now() |
| updated_at | timestamp | NOT NULL, default now() |

## availability_windows

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| work_order_id | uuid | NOT NULL, FK → work_orders.id |
| date | date | NOT NULL |
| start_time | time | NOT NULL |
| end_time | time | NOT NULL |
| created_at | timestamp | NOT NULL, default now() |

## appointments

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default random |
| work_order_id | uuid | NOT NULL, FK → work_orders.id |
| technician_id | uuid | NOT NULL, FK → technicians.id |
| date | date | NOT NULL |
| start_time | time | NOT NULL |
| end_time | time | NOT NULL |
| notes | text | nullable |
| created_at | timestamp | NOT NULL, default now() |

## Relations

- `work_orders.tenant_id` → `tenants.id`
- `availability_windows.work_order_id` → `work_orders.id`
- `appointments.work_order_id` → `work_orders.id`
- `appointments.technician_id` → `technicians.id`
