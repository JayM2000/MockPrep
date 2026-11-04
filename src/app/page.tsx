import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Terminal, Shield, Cpu, Code2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <header className="border-b border-border bg-background/95 sticky top-0 z-40">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Terminal className="size-5 text-primary" />
            <span className="font-semibold text-base tracking-tight">AI Project Platform</span>
            <Badge variant="secondary" className="text-xs font-normal">Preview</Badge>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Real-World Engineering Challenges & Interview Simulations
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Generate realistic software projects, introduce authentic engineering challenges,
              configure strict AI permissions, and evaluate engineering candidates in isolated sessions.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Launch Platform <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg">
                  Join with Code
                </Button>
              </Link>
            </div>
          </div>

          {/* Core Feature Pillars */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Code2 className="size-5" />
                  <CardTitle className="text-base font-semibold">Realistic Projects</CardTitle>
                </div>
                <CardDescription>
                  Full-stack project scaffolding across modern frameworks and databases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate synthetic codebases or import curated templates matching production environments.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Cpu className="size-5" />
                  <CardTitle className="text-base font-semibold">Configurable Challenges</CardTitle>
                </div>
                <CardDescription>
                  Inject bugs, performance hurdles, and feature requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clearly separate difficulty and severity with strict server-side evaluation criteria.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="size-5" />
                  <CardTitle className="text-base font-semibold">AI Governance</CardTitle>
                </div>
                <CardDescription>
                  Fine-grained controls over allowed AI assistant features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enforce tool permissions, audit code assistance, and isolate session execution contexts.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-6">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-sm text-muted-foreground">
          <p>© 2026 AI Project Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-xs">Theme: System / Light / Dark / Purple</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
