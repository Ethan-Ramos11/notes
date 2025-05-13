import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-b-foreground/10 h-16 flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Notes
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium">
              Hey, {user.user_metadata?.name || user.email}!
            </span>
            <form action="/sign-out" method="post">
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
