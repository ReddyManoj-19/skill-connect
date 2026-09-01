import { ArrowLeft, Bell, GraduationCap, LogOut } from "lucide-react";
import { useSkillBridge } from "@/lib/skillbridge";
import { AuthScreen } from "./AuthScreen";
import {
  GuideScreen,
  JobMatchesScreen,
  OffersScreen,
  StudentProfileScreen,
} from "./StudentScreens";
import {
  CandidateMatchesScreen,
  PostJobScreen,
  RecruiterHomeScreen,
} from "./RecruiterScreens";
import { Button } from "./ui";

export function Portal() {
  const { screen, canGoBack, back, logout, role, student, offers, navigate } = useSkillBridge();
  const pendingOffers = offers.filter(
    (o) => o.studentId === student?.id && o.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="text-base font-bold leading-tight text-foreground">SkillBridge Portal</p>
              <p className="text-xs text-muted-foreground">Academia · Industry collaboration</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {role ? (
              <span className="hidden rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:inline">
                {role === "student" ? `🎓 Student${student ? ` · ${student.name}` : ""}` : "🏢 Recruiter"}
              </span>
            ) : null}
            {role === "student" ? (
              <button
                onClick={() => navigate("screen-offers")}
                className="relative inline-flex size-9 items-center justify-center rounded-lg border border-input text-foreground transition hover:bg-accent"
                aria-label="Offer inbox"
              >
                <Bell className="size-4" />
                {pendingOffers ? (
                  <span className="absolute -right-1 -top-1 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {pendingOffers}
                  </span>
                ) : null}
              </button>
            ) : null}
            {canGoBack ? (
              <Button variant="outline" onClick={back}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            ) : null}
            {role ? (
              <Button variant="ghost" onClick={logout}>
                <LogOut className="size-4" /> Logout
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {screen === "screen-auth" && <AuthScreen />}
        {screen === "screen-profile" && <StudentProfileScreen />}
        {screen === "screen-matches" && <JobMatchesScreen />}
        {screen === "screen-guide" && <GuideScreen />}
        {screen === "screen-offers" && <OffersScreen />}
        {screen === "screen-recruiter-home" && <RecruiterHomeScreen />}
        {screen === "screen-post-job" && <PostJobScreen />}
        {screen === "screen-candidate-matches" && <CandidateMatchesScreen />}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        SkillBridge · SIH26044 · Aditya University
      </footer>
    </div>
  );
}
