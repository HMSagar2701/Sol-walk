"use client";
import { ModeToggle } from "@/components/mode-toggle";
// import { Button } from "@/components/ui/button";
// import { getGroupChallenges } from "@/lib/api";

export default function NewPage() {
  return (
    <div className="container mx-auto py-8">
      <ModeToggle />
      <h1 className="text-3xl font-bold">New Page</h1>
      <p className="mt-4">
        This page uses the theme system and not the landing page gradient.
      </p>

      {/* <Button onClick={() => getGroupChallenges()}>Get</Button> */}
    </div>
  );
}
