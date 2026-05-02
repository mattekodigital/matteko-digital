"use client"

import React, { useState } from "react"
import { MapIcon, BarChart2Icon } from "lucide-react"
import type { InfoWilayah, DataStatistik } from "@/lib/types"
import InfoWilayahForm from "./InfoWilayahForm"
import DataStatistikManager from "./DataStatistikManager"

interface Props {
  initialWilayah: InfoWilayah | null
  initialStatistik: DataStatistik[]
}

export default function StatistikTabs({ initialWilayah, initialStatistik }: Props) {
  const [activeTab, setActiveTab] = useState<"wilayah" | "statistik">("wilayah")

  const tabs = [
    { id: "wilayah" as const, label: "Informasi Wilayah", icon: MapIcon },
    { id: "statistik" as const, label: "Data Statistik", icon: BarChart2Icon },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "wilayah" ? (
        <InfoWilayahForm initialData={initialWilayah} />
      ) : (
        <DataStatistikManager initialData={initialStatistik} />
      )}
    </div>
  )
}
