import VerifiedMessage from "@/app/components/VerifiedMessage";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user.user_metadata?.name || user.email}!
      </h2>
      <VerifiedMessage />
    </div>
  );
}
