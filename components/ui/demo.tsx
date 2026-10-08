"use client"

import * as React from "react"
import { Navbar1 } from "@/components/ui/navbar-1"
import { AppleSpotlight } from "@/components/ui/apple-spotlight"
import {
  Bell,
  FileText,
  HelpCircle,
  Home,
  Lock,
  Mail,
  Settings,
  Shield,
  User,
} from "lucide-react"

import ExpandedTabs from "@/components/ui/expanded-tabs"
import { Feature } from "@/components/ui/feature-section-with-bento-grid"

export default function DemoOne() {
  return <AppleSpotlight />
}

const Demo = () => {
  return (
    <>
      <Navbar1 />
    </>
  )
}

export { Demo }

export function FeatureDemo() {
  return (
    <div className="w-full">
      <Feature />
    </div>
  )
}

export function DefaultDemo() {
  const tabs = [
    { title: "Dashboard", icon: Home },
    { title: "Notifications", icon: Bell },
    { type: "separator" as const },
    { title: "Settings", icon: Settings },
    { title: "Support", icon: HelpCircle },
    { title: "Security", icon: Shield },
  ]

  return (
    <div className="flex items-center justify-center">
      <ExpandedTabs tabs={tabs} />
    </div>
  )
}

export function CustomColorDemo() {
  const tabs = [
    { title: "Profile", icon: User },
    { title: "Messages", icon: Mail },
    { type: "separator" as const },
    { title: "Documents", icon: FileText },
    { title: "Privacy", icon: Lock },
  ]

  return (
    <div className="flex flex-col gap-4">
      <ExpandedTabs
        tabs={tabs}
        activeColor="text-blue-500"
        className="border-blue-200 dark:border-blue-800"
      />
    </div>
  )
}
