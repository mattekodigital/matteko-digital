"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import type { ProfilDusun } from "@/lib/types"

const HIDDEN_LAYOUT_PATHS = ["/dashboard", "/login"]

export default function ConditionalLayout({ 
  children,
  profil 
}: { 
  children: React.ReactNode;
  profil?: ProfilDusun;
}) {
  const pathname = usePathname()

  const hideLayout = HIDDEN_LAYOUT_PATHS.some((path) => pathname.startsWith(path))

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar profil={profil} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer profil={profil} />
    </>
  )
}
