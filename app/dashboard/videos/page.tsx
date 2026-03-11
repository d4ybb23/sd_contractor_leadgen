import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Empty } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Film, PlusCircle, MoreVertical, Download, Share2, Trash2, Video } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function VideosPage() {
  const supabase = await createClient()
  
  const { data: videos } = await supabase
    .from("videos")
    .select("*, projects(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Videos</h1>
          <p className="mt-1 text-muted-foreground">All your generated videos in one place</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/create">
            <PlusCircle className="h-4 w-4" />
            Create Video
          </Link>
        </Button>
      </div>

      {videos && videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="group overflow-hidden border-border/50 bg-card">
              <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="absolute right-2 top-2">
                  <Badge 
                    variant={video.status === "completed" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {video.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground">{video.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {video.format} &bull; {video.duration || "0:00"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Publish
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50 bg-card">
          <CardContent className="py-12">
            <Empty
              icon={<Film className="h-12 w-12" />}
              title="No videos yet"
              description="Create your first AI-powered video in minutes. Enter a keyword and let our AI do the rest."
              action={
                <Button asChild>
                  <Link href="/dashboard/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Video
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
