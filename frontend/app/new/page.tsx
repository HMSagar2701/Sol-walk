import { ModeToggle } from '@/components/mode-toggle';

export default function NewPage() {

  return (
    <div className="container mx-auto py-8">
      <ModeToggle />
      <h1 className="text-3xl font-bold">New Page</h1>
      <p className="mt-4">This page uses the theme system and not the landing page gradient.</p>
    </div>
  );
}