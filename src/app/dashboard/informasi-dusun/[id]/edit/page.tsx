import { notFound } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getInformasiById } from "@/lib/data/informasi"
import InformasiDesaForm from "../../_components/InformasiDesaForm"

export default async function EditInformasiDesaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getInformasiById(id)

  if (!item) {
    notFound()
  }

  return (
    <SidebarProvider
      className="dashboard-sidebar"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-[#0f172a] text-white">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6">
          <InformasiDesaForm mode="edit" initialData={item} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
