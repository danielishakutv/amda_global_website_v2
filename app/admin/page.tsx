import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Restricted content management for AMDA Global Solutions.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
