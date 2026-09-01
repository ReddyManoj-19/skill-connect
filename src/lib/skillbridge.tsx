import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const ALL_SKILLS = [
  "Python",
  "SQL",
  "Power BI",
  "JavaScript",
  "React",
  "AWS Cloud",
  "Docker",
  "Java",
] as const;

export const DEGREES = ["B.Tech CSE", "B.Tech ECE", "BCA/B.Sc", "MCA/M.Tech"] as const;
export const GRAD_YEARS = ["2025", "2026", "2027", "2028"] as const;

export type Student = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  degree: string;
  gradYear: string;
  skills: string[];
};

export type Job = {
  id: string;
  company: string;
  role: string;
  required: string[];
  stipend?: string;
  location?: string;
};

export type OfferStatus = "pending" | "accepted" | "declined";

export type Offer = {
  id: string;
  studentId: string;
  jobId: string;
  company: string;
  role: string;
  match: number;
  status: OfferStatus;
  createdAt: number;
};

export type Screen =
  | "screen-auth"
  | "screen-profile"
  | "screen-matches"
  | "screen-guide"
  | "screen-offers"
  | "screen-recruiter-home"
  | "screen-post-job"
  | "screen-candidate-matches";

export type Role = "student" | "recruiter";

const MOCK_STUDENTS: Student[] = [
  {
    id: "stu-1",
    name: "Manoj",
    email: "vrmk@gmail.com",
    mobile: "9876543210",
    degree: "B.Tech CSE",
    gradYear: "2026",
    skills: ["Python", "SQL", "Power BI"],
  },
  {
    id: "stu-2",
    name: "Priya Sharma",
    email: "priya.sharma@univ.edu",
    mobile: "9812345678",
    degree: "MCA/M.Tech",
    gradYear: "2025",
    skills: ["AWS Cloud", "Docker", "Python"],
  },
  {
    id: "stu-3",
    name: "Rahul Verma",
    email: "rahul.verma@univ.edu",
    mobile: "9900112233",
    degree: "BCA/B.Sc",
    gradYear: "2027",
    skills: ["JavaScript", "React"],
  },
];

const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    company: "Infosys",
    role: "Data Analyst Intern",
    required: ["Python", "SQL", "Power BI"],
    stipend: "₹25,000 / month",
    location: "Hyderabad",
  },
  {
    id: "job-2",
    company: "Amazon",
    role: "Cloud Support Associate",
    required: ["AWS Cloud", "Docker", "Python", "SQL"],
    stipend: "₹45,000 / month",
    location: "Bengaluru",
  },
  {
    id: "job-3",
    company: "Zoho",
    role: "Frontend Engineer Trainee",
    required: ["JavaScript", "React"],
    stipend: "₹30,000 / month",
    location: "Chennai",
  },
  {
    id: "job-4",
    company: "TCS Digital",
    role: "Java Backend Developer",
    required: ["Java", "SQL", "Docker"],
    stipend: "₹35,000 / month",
    location: "Pune",
  },
];

export function matchScore(studentSkills: string[], required: string[]) {
  if (required.length === 0) return 0;
  const matched = required.filter((r) => studentSkills.includes(r));
  return {
    percent: Math.round((matched.length / required.length) * 100),
    matched,
    missing: required.filter((r) => !studentSkills.includes(r)),
  };
}

type State = {
  role: Role | null;
  currentStudentId: string | null;
  students: Student[];
  jobs: Job[];
  offers: Offer[];
  applications: string[];
  stack: Screen[];
};

const STORAGE_KEY = "skillbridge-state-v1";

const initialState: State = {
  role: null,
  currentStudentId: null,
  students: MOCK_STUDENTS,
  jobs: MOCK_JOBS,
  offers: [],
  applications: [],
  stack: ["screen-auth"],
};

type Ctx = State & {
  screen: Screen;
  canGoBack: boolean;
  student: Student | null;
  navigate: (s: Screen) => void;
  back: () => void;
  reset: (role: Role, screen: Screen) => void;
  logout: () => void;
  upsertStudent: (s: Omit<Student, "id"> & { id?: string }) => Student;
  setCurrentStudent: (id: string) => void;
  addJob: (j: Omit<Job, "id">) => void;
  apply: (jobId: string) => void;
  sendOffer: (studentId: string, job: Job, match: number) => void;
  respondToOffer: (offerId: string, status: OfferStatus) => void;
};

const SkillBridgeContext = createContext<Ctx | null>(null);

export function SkillBridgeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const navigate = useCallback((s: Screen) => {
    setState((p) => (p.stack[p.stack.length - 1] === s ? p : { ...p, stack: [...p.stack, s] }));
  }, []);

  const back = useCallback(() => {
    setState((p) => (p.stack.length > 1 ? { ...p, stack: p.stack.slice(0, -1) } : p));
  }, []);

  const reset = useCallback((role: Role, screen: Screen) => {
    setState((p) => ({ ...p, role, stack: [screen] }));
  }, []);

  const logout = useCallback(() => {
    setState((p) => ({ ...p, role: null, currentStudentId: null, stack: ["screen-auth"] }));
  }, []);

  const upsertStudent: Ctx["upsertStudent"] = useCallback((s) => {
    const id = s.id ?? `stu-${Date.now()}`;
    const next: Student = { ...s, id };
    setState((p) => {
      const exists = p.students.some((x) => x.id === id || x.email === s.email);
      return {
        ...p,
        currentStudentId: id,
        students: exists
          ? p.students.map((x) => (x.id === id || x.email === s.email ? { ...x, ...next, id: x.id } : x))
          : [...p.students, next],
      };
    });
    return next;
  }, []);

  const value = useMemo<Ctx>(() => {
    const screen = state.stack[state.stack.length - 1] ?? "screen-auth";
    return {
      ...state,
      screen,
      canGoBack: state.stack.length > 1,
      student: state.students.find((s) => s.id === state.currentStudentId) ?? null,
      navigate,
      back,
      reset,
      logout,
      upsertStudent,
      setCurrentStudent: (id) => setState((p) => ({ ...p, currentStudentId: id })),
      addJob: (j) =>
        setState((p) => ({ ...p, jobs: [...p.jobs, { ...j, id: `job-${Date.now()}` }] })),
      apply: (jobId) =>
        setState((p) =>
          p.applications.includes(jobId) ? p : { ...p, applications: [...p.applications, jobId] },
        ),
      sendOffer: (studentId, job, match) =>
        setState((p) => ({
          ...p,
          offers: [
            ...p.offers,
            {
              id: `off-${Date.now()}`,
              studentId,
              jobId: job.id,
              company: job.company,
              role: job.role,
              match,
              status: "pending",
              createdAt: Date.now(),
            },
          ],
        })),
      respondToOffer: (offerId, status) =>
        setState((p) => ({
          ...p,
          offers: p.offers.map((o) => (o.id === offerId ? { ...o, status } : o)),
        })),
    };
  }, [state, navigate, back, reset, logout, upsertStudent]);

  return <SkillBridgeContext.Provider value={value}>{children}</SkillBridgeContext.Provider>;
}

export function useSkillBridge() {
  const ctx = useContext(SkillBridgeContext);
  if (!ctx) throw new Error("useSkillBridge must be used inside SkillBridgeProvider");
  return ctx;
}
