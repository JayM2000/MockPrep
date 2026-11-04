export const SITE_CONFIG = {
  name: "AI Project Platform",
  shortName: "MockPrep",
  copyrightYear: 2026,
  description:
    "AI-powered real-world engineering project and interview simulation platform.",
  links: {
    github: "https://github.com",
    docs: "/docs",
  },
  routes: {
    home: "/",
    signIn: "/sign-in",
    signUp: "/sign-up",
    dashboard: "/dashboard",
    projects: "/projects",
    sessions: "/sessions",
    settings: "/settings",
  },
} as const
