import { createFileRoute } from "@tanstack/react-router";
import { HeroFilm } from "@/components/hero-film";
import { Storefront } from "@/components/storefront";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <HeroFilm />
      <Storefront />
    </main>
  );
}
