"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname.includes("/dashboard/statistik")) return "Statistik Desa"
  if (pathname.includes("/dashboard/informasi-desa/tambah")) return "Tambah Informasi Desa"
  if (pathname.includes("/dashboard/informasi-desa") && pathname.includes("/edit")) return "Edit Informasi Desa"
  if (pathname.includes("/dashboard/informasi-desa")) return "Informasi Desa"
  
  // Fallback for other paths
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 1) {
    const lastSegment = segments[1]
    return lastSegment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }
  
  return "Dashboard"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) px-4 lg:px-6">
      <div className="flex items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold leading-none">Administrator Desa</span>
          <span className="text-[10px] uppercase text-blue-500 font-bold tracking-widest mt-1">ADMINISTRATOR</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/admin.jpg" />
          <AvatarFallback className="bg-blue-600 text-white text-xs">A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
