import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { SkillBridgeProvider } from "@/lib/skillbridge";
import { Portal } from "@/components/skillbridge/Portal";

const title = "SkillBridge — Skill Mapping, Internships & Placements";
const description =
  "SkillBridge connects students and recruiters: map certifications, visualise skill gaps, and get matched to internships and jobs.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SkillBridgeProvider>
      <h1 className="sr-only">SkillBridge — academia and industry collaboration portal</h1>
      <Portal />
      <Toaster position="top-center" richColors />
    </SkillBridgeProvider>
  );
}
