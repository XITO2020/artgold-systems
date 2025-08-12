"use client";

import React, { useRef, useEffect } from 'react';
import { Card } from "ù/card";
import {
  Shield,
  TrendingUp,
  Users,
  Banknote,
  Store,
  Factory
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@comp/theme/ThemeContext';
import { ThemeName } from 'T/theme/types';

interface FeaturesProps {
  dict: any;
  lang: string;
}
// Define theme variables interface
interface ThemeVars {
  [key: string]: {
    [key: string]: string;
  };
}

const themeVariables : ThemeVars = {
  'silver-berry': {
    '--accent': 'hsl(10, 100%, 77%)',
    '--accentOne': 'hsl(365, 92.6%, 47.5%)', /* hover: links nav */
    '--accentTwo': 'hsl(289, 92.6%, 27.5%)', /* hover: links nav */
    '--accentThree': 'hsl(9, 92.6%, 57.5%)', /* hover: links nav */
    '--accentFour': 'hsl(215, 92.6%, 77.5%)', /* hover: links nav */
    '--accent-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--destructive': 'hsl(0, 84.2%, 60.2%)',
    '--destructive-foreground': 'hsl(210, 40%, 98%)',
    '--border': 'hsl(214.3, 31.8%, 91.4%)',
    '--input': 'hsl(214.3, 31.8%, 91.4%)',
    '--ring': 'hsl(221.2, 83.2%, 53.3%)',
    '--radius': '0.5rem',
    '--classic': '#ffeb3b',
    '--covering': 'linear-gradient(180deg, lightpink, peachpuff, snow)',
    '--white': '#fff',
    '--sidebars': 'linear-gradient(snow, lightCoral)',
    '--sidetext': 'lightgrey',
    '--sidetext2': 'lightgrey',
    '--accent-hover': 'lightcyan',
    '--accentOne-hover': 'lavender',
    '--accentTwo-hover': 'peachpuff',
    '--accentThree-hover': 'lemonchiffon',
    '--accentFour-hover': 'palegreen',
    '--accentOneText-hover': 'black',
    '--accentTwoText-hover': 'black',
    '--accentThreeText-hover': 'black',
    '--accentFourText-hover': 'black',
  },
  'emerald': {
    '--background': 'linear-gradient(90deg, hsl(12, 8%, 0%) 25%, hsl(143, 93%, 8%) 40%, hsl(0, 0%, 0%) 50%, lemonchiffon 90%, snow)',
    '--foreground': 'hsl(150, 100%, 85%)',
    '--card': 'hsl(0, 0%, 0%)',
    '--card-foreground': 'hsl(150, 100%, 85%)',
    '--popover': 'hsl(0, 0%, 0%)',
    '--popover-foreground': 'hsl(150, 100%, 85%)',
    '--primary': 'hsl(280, 40%, 53.3%)',
    '--primary-foreground': 'hsl(210, 40%, 98%)',
    '--secondary': 'hsl(210, 40%, 96.1%)',
    '--secondary-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--muted': 'hsl(210, 40%, 96.1%)',
    '--muted-foreground': 'hsl(215.4, 16.3%, 46.9%)',
    '--accent': 'hsl(10, 100%, 77%)',
    '--accentOne': 'hsl(365, 92.6%, 47.5%)', /* hover: links nav */
    '--accentTwo': 'hsl(289, 92.6%, 27.5%)', /* hover: links nav */
    '--accentThree': 'hsl(9, 92.6%, 57.5%)', /* hover: links nav */
    '--accentFour': 'hsl(215, 92.6%, 77.5%)', /* hover: links nav */
    '--accent-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--destructive': 'hsl(0, 84.2%, 60.2%)',
    '--destructive-foreground': 'hsl(210, 40%, 98%)',
    '--border': 'hsl(214.3, 31.8%, 91.4%)',
    '--input': 'hsl(214.3, 31.8%, 91.4%)',
    '--ring': 'hsl(221.2, 83.2%, 53.3%)',
    '--radius': '0.5rem',
    '--classic': '#ffeb3b',
    '--covering': 'linear-gradient(180deg, lightpink, peachpuff, snow)',
    '--white': '#fff',
    '--sidebars': 'linear-gradient(snow, lightCoral)',
    '--sidetext': 'lightgrey',
    '--sidetext2': 'lightgrey',
    '--accent-hover': 'lightcyan',
    '--accentOne-hover': 'lavender',
    '--accentTwo-hover': 'peachpuff',
    '--accentThree-hover': 'lemonchiffon',
    '--accentFour-hover': 'palegreen',
    '--accentOneText-hover': 'black',
    '--accentTwoText-hover': 'black',
    '--accentThreeText-hover': 'black',
    '--accentFourText-hover': 'black',
  },
  'agua-sapphire': {
    '--background': 'linear-gradient(360deg, hsl(240, 80%, 16%) 0%, hsl(210, 100%, 32%) 25%, hsl(177, 92%, 79%) 50%, hsl(240, 100%, 97%) 75%, hsl(240, 100%, 97%) 100%)',
    '--foreground': 'hsl(199, 100%, 75%)',
    '--card': 'hsl(240, 80%, 16%)',
    '--card-foreground': 'hsl(212, 100%, 90%)',
    '--popover': 'hsl(225, 45%, 28%)',
    '--popover-foreground': 'hsl(245, 100%, 75%)',
    '--primary': 'hsl(199, 100%, 40%)',
    '--primary-foreground': 'hsl(225, 50%, 10%)',
    '--secondary': 'hsl(225, 40%, 20%)',
    '--secondary-foreground': 'hsl(199, 100%, 75%)',
    '--muted': 'hsl(225, 40%, 20%)',
    '--muted-foreground': 'hsl(160, 60%, 75%)',
    '--accent': 'hsl(199, 100%, 80%)',
    '--accentOne': 'hsl(365, 92.6%, 47.5%)', /* hover: links nav */
    '--accentTwo': 'hsl(289, 92.6%, 27.5%)', /* hover: links nav */
    '--accentThree': 'hsl(9, 92.6%, 57.5%)', /* hover: links nav */
    '--accentFour': 'hsl(215, 92.6%, 77.5%)', /* hover: links nav */
    '--accent-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--destructive': 'hsl(0, 62.8%, 30.6%)',
    '--destructive-foreground': 'hsl(210, 40%, 98%)',
    '--border': 'hsl(217.2, 32.6%, 17.5%)',
    '--input': 'hsl(217.2, 32.6%, 17.5%)',
    '--ring': 'hsl(224.3, 76.3%, 48%)',
    '--radius': '0.5rem',
    '--classic': '#ffeb3b',
    '--covering': 'linear-gradient(180deg, lightpink, peachpuff, snow)',
    '--white': '#fff',
    '--sidebars': 'linear-gradient(snow, lightCoral)',
    '--sidetext': 'lightgrey',
    '--sidetext2': 'lightgrey',
    '--accent-hover': 'lightcyan',
    '--accentOne-hover': 'lavender',
    '--accentTwo-hover': 'peachpuff',
    '--accentThree-hover': 'lemonchiffon',
    '--accentFour-hover': 'palegreen',
    '--accentOneText-hover': 'black',
    '--accentTwoText-hover': 'black',
    '--accentThreeText-hover': 'black',
    '--accentFourText-hover': 'black',
  },
  'chili-ruby': {
    '--background': 'linear-gradient(235deg, hsl(342.2, 84%, 19%) 0%, hsl(45, 100%, 89%) 50%, hsl(127, 100%, 94%) 100%)',
    '--foreground': 'hsl(210, 40%, 98%)',
    '--card': 'hsl(222.2, 84%, 4.9%)',
    '--card-foreground': 'hsl(210, 40%, 98%)',
    '--popover': 'hsl(222.2, 84%, 4.9%)',
    '--popover-foreground': 'hsl(210, 40%, 98%)',
    '--primary': 'hsl(217.2, 91.2%, 59.8%)',
    '--primary-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--secondary': 'hsl(217.2, 32.6%, 17.5%)',
    '--secondary-foreground': 'hsl(210, 40%, 98%)',
    '--muted': 'hsl(217.2, 32.6%, 17.5%)',
    '--muted-foreground': 'hsl(215, 20.2%, 65.1%)',
    '--accent': 'hsl(217.2, 32.6%, 17.5%)',
    '--accentOne': 'hsl(365, 92.6%, 47.5%)', /* hover: links nav */
    '--accentTwo': 'hsl(289, 92.6%, 27.5%)', /* hover: links nav */
    '--accentThree': 'hsl(9, 92.6%, 57.5%)', /* hover: links nav */
    '--accentFour': 'hsl(215, 92.6%, 77.5%)', /* hover: links nav */
    '--accent-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--destructive': 'hsl(217.2, 32.6%, 17.5%)',
    '--destructive-foreground': 'hsl(210, 40%, 98%)',
    '--border': 'hsl(217.2, 32.6%, 17.5%)',
    '--input': 'hsl(217.2, 32.6%, 17.5%)',
    '--ring': 'hsl(224.3, 76.3%, 48%)',
    '--radius': '0.5rem',
    '--classic': '#ffeb3b',
    '--covering': 'linear-gradient(180deg, lightpink, peachpuff, snow)',
    '--white': '#fff',
    '--sidebars': 'linear-gradient(snow, lightCoral)',
    '--sidetext': 'lightgrey',
    '--sidetext2': 'lightgrey',
    '--accent-hover': 'lightcyan',
    '--accentOne-hover': 'lavender',
    '--accentTwo-hover': 'peachpuff',
    '--accentThree-hover': 'lemonchiffon',
    '--accentFour-hover': 'palegreen',
    '--accentOneText-hover': 'black',
    '--accentTwoText-hover': 'black',
    '--accentThreeText-hover': 'black',
    '--accentFourText-hover': 'black',
  },
  'golden-tacos': {
    '--background': 'linear-gradient(222deg, hsl(210, 100%, 2%) 0%, hsl(69, 20%, 4%) 50%, hsl(47, 92%, 5%) 100%)',
    '--foreground': 'hsl(60, 100%, 50%)', /* petit texte typoe trending, illustration, all */
    '--card': 'linear-gradient(275deg, hsl(210, 100%, 2%) 0%, hsl(69, 20%, 4%) 100%)', /* fond des card */
    '--card-foreground': 'transparent',
    '--popover': 'hsl(0, 0%, 0%)',
    '--popover-foreground': 'hsl(45, 100%, 75%)',
    '--primary': 'hsl(63, 100%, 80%)', /* coins du logo, fond convertir votre art fond, convert submit button, dubbing add line, signin fond + signup text */
    '--primary-foreground': 'hsl(225, 50%, 10%)', /* sign in button text */
    '--secondary': 'hsl(35, 35%, 60%)', /* fond liens nav */
    '--secondary-foreground': 'hsl(45, 100%, 65%)',
    '--muted': 'hsl(225, 40%, 20%)',
    '--muted-foreground': 'hsl(45, 60%, 75%)',
    '--accent': 'hsl(45, 100%, 80%)', /* hover: liens nav, voir la trésosrie fond */
    '--accentOne': 'hsl(365, 92.6%, 47.5%)', /* hover: liens nav */
    '--accentTwo': 'hsl(289, 92.6%, 27.5%)', /* hover: liens nav */
    '--accentThree': 'hsl(9, 92.6%, 57.5%)', /* hover: liens nav */
    '--accentFour': 'hsl(215, 92.6%, 77.5%)', /* hover: liens nav */
    '--accent-foreground': 'hsl(225, 50%, 10%)',
    '--destructive': 'hsl(0, 100%, 40%)',
    '--destructive-foreground': 'hsl(45, 100%, 75%)',
    '--border': 'hsl(225, 40%, 25%)',
    '--input': 'hsl(225, 40%, 25%)',
    '--ring': 'hsl(45, 100%, 50%)',
    '--ghost': 'hsl(60, 95%, 85%)',
    '--classic': '#ffeb3b',
    '--covering': 'red',
    '--white': '#fff',
    '--sidebars': 'black',
    '--sidetext': 'lightgrey',
    '--sidetext2': 'lightgrey',
    '--accent-hover': 'lightcyan',
    '--accentOne-hover': 'lavender',
    '--accentTwo-hover': 'peachpuff',
    '--accentThree-hover': 'lemonchiffon',
    '--accentFour-hover': 'palegreen',
    '--accentOneText-hover': 'black',
    '--accentTwoText-hover': 'black',
    '--accentThreeText-hover': 'black',
    '--accentFourText-hover': 'black',
  },
  'dark': {
    '--background': 'linear-gradient(94deg, hsl(0, 0%, 0%) 0%, hsl(289, 100%, 9%) 50%, hsl(241, 100%, 12%) 100%)',
    '--foreground': 'hsl(240, 100%, 100%)',
    '--card': 'hsl(222.2, 84%, 4.9%)',
    '--card-foreground': 'hsl(210, 40%, 98%)',
    '--popover': 'hsl(222.2, 84%, 4.9%)',
    '--popover-foreground': 'hsl(210, 40%, 98%)',
    '--primary': 'hsl(245, 92.6%, 47.5%)',
    '--primary-foreground': 'hsl(222.2, 47.4%, 11.2%)',
    '--secondary': 'hsl(217.2, 32.6%, 17.5%)',
    '--secondary-foreground': 'hsl(210, 40%, 98%)',
    '--quadrary': 'hsl(190, 100%, 88%)',
    '--muted': 'hsl(217.2, 32.6%, 17.5%)',
    '--muted-foreground': 'hsl(303, 100%, 72%)',
    '--accent': 'hsl(245, 92.6%, 27.5%)', /* hover: liens nav */
    '--accentOne': 'hsl(365, 92.6%, 47.5%)', /* hover: liens nav */
    '--accentTwo': 'hsl(289, 92.6%, 27.5%)', /* hover: liens nav */
    '--accentThree': 'hsl(9, 92.6%, 57.5%)', /* hover: liens nav */
    '--accentFour': 'hsl(215, 92.6%, 77.5%)', /* hover: liens nav */
    '--accent-foreground': 'hsl(210, 40%, 98%)',
    '--destructive': 'hsl(0, 62.8%, 30.6%)',
    '--destructive-foreground': 'hsl(210, 40%, 98%)',
    '--border': 'hsl(217.2, 32.6%, 17.5%)',
    '--input': 'hsl(217.2, 32.6%, 17.5%)',
    '--ring': 'hsl(224.3, 76.3%, 48%)',
    '--radius': '0.5rem',
    '--classic': '#ffeb3b',
    '--covering': 'linear-gradient(#040008 45%, midnightblue)',
    '--white': '#fff',
    '--sidebars': 'black',
    '--sidetext': 'hsl(180, 100%, 65%)',
    '--sidetext2': 'hsl(52, 100%, 70%)',
    '--accent-hover': 'lightcyan',
    '--accentOne-hover': 'lavender',
    '--accentTwo-hover': 'peachpuff',
    '--accentThree-hover': 'lemonchiffon',
    '--accentFour-hover': 'palegreen',
    '--accentOneText-hover': 'black',
    '--accentTwoText-hover': 'black',
    '--accentThreeText-hover': 'black',
    '--accentFourText-hover': 'black',
  }
};

const Features: React.FC<FeaturesProps> = ({ dict, lang }) => {
  const { theme } = useTheme();
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bgRef.current) {
      const themeName = typeof theme === 'string' ? theme : theme.toLowerCase();
      const vars = themeVariables[themeName];
      if (vars) {
        Object.entries(vars).forEach(([key, value]) => {
          bgRef.current?.style.setProperty(key, value);
        });
      }
    }
  }, [theme]);

  return (
    <section className="py-20 bg-muted/50" ref={bgRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--classic)" }}>
          {dict.home.features.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 mb-2">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{dict.home.features.validation.title}</h3>
            <p className="text-muted-foreground">
              {dict.home.features.validation.description}
            </p>
          </Card>
          <Card className="p-6 mb-2">
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{dict.home.features.growth.title}</h3>
            <p className="text-muted-foreground">
              {dict.home.features.growth.description}
            </p>
          </Card>
          <Card className="p-6">
            <div className="mb-4">
              <Users className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{dict.home.features.distribution.title}</h3>
            <p className="text-muted-foreground">
              {dict.home.features.distribution.description}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Banknote className="h-12 w-12 text-lime-500" />
              <h3 className="text-xl font-semibold mb-2">
                {dict.home.features.details.title}
              </h3>
            </div>
            <div className="flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-amber-300">{dict.home.features.details.exp1}</p>
              <p className="text-teal-300">{dict.home.features.details.exp2}</p>
              <p className="text-violet-300">{dict.home.features.details.exp3}</p>
              <p className="text-fuchsia-300">{dict.home.features.details.exp4}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center">
              <Store className="h-12 w-12 mb-2 text-pink-400" />
              <h3 className="text-xl font-semibold mb-2">
                {dict.home.features.financing.title}
              </h3>
            </div>
            <div className="flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-amber-300">{dict.home.features.financing.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <Link href={`/${lang}/shop`}>
                  <img src="/icons/tbcity.png" height="30" alt="tabascocity" />
                  <p>Opérer depuis ce site</p>
                </Link>
                <Link href="www.tshirts.land">
                  <img src="/icons/tshirtsland.png" height="30" alt="tabascocity" />
                  <p>Visiter Tshirts.land</p>
                </Link>
              </div>
              <p className="text-teal-300">{dict.home.features.financing.exp2}</p>
              <p className="text-violet-300">{dict.home.features.financing.exp3}</p>
              <p className="text-fuchsia-300">{dict.home.features.financing.exp4}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center">
              <Factory className="h-12 w-12 mb-2 text-amber-500" />
              <h3 className="text-xl font-semibold mb-2">
                {dict.home.features.financing.title}
              </h3>
            </div>
            <div className="flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-amber-300">{dict.home.features.financing.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <Link href={`/${lang}/shop`}>
                  <img src="/icons/shonen-detoured.png" height="30" alt="Shonen Industries" />
                  <p>Postez vos créations et esquisses Manga / Manwha</p>
                </Link>
                
              </div>
              <p className="text-teal-300">{dict.home.features.financing.exp2}</p>
              <p className="text-violet-300">{dict.home.features.financing.exp3}</p>
              <p className="text-fuchsia-300">{dict.home.features.financing.exp4}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
