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
import { useTheme } from '../../theme/ThemeContext';

interface FeaturesProps {
  dict: any;
  lang: string;
}

const Features: React.FC<FeaturesProps> = ({ dict, lang }) => {
  const { theme } = useTheme();
  const bgRef = useRef(null);

  const themeVars = {
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

  // Define themeVarsMap separately to avoid recursive reference
  const themeVarsMap: Record<string, Record<string, string>> = {
    'dark': darkThemeVars,
    'light': lightThemeVars
  };

  useEffect(() => {
    if (bgRef.current) {
      const themeName = theme.toLowerCase();
      const currentThemeVars = themeVarsMap[themeName] || darkThemeVars;
      Object.keys(currentThemeVars).forEach(key => {
        bgRef.current?.style.setProperty(key, currentThemeVars[key]);
      });
    }
  }, [theme]);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--classic)" }}>
          {dict.home.features.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 mb-2">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{dict.home.features.validation.title}</h3>
            <p className="text-2xl text-muted-foreground text-yellow-200">
              {dict.home.features.validation.description} 
            </p>
            <p className="text-2xl text-muted-foreground text-yellow-300">
               {dict.home.features.validation.description2}</p>
          </Card>
          <Card className="p-6 mb-2">
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-teal-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{dict.home.features.growth.title}</h3>
            <p className="text-2xl text-muted-foreground text-sky-300 mb-2">
              {dict.home.features.growth.description}
            </p>
            <p className="text-2xl text-muted-foreground text-teal-300">
              {dict.home.features.growth.description2}
            </p>
          </Card>
          <Card className="p-6">
            <div className="mb-4">
              <Users className="h-12 w-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{dict.home.features.distribution.title}</h3>
            <p className="text-2xl text-muted-foreground text-emerald-300 mb-2">
              {dict.home.features.distribution.description}
            </p>
            <p className="text-2xl text-muted-foreground text-emerald-300">
              {dict.home.features.distribution.description2}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Banknote className="h-12 w-12 text-lime-500" />
              <h3 className="text-2xl font-semibold mb-2">
                {dict.home.features.details.title}
              </h3>
            </div>
            <div className="text-2xl flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-lime-200 mb-1">{dict.home.features.details.exp1}</p>
              <p className="text-yellow-200 mb-1">{dict.home.features.details.exp2}</p>
              <p className="text-amber-200 mb-1">{dict.home.features.details.exp3}</p>
              <p className="text-cyan-300">{dict.home.features.details.exp4}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <Store className="h-12 w-12 mb-2 text-pink-400" />
              <h3 className="text-2xl  font-semibold mb-2">
                {dict.home.features.financing.title}
              </h3>
            </div>
            <div className="text-2xl flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-white">{dict.home.features.financing.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <Link href={`/${lang}/shop`}
                className="h-[120px]">
                  <img src="/icons/tbcity.png" width="160" alt="tabascocity" />
                  <p>Opérer depuis ces sites</p>
                </Link>
                <Link href="www.tshirts.land" className="mx-auto h-[120px] text-center">
                  <img src="/icons/tshirtsland.png" width="100" alt="tshirtland" />
                  
                </Link>
              </div>
              <p className="mb-2 text-rose-200 text-center">{dict.home.features.financing.exp2}</p>
              <p className="mb-2 text-purple-200 text-center">{dict.home.features.financing.exp3}</p>
              <p className="text-violet-200 text-center">{dict.home.features.financing.exp4}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center">
              <Factory className="h-12 w-12 mb-2 text-amber-500" />
              <h3 className="text-2xl  font-semibold mb-2">
                {dict.home.features.industries.title}
              </h3>
            </div>
            <div className="text-2xl flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-white mb-2">{dict.home.features.industries.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <Link href={`/${lang}/shop`}>
                  <img src="/icons/shonen-detoured.png" width="160" alt="Shonen Industries"
                  />
                </Link>
              </div>
              <p className="mb-2 text-amber-500">{dict.home.features.industries.exp2}</p>
              <p className="mb-2 text-amber-400">{dict.home.features.industries.exp3}</p>
              <p className="mb-2 text-amber-300">{dict.home.features.industries.exp4}</p>
            </div>
          </Card>
        </div>
      </div>
      <h2 className="text-center w-full mt-2 text-3xl font-neontitle text-yellow-200">{dict.home.nogen}</h2>
    </section>
  );
};

export default Features;
