import { ListingForm } from "../components/ListingForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                AWS Migration PoC
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                Property Listing Intake
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                A focused migration demo for validating seller listing intake,
                PostgreSQL persistence, audit logging, and Lambda/API Gateway
                readiness.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">Runtime</p>
                <p className="mt-1 font-semibold text-slate-900">Lambda</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">Database</p>
                <p className="mt-1 font-semibold text-slate-900">Postgres</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">Logging</p>
                <p className="mt-1 font-semibold text-slate-900">Audit</p>
              </div>
            </div>
          </div>
        </header>

        <ListingForm />
      </section>
    </main>
  );
}
