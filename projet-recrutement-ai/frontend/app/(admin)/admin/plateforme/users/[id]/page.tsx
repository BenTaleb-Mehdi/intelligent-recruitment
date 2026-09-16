import { redirect } from "next/navigation";

export default function LegacyUserDetailPage() {
  redirect("/admin/users");
}
