const STATS = [
  { value: "2,000+", label: "Students enrolled" },
  { value: "150+", label: "Expert mentors" },
  { value: "80+", label: "Courses available" },
  { value: "200+", label: "Webinars hosted" },
];

export function StatsSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 px-4">
      <div className="absolute inset-0 -z-10 bg-brand-gradient" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="space-y-2">
              <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {value}
              </p>
              <p className="text-white/85 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
