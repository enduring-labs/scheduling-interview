import { getTechnicians, getTechnicianById } from "@/lib/queries/technicians";
import { getAppointmentsByTechnicianId } from "@/lib/queries/appointments";
import { TechSchedule } from "./tech-schedule";

export default async function TechPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    const techs = await getTechnicians();
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-2xl font-bold">Tech Portal</h1>
        <p className="mb-4 text-gray-500">Select a technician:</p>
        <div className="space-y-2">
          {techs.map((t) => (
            <a
              key={t.id}
              href={`/tech?id=${t.id}`}
              className="block rounded-lg border bg-white p-3 shadow-sm hover:bg-gray-50"
            >
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-gray-500">{t.specialty}</p>
            </a>
          ))}
        </div>
      </main>
    );
  }

  const tech = await getTechnicianById(id);

  if (!tech) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p className="text-gray-500">Technician not found.</p>
      </main>
    );
  }

  const appointments = await getAppointmentsByTechnicianId(id);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-1 text-2xl font-bold">{tech.name}</h1>
      <p className="mb-6 text-sm text-gray-500">{tech.specialty}</p>
      <TechSchedule appointments={appointments} />
    </main>
  );
}
