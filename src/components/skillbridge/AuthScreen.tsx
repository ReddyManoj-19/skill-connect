import { useState } from "react";
import { Building2, GraduationCap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSkillBridge, type Role } from "@/lib/skillbridge";
import { Button, Card, Label, inputClass } from "./ui";

const DEMO_OTP = "1234";

export function AuthScreen() {
  const { reset, students, setCurrentStudent, upsertStudent } = useSkillBridge();
  const [role, setRole] = useState<Role>("student");
  const [tab, setTab] = useState<"login" | "signup">("login");

  // student
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("vrmk@gmail.com");
  const [sMobile, setSMobile] = useState("");
  const [sPass, setSPass] = useState("manoj@123");
  const [sConfirm, setSConfirm] = useState("");

  // recruiter
  const [rEmail, setREmail] = useState("hr@infosys.com");
  const [rPass, setRPass] = useState("recruit@123");
  const [rMobile, setRMobile] = useState("9876500000");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  function studentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "signup") {
      if (!sName.trim() || !sEmail.trim()) { toast.error("Name and email are required."); return; }
      if (sPass.length < 6) { toast.error("Password must be at least 6 characters."); return; }
      if (sPass !== sConfirm) { toast.error("Passwords do not match."); return; }
      upsertStudent({
        name: sName.trim(),
        email: sEmail.trim(),
        mobile: sMobile.trim(),
        degree: "",
        gradYear: "",
        skills: [],
      });
      toast.success("Account created successfully!");
      reset("student", "screen-profile");
      return;
    }
    const existing = students.find((s) => s.email.toLowerCase() === sEmail.trim().toLowerCase());
    if (!existing) { toast.error("No student found with that email. Try signing up."); return; }
    setCurrentStudent(existing.id);
    toast.success(`Welcome back, ${existing.name}!`);
    reset("student", "screen-profile");
  }

  function recruiterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!otpVerified) { toast.error("Verify the OTP sent to your mobile first."); return; }
    toast.success("Recruiter session started.");
    reset("recruiter", "screen-recruiter-home");
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Academia · Industry collaboration portal
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Map your skills, close the gaps, and get matched with hiring partners.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1.5">
        <button
          onClick={() => setRole("student")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${role === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
        >
          <GraduationCap className="size-4" /> Student Portal
        </button>
        <button
          onClick={() => setRole("recruiter")}
          className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${role === "recruiter" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
        >
          <Building2 className="size-4" /> Recruiter Portal
        </button>
      </div>

      <Card>
        <div className="mb-5 flex gap-6 border-b border-border">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-2.5 text-sm font-semibold transition ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {role === "student" ? (
          <form onSubmit={studentSubmit} className="space-y-4">
            {tab === "signup" && (
              <div>
                <Label>User name</Label>
                <input
                  className={inputClass}
                  value={sName}
                  maxLength={80}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
            )}
            <div>
              <Label>University email</Label>
              <input
                type="email"
                className={inputClass}
                value={sEmail}
                maxLength={120}
                onChange={(e) => setSEmail(e.target.value)}
              />
            </div>
            {tab === "signup" && (
              <div>
                <Label>Mobile number</Label>
                <input
                  className={inputClass}
                  value={sMobile}
                  maxLength={15}
                  onChange={(e) => setSMobile(e.target.value.replace(/[^\d+]/g, ""))}
                  placeholder="10-digit mobile"
                />
              </div>
            )}
            <div>
              <Label>Password</Label>
              <input
                type="password"
                className={inputClass}
                value={sPass}
                maxLength={64}
                onChange={(e) => setSPass(e.target.value)}
              />
            </div>
            {tab === "signup" && (
              <div>
                <Label>Confirm password</Label>
                <input
                  type="password"
                  className={inputClass}
                  value={sConfirm}
                  maxLength={64}
                  onChange={(e) => setSConfirm(e.target.value)}
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              {tab === "login" ? "Log in as student" : "Create student account"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo login pre-filled: vrmk@gmail.com / manoj@123
            </p>
          </form>
        ) : (
          <form onSubmit={recruiterSubmit} className="space-y-4">
            <div>
              <Label>Work email</Label>
              <input
                type="email"
                className={inputClass}
                value={rEmail}
                maxLength={120}
                onChange={(e) => setREmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Password</Label>
              <input
                type="password"
                className={inputClass}
                value={rPass}
                maxLength={64}
                onChange={(e) => setRPass(e.target.value)}
              />
            </div>
            <div>
              <Label>Mobile number</Label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={rMobile}
                  maxLength={15}
                  onChange={(e) => setRMobile(e.target.value.replace(/[^\d+]/g, ""))}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    if (rMobile.replace(/\D/g, "").length < 10) {
                      toast.error("Enter a valid 10-digit mobile number.");
                      return;
                    }
                    setOtpSent(true);
                    setOtpVerified(false);
                    toast.success("OTP sent (demo code: 1234)");
                  }}
                >
                  Send OTP
                </Button>
              </div>
            </div>

            {otpSent && (
              <div className="rounded-xl border border-border bg-accent/50 p-4">
                <Label>Enter OTP</Label>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    value={otp}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="1234"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <Button
                    type="button"
                    variant={otpVerified ? "success" : "primary"}
                    className="shrink-0"
                    onClick={() => {
                      if (otp === DEMO_OTP) {
                        setOtpVerified(true);
                        toast.success("Mobile number verified.");
                      } else {
                        toast.error("Invalid OTP. Demo code is 1234.");
                      }
                    }}
                  >
                    {otpVerified ? "Verified" : "Verify OTP"}
                  </Button>
                </div>
                {otpVerified && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success">
                    <ShieldCheck className="size-3.5" /> OTP verification complete
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!otpVerified}>
              {tab === "login" ? "Log in as recruiter" : "Create recruiter account"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Form unlocks only after OTP verification.
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
