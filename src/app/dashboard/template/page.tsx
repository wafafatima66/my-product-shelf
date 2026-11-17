import { redirect } from "next/navigation";

/** Templates are chosen on the main dashboard page now. */
export default function Page() {
  redirect("/dashboard");
}
