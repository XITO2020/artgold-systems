"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@ui/card";
import { Progress } from "@ui/progress";
import { Coins, Lock, TrendingUp } from "lucide-react";
import { useTheme } from "../../theme/ThemeContext";

interface ValueDistributionProps {
  dict: any; // Remplacez "any" par le type correct si disponible
  lang: string;
}

export function ValueDistribution({ dict, lang }: ValueDistributionProps) {
  // Gestion de l'animation GIF au défilement
  const [gifVisible, setGifVisible] = useState(false);
  const gifRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();


  useEffect(() => {
    if (!gifRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGifVisible(true);
        }
      },
      {
        threshold: 0.2, // Seuil ajusté pour détecter plus facilement
      }
    );

    observer.observe(gifRef.current);

    return () => observer.disconnect();
  }, []);

  if (!dict.home || !dict.home.validation || !dict.home.validation.token || !dict.home.validation.market) {
    return <div>Loading...</div>;
  }

  const themeVars = {
    'silver-berry': {
      '--accent': 'hsl(10, 100%, 94%)',
      '--accentOne': 'hsl(10, 100%, 94%)',
      '--accentTwo': 'hsl(10, 100%, 94%)',
      '--accentThree': 'hsl(10, 100%, 94%)',
      '--accentFour': 'hsl(10, 100%, 94%)',
      '--accent-foreground': 'hsl(10, 90%, 60%',
      '--accent-hover': 'hsl(10, 100%, 77%)',
      '--accentText-hover': 'hsl(10, 10%, 10%)',
      '--accentOne-hover': 'lightpink',
      '--accentTwo-hover': 'peachpuff',
      '--accentThree-hover': 'lemonchiffon',
      '--accentFour-hover': 'crimson',
    },
    'emerald': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': 'hsl(138, 100%, 70%)',
      '--accent-hover': 'hsl(168, 60%, 2%)',
      '--accentText-hover': 'hsl(168, 100%, 80%)',
      '--accentOne-hover': 'hsl(168, 60%, 2%)',
      '--accentTwo-hover': 'hsl(168, 60%, 2%)',
      '--accentThree-hover': 'hsl(168, 60%, 2%)',
      '--accentFour-hover': 'hsl(168, 60%, 2%)',
    },
    'chili-ruby': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': 'hsl(0, 0%, 100%)',
      '--accent-hover': '#D41C5A',
      '--accentText-hover': '#92044E',
      '--accentOne-hover': '#FAE85C',
      '--accentTwo-hover': 'orange',
      '--accentThree-hover': '#45A474',
      '--accentFour-hover': '#AB105D',
    },
    'agua-saphir': {
      '--accent': '#78c0e0',
      '--accentOne': '#449dd1',
      '--accentTwo': '#27B2DF',
      '--accentThree': '#10A8EE',
      '--accentFour': '#2248AE',
      '--accent-foreground': 'hsl(0, 0%, 100%)',
      '--accent-hover': '#150578',
      '--accentText-hover': 'hsl(200, 100%, 40%)',
      '--accentOne-hover': '#150578',
      '--accentTwo-hover': '#0e0e52',
      '--accentThree-hover': '#0e0e52',
      '--accentFour-hover': '#88d0fc',
    },
    'golden-tacos': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': '#D2B48C',
      '--accent-hover': '#D2B48C',
      '--accentText-hover': 'black',
      '--accentOne-hover': '#FCD700',
      '--accentTwo-hover': '#FF6347',
      '--accentThree-hover': '#27AB23',
      '--accentFour-hover': '#A5260A',
    },
    'dark': {
      '--accent': 'transparent',
      '--accentOne': 'transparent',
      '--accentTwo': 'transparent',
      '--accentThree': 'transparent',
      '--accentFour': 'transparent',
      '--accent-foreground': 'hsl(188, 45%, 77%)',
      '--accent-hover': '#ffff77',
      '--accentText-hover': 'black',
      '--accentOne-hover': 'hotpink',
      '--accentTwo-hover': 'aqua',
      '--accentThree-hover': 'lime',
      '--accentFour-hover': 'mediumvioletred',
    },
    'diamond-pastel': {
      '--accent': 'lavender',
      '--accentOne': '#FFEAF6',
      '--accentTwo': '#FFF2EA',
      '--accentThree': 'lemonchiffon',
      '--accentFour': '#E1FFF5',
      '--accent-foreground': 'hsl(308, 55%, 40%)',
      '--accent-hover': '#E6DAFF',
      '--accentText-hover': '#4C4C4C',
      '--accentOne-hover': 'lightpink',
      '--accentTwo-hover': 'peachpuff',
      '--accentThree-hover': '#FFFEB9',
      '--accentFour-hover': 'palegreen',
    },
    'light': {
      '--accent': 'lightCoral',
      '--accentOne': 'Coral',
      '--accentTwo': 'salmon',
      '--accentThree': 'tomato',
      '--accentFour': 'crimson',
      '--accent-foreground': 'hsl(308, 55%, 94%)',
      '--accent-hover': 'maroon',
      '--accentText-hover': 'black',
      '--accentOne-hover': 'limegreen',
      '--accentTwo-hover': 'yellowgreen',
      '--accentThree-hover': 'red',
      '--accentFour-hover': 'springgreen',
    }
  };

  return (
    <div className="space-y-8">
      {/* Distribution des valeurs */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{dict.home.value.title}</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{dict.home.value.royalties}</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {dict.home.value.exp1}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{dict.home.value.own}</span>
              <span className="text-muted-foreground">80%</span>
            </div>
            <Progress value={80} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {dict.home.value.exp2}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">{dict.home.value.shares}</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {dict.home.value.exp3}
            </p>
          </div>
        </div>
      </Card>

      {/* Système de tokens */}
      <Card className="p-6">
        <div className="flex">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">{dict.home.validation.token.title}</h3>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">TABZ Token (Gold-Backed)</h4>
                <p>{dict.home.validation.token["p-intro"]}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {dict.home.validation.token["li-1"]}</li>
                  <li>• {dict.home.validation.token["li-2"]}</li>
                  <li>• {dict.home.validation.token["li-3"]}</li>
                  <li>• {dict.home.validation.token["li-4"]}</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gray-100">
                <TrendingUp className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">AGT Token (Silver-Backed)</h4>
                <p>{dict.home.validation.token["p-intro2"]}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {dict.home.validation.token["li-5"]}</li>
                  <li>• {dict.home.validation.token["li-6"]}</li>
                  <li>• {dict.home.validation.token["li-7"]}</li>
                  <li>• {dict.home.validation.token["li-8"]}</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">1 to 3 -Years Lockup Period</h4>
                <p>{dict.home.validation.token["p-intro3"]}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {dict.home.validation.token["li-9"]}</li>
                  <li>• {dict.home.validation.token["li-10"]}</li>
                  <li>• {dict.home.validation.token["li-11"]}</li>
                  <li>• {dict.home.validation.token["li-12"]}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GIF visible uniquement lorsqu'il est dans la fenêtre */}
          <div className="flex flex-col items-center justify-between w-[40%] mx-auto text-center">
            <h2 className="font-semibold mb-2">{dict.home.introducing.catchphrase1}</h2>
            <div ref={gifRef}>
              {gifVisible ? (
                <img
                  className="my-2 rounded-lg"
                  src="/icons/welcome.gif"
                  alt="Welcome GIF"
                  width="720"
                  height="400"
                />
              ) : (
                <div
                  className="my-2 rounded-lg w-[600px] h-[auto] bg-gray-200"
                  aria-label="Placeholder for welcome GIF"
                />
              )}
            </div>
            <h3>{dict.home.introducing.catchphrase2}</h3>
            <p className="font-semibold mb-2">{dict.home.specifications}</p>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{dict.home.validation.market.entry}</h3>
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-accentThree-hover text-accentText-hover">
                  {dict.home.validation.market.ph1}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-accentTwo-hover">
                  {dict.home.validation.market.duration}
                </span>
              </div>
            </div>
            <Progress value={25} className="h-2 bg-accentFour" />
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-accentOne-hover text-accenttext-hover">
                  {dict.home.validation.market.ph2}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-accentText">
                  {dict.home.validation.market.echeance1}
                </span>
              </div>
            </div>
            <Progress value={50} className="h-2 bg-accentThree" />
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-accentFour text-amber-300">
                  {dict.home.validation.market.ph3}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold inline-block text-accent">
                  {dict.home.validation.market.echeance2}
                </span>
              </div>
            </div>
            <Progress value={80} className="h-2 bg-accentTwo" />
          </div>
        </div>
      </Card>
    </div>
  );
}
