import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@ui/button";
import { useTheme } from "@comp/theme/ThemeContext";
import styles from "./africa.module.scss";

// Create a button that handles navigation
const NavButton = ({
  href,
  children,
  variant = 'default',
  size = 'default',
  className = ''
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}) => {
  const router = useRouter();
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => router.push(href)}
    >
      {children}
    </Button>
  );
};

interface HeroProps {
  dict: any;
  lang: string;
}

const Hero: React.FC<HeroProps> = ({ dict, lang }) => {
  const { theme } = useTheme();

  const gradientClass = (() => {
    switch (theme) {
      case "dark":
        return "bg-gradient-to-r from-cyan-700 to-yellow-200";
      case "silver-berry":
        return "bg-gradient-to-r from-fuchsia-600 via-red-600 to-amber-500";
      case "golden-tacos":
        return "bg-gradient-to-r from-stone-400 via-amber-700 to-yellow-300";
      case "agua-saphir":
        return "bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-300";
      case "chili-ruby":
        return "bg-gradient-to-r from-fuchsia-700 via-red-600 to-yellow-200";
      case "emerald":
        return "bg-gradient-to-r from-green-400 via-teal-600 to-white";
      case "diamond-pastel":
        return "bg-gradient-to-r from-slate-500 via-purple-500 to-yellow-200";
      case "light":
        return "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500";
      default:
        return "bg-gradient-to-r from-yellow-400 to-amber-700";
    }
  })();

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
          <NavButton 
            href={`/${lang}/upload`}
            size="lg" 
            className="text-lg hover:bg-yellow-100"
          >
            {dict.home.cta.convert}
          </NavButton>
          <NavButton 
            href={`/${lang}/explore`}
            size="lg" 
            variant="outline" 
            className="text-lg"
          >
            {dict.home.cta.explore}
          </NavButton>
        </div>
        <p className="text-xl text-muted-foreground mt-8 max-w-2xl mx-auto">
          {dict.home.hero.detail}
        </p>
      </div>
    </section>
  );
};

export default Hero;
