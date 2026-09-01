import { useState } from "react";
import { PlusCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { ALL_SKILLS, matchScore, useSkillBridge } from "@/lib/skillbridge";
import { Button, Card, Label, MatchBar, SectionTitle, SkillTag, inputClass } from "./ui";

export function RecruiterHomeScreen() {
  const { navigate, jobs, students, offers } = useSkillBridge();
  return (
    <div className="mx-auto w-full max-w-4xl">
      <SectionTitle
        title="Recruiter dashboard"
        subtitle="Publish vacancies and review ranked candidate matches instantly."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open postings", value: jobs.length },
          { label: "Registered candidates", value: students.length },
          { label: "Offers dispatched", value: offers.length },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <PlusCircle className="size-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Post new job opening</h3>
          <p className="text-sm text-muted-foreground">
            Define the role, company and mandatory certification tags.
          </p>
          <Button className="mt-auto" onClick={() => navigate("screen-post-job")}>
            Create posting
          </Button>
        </Card>
        <Card className="flex flex-col gap-3">
          <Users className="size-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Review candidate matches</h3>
          <p className="text-sm text-muted-foreground">
            Rank every registered student by skill overlap and recruit directly.
          </p>
          <Button className="mt-auto" onClick={() => navigate("screen-candidate-matches")}>
            Open reviewer
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function PostJobScreen() {
  const { addJob, navigate } = useSkillBridge();
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [required, setRequired] = useState<string[]>([]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <SectionTitle title="Post new job / internship" subtitle="Requirements drive candidate scoring." />
        <div className="space-y-4">
          <div>
            <Label>Role name</Label>
            <input
              className={inputClass}
              value={role}
              maxLength={80}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Data Engineer Intern"
            />
          </div>
          <div>
            <Label>Company name</Label>
            <input
              className={inputClass}
              value={company}
              maxLength={80}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Wipro"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Location</Label>
              <input
                className={inputClass}
                value={location}
                maxLength={60}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hyderabad"
              />
            </div>
            <div>
              <Label>Stipend / CTC</Label>
              <input
                className={inputClass}
                value={stipend}
                maxLength={40}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="₹30,000 / month"
              />
            </div>
          </div>
          <div>
            <Label>Required certifications</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ALL_SKILLS.map((s) => {
                const active = required.includes(s);
                return (
                  <label
                    key={s}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${active ? "border-primary bg-accent text-primary" : "border-input text-foreground hover:bg-accent/60"}`}
                  >
                    <input
                      type="checkbox"
                      className="size-4 accent-current"
                      checked={active}
                      onChange={() =>
                        setRequired((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
                      }
                    />
                    {s}
                  </label>
                );
              })}
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              if (!role.trim() || !company.trim()) {
                toast.error("Role and company name are required.");
                return;
              }
              if (!required.length) {
                toast.error("Select at least one required certification.");
                return;
              }
              addJob({
                role: role.trim(),
                company: company.trim(),
                required,
                location: location.trim() || undefined,
                stipend: stipend.trim() || undefined,
              });
              toast.success("Job opening published.");
              navigate("screen-candidate-matches");
            }}
          >
            Publish opening
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function CandidateMatchesScreen() {
  const { jobs, students, sendOffer, offers } = useSkillBridge();
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];

  const ranked = job
    ? students
        .map((s) => ({ student: s, ...matchScore(s.skills, job.required) }))
        .sort((a, b) => b.percent - a.percent)
    : [];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <SectionTitle
        title="Candidate match reviewer"
        subtitle="Students ranked by certification overlap with the selected vacancy."
      />
      <Card className="mb-5">
        <Label>Select opening</Label>
        <select className={inputClass} value={jobId} onChange={(e) => setJobId(e.target.value)}>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.company} — {j.role}
            </option>
          ))}
        </select>
        {job ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.required.map((r) => (
              <span
                key={r}
                className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
              >
                {r}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="space-y-4">
        {ranked.map(({ student, percent, matched, missing }) => {
          const already = offers.some(
            (o) => o.studentId === student.id && o.jobId === job?.id,
          );
          return (
            <Card key={student.id} className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="lg:w-56">
                <h3 className="text-base font-semibold text-foreground">{student.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {student.degree || "Degree pending"} · {student.gradYear || "—"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{student.email}</p>
              </div>
              <div className="flex-1 space-y-2">
                <MatchBar percent={percent} />
                <div className="flex flex-wrap gap-1.5">
                  {matched.map((s) => (
                    <SkillTag key={s} skill={s} state="matched" />
                  ))}
                  {missing.map((s) => (
                    <SkillTag key={s} skill={s} state="missing" />
                  ))}
                </div>
              </div>
              <Button
                variant={already ? "success" : "primary"}
                disabled={already || !job}
                onClick={() => {
                  if (!job) return;
                  sendOffer(student.id, job, percent);
                  toast.success(`Recruitment notice sent to ${student.name}.`);
                }}
              >
                {already ? "Notice sent ✅" : "🤝 Recruit Candidate"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
