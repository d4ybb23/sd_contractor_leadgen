"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Video, 
  LayoutDashboard, 
  Film, 
  FolderOpen, 
  Settings,
  PlusCircle,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Videos", href: "/dashboard/videos", icon: Film },
  { name: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-border/50 bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Video className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">ContentReel</span>
      </div>

      <div className="p-4">
        <Button asChild className="w-full gap-2">
          <Link href="/dashboard/create">
            <PlusCircle className="h-4 w-4" />
            Create Video
          </Link>
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-sidebar-foreground">Free Plan</span>
          </div>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            3 of 5 videos used this month
          </p>
          <Button variant="secondary" size="sm" className="mt-3 w-full">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </aside>
  )
}
