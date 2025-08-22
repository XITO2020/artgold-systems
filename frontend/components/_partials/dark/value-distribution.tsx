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

export const ValueDistribution = ({ dict, lang }: ValueDistributionProps) => {
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


  return (
    <div className="mx-8 space-y-8 my-12">
      {/* Distribution des valeurs */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-8">{dict.home.value.title}</h3>
        <div className="space-y-6 mb-8">
          <div>
            <div className="flex justify-between mb-8">
              <span className="font-medium">{dict.home.value.royalties}</span>
              <span className="text-muted-foreground">10%</span>
            </div>
            <Progress value={10} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {dict.home.value.exp1}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-8">
              <span className="font-medium">{dict.home.value.own}</span>
              <span className="text-muted-foreground">80%</span>
            </div>
            <Progress value={80} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              {dict.home.value.exp2}
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-8">
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
};

export default ValueDistribution;
