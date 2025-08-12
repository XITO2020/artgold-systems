import React from 'react';
import { Button } from "ù/button";
import Link from 'next/link';
import { useTheme } from "@comp/theme/ThemeContext"; // Assurez-vous d'importer le bon hook

interface HeroProps {
  dict: any;
  lang: string;
}

const Hero: React.FC<HeroProps> = ({ dict, lang }) => {
  const { theme } = useTheme();

  const gradientClass = "bg-gradient-to-r from-fuchsia-600 via-red-600 to-amber-500";

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className={`text-5xl font-bold mb-6 ${gradientClass} bg-clip-text text-transparent`}>
          {dict.home.hero.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {dict.home.hero.description}
        </p>
        <div className="flex justify-center gap-4">
          <Link href={`/${lang}/upload`}>
            <Button size="lg" className="text-lg transition-button text-red-700">
              {dict.home.cta.convert}
            </Button>
          </Link>
          <Link href={`/${lang}/explore`}>
            <Button size="lg" variant="destructive" className="transition-button smoothButton text-lg bg-red-700 hover:bg-grey-700 hover:bg-opacity-100 hover:text-grey-700">
              {dict.home.cta.explore}
            </Button>
          </Link>
        </div>
        <p className="text-xl text-muted-foreground mt-8 max-w-2xl mx-auto">
          {dict.home.hero.detail}
        </p>
      </div>
    </section>
  );
};

export default Hero;
