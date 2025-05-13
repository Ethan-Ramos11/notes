import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewNoteForm from "./components/NewNoteForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <h1 className="text-4xl font-bold">Welcome to Notes</h1>
      <p className="text-lg text-muted-foreground text-center max-w-md">
        A simple and elegant way to organize your thoughts and ideas.
      </p>
      <Button asChild size="lg">
        <Link href="/protected">Get Started</Link>
      </Button>
      <NewNoteForm />
    </div>
  );
}
