import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import Link from "next/link"
import { Film, FolderOpen, Clock, TrendingUp, PlusCircle, Video } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6)

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  const stats = [
    { name: "Total Videos", value: videos?.length || 0, icon: Film, change: "+12%" },
    { name: "Active Projects", value: projects?.length || 0, icon: FolderOpen, change: "+3%" },
    { name: "Hours Saved", value: ((videos?.length || 0) * 2).toString(), icon: Clock, change: "+24%" },
    { name: "Views", value: "1.2K", icon: TrendingUp, change: "+18%" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here&apos;s your content overview.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/create">
            <PlusCircle className="h-4 w-4" />
            Create Video
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-primary">{stat.change}</span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Videos */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Recent Videos</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/videos">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {videos && videos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                    <p className="truncate text-sm font-medium text-foreground">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon={<Film className="h-10 w-10" />}
              title="No videos yet"
              description="Create your first AI-powered video in minutes"
              action={
                <Button asChild>
                  <Link href="/dashboard/create">Create Video</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card transition-colors hover:border-primary/50">
          <Link href="/dashboard/create">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Create New Video</p>
                <p className="text-sm text-muted-foreground">Generate from keyword</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="border-border/50 bg-card transition-colors hover:border-primary/50">
          <Link href="/dashboard/projects">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <FolderOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">Browse Projects</p>
                <p className="text-sm text-muted-foreground">Manage your content</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="border-border/50 bg-card transition-colors hover:border-primary/50">
          <Link href="/dashboard/videos">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Film className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="font-medium text-foreground">Video Library</p>
                <p className="text-sm text-muted-foreground">All your videos</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
