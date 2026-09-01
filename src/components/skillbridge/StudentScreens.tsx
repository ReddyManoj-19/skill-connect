import { useState } from "react";
import { Award, BookOpen, Briefcase, Building2, Inbox, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  ALL_SKILLS,
  DEGREES,
  GRAD_YEARS,
  matchScore,
  useSkillBridge,
} from "@/lib/skillbridge";
import { Button, Card, Label, MatchBar, SectionTitle, SkillTag, inputClass } from "./ui";

export function StudentProfileScreen() {
  const { student, upsertStudent, navigate } = useSkillBridge();
  const [degree, setDegree] = useState(student?.degree || DEGREES[0]);
  const [gradYear, setGradYear] = useState(student?.gradYear || GRAD_YEARS[1]);
  const [skills, setSkills] = useState<string[]>(student?.skills ?? []);

  function persist() {
    upsertStudent({
      id: student?.id,
      name: student?.name ?? "Student",
      email: student?.email ?? "student@univ.edu",
      mobile: student?.mobile,
      degree,
      gradYear,
      skills,
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card>
        <SectionTitle
          title="Step 1 · Academic & skill entry"
          subtitle="Your credentials drive every suitability score in the portal."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Degree</Label>
            <select className={inputClass} value={degree} onChange={(e) => setDegree(e.target.value)}>
              {DEGREES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Graduation year</Label>
            <select
              className={inputClass}
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
            >
              {GRAD_YEARS.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Label>Certifications & verified skills</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ALL_SKILLS.map((s) => {
              const active = skills.includes(s);
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
                      setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
                    }
                  />
                  {s}
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              persist();
              toast.success("Account created successfully!");
              navigate("screen-matches");
            }}
          >
            <Briefcase className="size-4" /> Submit & view suitable roles
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              persist();
              navigate("screen-guide");
            }}
          >
            <BookOpen className="size-4" /> I don't have certifications
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function JobMatchesScreen() {
  const { jobs, student, applications, apply, navigate, offers } = useSkillBridge();
  const skills = student?.skills ?? [];
  const ranked = jobs
    .map((j) => ({ job: j, ...matchScore(skills, j.required) }))
    .sort((a, b) => b.percent - a.percent);
  const myOffers = offers.filter((o) => o.studentId === student?.id);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <SectionTitle
          title="Step 2 · Suitable job matches"
          subtitle={`Ranked against your ${skills.length} verified certification${skills.length === 1 ? "" : "s"}.`}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("screen-guide")}>
            <BookOpen className="size-4" /> Certification guide
          </Button>
          <Button variant="outline" onClick={() => navigate("screen-offers")}>
            <Inbox className="size-4" /> Offers
            {myOffers.length ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {myOffers.length}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ranked.map(({ job, percent, matched, missing }) => {
          const applied = applications.includes(job.id);
          return (
            <Card key={job.id} className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Building2 className="size-4" /> {job.company}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{job.role}</h3>
                <p className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {job.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {job.location}
                    </span>
                  ) : null}
                  {job.stipend ? <span>{job.stipend}</span> : null}
                </p>
              </div>
              <MatchBar percent={percent} />
              <div className="flex flex-wrap gap-1.5">
                {matched.map((s) => (
                  <SkillTag key={s} skill={s} state="matched" />
                ))}
                {missing.map((s) => (
                  <SkillTag key={s} skill={s} state="missing" />
                ))}
              </div>
              <Button
                variant={applied ? "success" : "primary"}
                disabled={applied}
                onClick={() => {
                  apply(job.id);
                  toast.success(`Application sent to ${job.company}.`);
                }}
              >
                {applied ? "Applied ✅" : "Apply Now"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function GuideScreen() {
  const { jobs, navigate } = useSkillBridge();
  const demand = ALL_SKILLS.map((s) => ({
    skill: s,
    count: jobs.filter((j) => j.required.includes(s)).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <SectionTitle
        title="Industry certification guide"
        subtitle="What our hiring partners expect before an interview call."
      />
      <Card className="mb-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Award className="size-4 text-primary" /> Most in-demand certifications right now
        </h3>
        <div className="space-y-2.5">
          {demand.map((d) => (
            <div key={d.skill} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm font-medium text-foreground">{d.skill}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(6, (d.count / Math.max(1, jobs.length)) * 100)}%` }}
                />
              </div>
              <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                {d.count} of {jobs.length} roles
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((j) => (
          <Card key={j.id}>
            <div className="text-sm font-semibold text-primary">{j.company}</div>
            <h3 className="text-base font-semibold text-foreground">{j.role}</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Required credentials
            </p>
            <ul className="mt-2 space-y-1.5">
              {j.required.map((r) => (
                <li key={r} className="text-sm text-foreground">
                  • {r}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate("screen-matches")}>
          <Briefcase className="size-4" /> View suitable roles
        </Button>
      </div>
    </div>
  );
}

export function OffersScreen() {
  const { offers, student, respondToOffer } = useSkillBridge();
  const mine = offers.filter((o) => o.studentId === student?.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-5 rounded-2xl bg-primary px-6 py-5 text-primary-foreground">
        <h2 className="text-lg font-semibold">Recruitment offer inbox</h2>
        <p className="mt-1 text-sm opacity-90">
          {mine.length
            ? `${mine.filter((o) => o.status === "pending").length} offer(s) awaiting your response.`
            : "No offers yet — recruiters will reach you here."}
        </p>
      </div>

      <div className="space-y-4">
        {mine.map((o) => (
          <Card key={o.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-primary">{o.company}</div>
              <h3 className="text-base font-semibold text-foreground">{o.role}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Suitability at time of offer: {o.match}%
              </p>
            </div>
            {o.status === "pending" ? (
              <div className="flex gap-2">
                <Button
                  variant="success"
                  onClick={() => {
                    respondToOffer(o.id, "accepted");
                    toast.success(`Offer accepted — ${o.company}`);
                  }}
                >
                  Accept Offer 🤝
                </Button>
                <Button variant="danger" onClick={() => respondToOffer(o.id, "declined")}>
                  Decline
                </Button>
              </div>
            ) : (
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${o.status === "accepted" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
              >
                {o.status === "accepted" ? "Accepted ✅" : "Declined"}
              </span>
            )}
          </Card>
        ))}
        {!mine.length && (
          <Card>
            <p className="text-sm text-muted-foreground">
              Keep applying and closing skill gaps — recruiter invitations land straight in this inbox.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
