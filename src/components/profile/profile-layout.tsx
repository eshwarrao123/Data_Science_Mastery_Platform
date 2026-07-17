"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileNav } from "@/components/profile/profile-nav";

/**
 * Shared chrome for every /profile/* page: app sidebar, profile header
 * and the tab-style section navigation. Pages render only their section
 * content into `children`.
 */
export function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 max-w-4xl">
        <ProfileHeader />
        <div className="flex flex-col gap-4">
          <ProfileNav />
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
}
