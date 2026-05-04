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
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BarChartIcon,
  InfoIcon,
  LogOutIcon,
  LandmarkIcon,
  LoaderIcon,
  MapPinIcon,
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
      title: "Statistik Desa",
      url: "/dashboard/statistik",
      icon: <BarChartIcon />,
    },
    {
      title: "Profil Dusun",
      url: "/dashboard/profil-dusun",
      icon: <MapPinIcon />,
    },
    {
      title: "Informasi Desa",
      url: "/dashboard/informasi-desa",
      icon: <InfoIcon />,
    },
  ],
}

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! mt-2"
            >
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                  <LandmarkIcon className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-bold text-base">ADMIN</span>
                  <span className="truncate text-[10px] text-muted-foreground uppercase tracking-widest">
                    Panel Desa Matteko
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
