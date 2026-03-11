"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Play, Sparkles, Zap, Globe } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Video Creation
          </Badge>

          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create{" "}
            <span className="text-primary">100s of Videos</span>
            <br />
            Using Just a Keyword
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Transform any keyword into professional videos with AI-generated scripts, 
            voiceovers, and stunning visuals. Publish directly to YouTube, TikTok, 
            Instagram, and more.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 px-8">
              <Link href="/auth/sign-up">
                <Zap className="h-4 w-4" />
                Start Creating Free
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2 px-8">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              50+ languages supported
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Used by 10,000+ creators
            </div>
          </div>

          {/* Video preview mockup */}
          <div className="relative mt-16 w-full max-w-5xl">
            <div className="aspect-video overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl">
              <div className="flex h-full flex-col">
                {/* Browser bar */}
                <div className="flex items-center gap-2 border-b border-border/50 bg-muted/50 px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-destructive/50" />
                    <div className="h-3 w-3 rounded-full bg-accent/50" />
                    <div className="h-3 w-3 rounded-full bg-primary/50" />
                  </div>
                  <div className="ml-4 flex-1 rounded-md bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                    app.contentreel.io/dashboard
                  </div>
                </div>
                {/* Dashboard preview */}
                <div className="flex flex-1 gap-4 p-4">
                  <div className="hidden w-48 flex-col gap-3 sm:flex">
                    <div className="h-8 rounded-md bg-primary/20" />
                    <div className="h-6 w-3/4 rounded-md bg-muted" />
                    <div className="h-6 w-2/3 rounded-md bg-muted" />
                    <div className="h-6 w-4/5 rounded-md bg-muted" />
                    <div className="mt-auto h-6 w-1/2 rounded-md bg-muted" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-3">
                      <div className="h-10 flex-1 rounded-md bg-muted" />
                      <div className="h-10 w-24 rounded-md bg-primary/30" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-[9/16] rounded-lg bg-muted/50 p-2">
                          <div className="h-full rounded bg-gradient-to-br from-primary/20 to-accent/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 hidden rounded-lg border border-border/50 bg-card px-3 py-2 shadow-lg lg:block">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-foreground">AI Script Generated</span>
              </div>
            </div>
            <div className="absolute -right-4 bottom-1/4 hidden rounded-lg border border-border/50 bg-card px-3 py-2 shadow-lg lg:block">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-foreground">Ready in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
