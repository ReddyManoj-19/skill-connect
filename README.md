# Skill Connect

Product Requirement Document (PRD): SkillBridgeProblem Statement ID: SIH26044  Problem Statement Title: Portal for Academia - Industry collaboration for Skill Mapping, Internships and Placement  Theme: Bridging the Gap Between Education and Industry Through Skill-Based Career Development  Category: Software  Target Solution Name: SkillBridge  Institution: Aditya University  Team Details: S.S. Manoj Kumar (Leader), V. Reddy Manoj Kumar, G. Aditya Sudarsan, U. Devaki, D. Triveni, Koppisetti Jaswanth Surya Charan  1. Document Overview & GoalThis document specifies the end-to-end software requirements for SkillBridge, a centralized collaborative ecosystem designed to bridge academia and industry through skill profiling, automatic gap identification, and recruiter-driven placement matching.  2. User Roles & PersonasStudent User: Enters academic qualifications and technical credentials, identifies missing skill gaps against market trends, explores suitable internships/jobs, and reviews direct interview/offer notices.Recruiter User: Publishes customized vacancy criteria with required certifications, assesses candidate suitability scores in real time, and sends direct hiring invitations.Administrator / Institution (Extended Phase): Tracks overall student batch metrics and high-demand skill areas to update academic curricula.3. Functional Specifications3.1 Authentication & OnboardingDual-Portal Access: Separate authentication workflows for students and corporate recruiters.Student Sign-Up / Login: Secure authentication using Full Name, University Email, Contact Number, and Password confirmation.Recruiter Authentication with OTP: Recruiter registration requires Work Email, Password, and Phone Number with an SMS OTP verification loop (simulated demo code: 1234 or via Firebase Phone Auth).3.2 Student Profile & Skill Gap Mapping EngineEducational Inputs: Captures Degree level, Discipline (CSE, ECE, IT, etc.), and Graduation Year.  Skill / Certification Selection: Multi-select checklist for verified technical capabilities (e.g., Python, SQL, React, AWS, Docker, Java).Zero-Certification Fallback: Direct navigation path to the "Industry Certification Guide" for candidates without prior credentials, outlining market expectations.Real-Time Suitability Metric: Calculates matching percentage for every active job opening using:$$\text{Suitability Score (\%)} = \left( \frac{\text{Matched Candidate Certifications}}{\text{Total Required Certifications for Role}} \right) \times 100$$Gap Visualizer: Color-coded indicators showcasing matched skills (green ✓) versus missing prerequisites (red ✗).Application Tracker & Offer Center: Interactive dashboard displaying active applications and incoming recruiter offers with Accept and Decline triggers.3.3 Recruiter Dashboard & Candidate Match ReviewerJob Requirement Engine: Form to post new job/internship profiles specifying company name, position title, and mandatory certification tags.Automated Candidate Match Scoring: Instant evaluation and ranking of registered students against any selected vacancy based on qualification and skill overlap.Direct Outreach Action: A dedicated "Recruit Candidate" action button that dispatches real-time alerts to the selected student's dashboard inbox.3.4 Navigation & State IntegrityStack-Based Back Navigation: A history stack mechanism allowing users to navigate backward through nested portal views (screen-profile $\leftrightarrow$ screen-matches $\leftrightarrow$ screen-guide $\leftrightarrow$ screen-candidate-matches).4. Technical ArchitectureLayerImplementation StrategyFrontend FrameworkReact.js (Vite), Tailwind CSS, Lucide React IconsState ManagementReact Context API / Zustand + LocalStorage PersistenceBackend / API (Future)Node.js (Express) REST APIs or Supabase Serverless FunctionsDatabaseMongoDB / Supabase PostgreSQL (Users, Jobs, Notifications collections)AuthenticationJWT Sessions + Firebase Phone Auth5. Lovable.dev Generation PromptPlaintextCreate a production-ready, highly responsive React.js web application for "SkillBridge: Academia - Industry Collaboration Portal" (SIH Problem Statement SIH26044) using Tailwind CSS and Lucide React icons.

Core Application Requirements:

1. App Layout & Global Navigation:
   - Header displaying the brand title "🎓 SkillBridge Portal", active user role indicator, a stack-based history "⬅️ Back" button (visible only when navigable history exists), and a "Logout" button.
   - Professional theme styling: slate background (#f8fafc), royal blue accents (#2563eb), emerald success badges (#16a34a), crisp card elevation, and responsive flex/grid layouts.

2. Role-Based Authentication System:
   - Top toggle to switch between "🎓 Student Portal" and "🏢 Recruiter Portal".
   - Sub-tabs for "Log In" and "Sign Up".
   - Student Sign Up Fields: User Name, Email, Mobile Number, Password, and Confirm Password. (Pre-fill login credentials: vrmk@gmail.com / manoj@123).
   - Recruiter Auth Flow: Includes Work Email, Password, and Mobile Number with an active "Send OTP" button, a conditional OTP input field (default demo code: 1234), a "Verify OTP" confirmation trigger, and form submission locks until OTP verification succeeds.

3. Student Portal Flow:
   - Step 1: Academic & Skill Entry
     * Fields for Degree (B.Tech CSE, B.Tech ECE, BCA/B.Sc, MCA/M.Tech), Graduation Year (2025-2028), and a multi-select checkbox grid for Certifications (Python, SQL, Power BI, JavaScript, React, AWS Cloud, Docker, Java).
     * Action Buttons: "Submit & View Suitable Roles" (alerts 'Account created successfully!') and "I don't have certifications" (navigates to the Industry Guide).
   - Step 2: Suitable Job Matches Dashboard
     * Displays job cards with Company Name, Role Title, dynamic match percentage calculation, matched tags (green check), missing tags (red cross), and an "Apply Now" button that updates state to "Applied ✅".
   - Step 3: Industry Certification Guide
     * Catalog of industry partner hiring requirements for students looking to upskill.
   - Step 4: Recruitment Offer Inbox
     * Banner and notification cards displaying offers initiated by recruiters, with interactive "Accept Offer 🤝" and "Decline" buttons updating status in real time.

4. Recruiter Portal Flow:
   - Recruiter Dashboard: Action cards to "Post New Job Opening" and "Review Candidate Matches".
   - Job Posting Form: Allows entering Role Name, Company Name, and selecting required skill tags. Dynamically pushes the job to the database.
   - Candidate Match Reviewer: Dropdown to select any posted opening. Renders registered candidates ranked by percentage match score, displaying their degree, matched skills, missing skills, and a "🤝 Recruit Candidate" button.
   - Clicking "Recruit Candidate" dispatches a recruitment notice directly to that student's notification store.

5. Data Persistence & Mock Data:
   - Pre-populate state with 3 mock students (including 'Manoj' with Python/SQL/Power BI, 'Priya Sharma' with AWS/Docker/Python, 'Rahul Verma' with JS/React) and 4 industry job postings so match algorithms and recruitment actions function immediately.
6. Success Metrics & ValidationSkill Mapping Accuracy: Correct computation of percentage suitability relative to total required credentials.Ecosystem Completeness: Closed-loop communication between recruiter candidate selection and student inbox resolution.Onboarding Flexibility: Seamless branch-off paths for certified candidates versus learners requiring certification guidance.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9142dae5-5514-4031-8746-54ee82189cd7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
