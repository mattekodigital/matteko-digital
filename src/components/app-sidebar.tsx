"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BarChartIcon,
  InfoIcon,
  LogOutIcon,
  LandmarkIcon,
  LoaderIcon,
  MapPinIcon,
  XIcon,
} from "lucide-react"
import { logoutAction } from "@/app/login/_actions/login"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Statistik Dusun",
      url: "/dashboard/statistik",
      icon: <BarChartIcon />,
    },
    {
      title: "Profil Dusun",
      url: "/dashboard/profil-dusun",
      icon: <MapPinIcon />,
    },
    {
      title: "Informasi Dusun",
      url: "/dashboard/informasi-desa",
      icon: <InfoIcon />,
    },
  ],
}

// ─── Mobile-aware header with close button ────────────────────────────────────
function SidebarHeaderContent() {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 mt-2">
          {/* Logo + name link — takes all remaining space */}
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:p-1.5! flex-1 min-w-0"
          >
            <Link href="/dashboard">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0">
                <LandmarkIcon className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2 min-w-0">
                <span className="truncate font-bold text-base">ADMIN</span>
                <span className="truncate text-[10px] text-muted-foreground uppercase tracking-widest">
                  Panel Dusun Matteko
                </span>
              </div>
            </Link>
          </SidebarMenuButton>

          {/* Close button — only visible on mobile */}
          {isMobile && (
            <button
              onClick={() => setOpenMobile(false)}
              className="shrink-0 flex items-center justify-center size-8 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              aria-label="Tutup menu"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// ─── Main sidebar component ───────────────────────────────────────────────────
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    await logoutAction()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      variant="inset"
      style={{ "--sidebar": "#0f172a" } as React.CSSProperties}
      {...props}
    >
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              id="logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <LogOutIcon className="size-4" />
              )}
              <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
