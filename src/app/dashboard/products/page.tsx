import { redirect } from "next/navigation";

/** Setup is a single page now. */
export default function Page() {
  redirect("/dashboard");
}
