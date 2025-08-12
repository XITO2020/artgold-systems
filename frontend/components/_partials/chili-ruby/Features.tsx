"use client";

import React from 'react';
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

interface FeaturesProps {
  dict: any;
  lang: string;
}

const Features: React.FC<FeaturesProps> = ({ dict, lang }) => {
  return (
    <section className="py-20 bg-muted/50 bg-gradient-to-r from-fuchsia-900 via-amber-700 to-red-600">
      <div className="container mx-auto p-8 ">
        <h2 className="text-3xl font-bold text-center mb-12 text-muted-foreground ruby-title">
          {dict.home.features.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 mb-2" style={{background:"#0c0008;"}}>
            <div className="mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 ruby-title">{dict.home.features.validation.title}</h3>
            <p className="text-muted-foreground ruby-text">
              {dict.home.features.validation.description}
            </p><p className="text-amber-300">
              {dict.home.features.validation.description2}
            </p>
          </Card>
          <Card className="p-6 mb-2" style={{background:"#0c0008;"}}>
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-fuchsia-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 ruby-title">{dict.home.features.growth.title}</h3>
            <p className="text-muted-foreground ruby-text">
              {dict.home.features.growth.description}
            </p>
            <p className="text-muted-foreground ruby-text">
              {dict.home.features.growth.description2}
            </p>
          </Card>
          <Card className="p-6" style={{background:"#0c0008;"}}>
            <div className="mb-4">
              <Users className="h-12 w-12" style={{color:"#4EB87B"}} />
            </div>
            <h3 className="text-xl font-semibold mb-2 ruby-title">{dict.home.features.distribution.title}</h3>
            <p className="text-muted-foreground ruby-text">
              {dict.home.features.distribution.description}
            </p>
            <p className="text-muted-foreground ruby-text">
              {dict.home.features.distribution.description2}
            </p>
          </Card>
          <Card className="p-6" style={{background:"#0c0008;"}}>
            <div className="flex flex-col items-center justify-center text-center">
              <Banknote className="h-12 w-12" style={{color:"#4EB87B"}} />
              <h3 className="text-xl font-semibold mb-2 ruby-title">
                {dict.home.features.details.title}
              </h3>
            </div>
            <div className="flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="ruby-text">{dict.home.features.details.exp1}</p>
              <p className="ruby-text">{dict.home.features.details.exp2}</p>
              <p className="ruby-text" style={{color:"#4EB87B"}}>{dict.home.features.details.exp3}</p>
              <p className="ruby-text">{dict.home.features.details.exp4}</p>
            </div>
          </Card>
          <Card className="p-6" style={{background:"#0c0008;"}}>
            <div className="flex flex-col items-center justify-center">
              <Store className="h-12 w-12 mb-2 text-red-300" />
              <h3 className="text-xl font-semibold mb-2 tracking-widest">
                {dict.home.features.financing.title}
              </h3>
            </div>
            <div className="flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="">{dict.home.features.financing.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <Link href={`/${lang}/shop`}>
                  <img src="/icons/tbcity.png" height="30px" width="140px" alt="tabascocity" />
                </Link>
                <Link href="www.tshirts.land">
                  <img src="/icons/tshirtsland.png" height="30px" width="120px" alt="tshirts.land" />
                </Link>
              </div>
              <p className="font-bold">{dict.home.features.financing.exp2}</p>
              <p className="font-bold text-red-200">{dict.home.features.financing.exp3}</p>
              <p className="font-semibold" style={{color:"#4EB87B"}}>{dict.home.features.financing.exp4}</p>
            </div>
          </Card>
          <Card className="p-6" style={{background:"#0c0008;"}}>
            <div className="flex flex-col items-center justify-center">
              <Factory className="h-12 w-12 mb-2 text-amber-500" />
              <h3 className="text-xl font-semibold mb-2 tracking-widest">
                {dict.home.features.industries.title}
              </h3>
            </div>
            <div className="flex flex-col justify-between h-[60%] mt-4 mx-auto">
              <p className="text-white mb-2 text-center">{dict.home.features.industries.exp1}</p>
              <div className="flex justify-evenly mb-3">
                <Link href={`/${lang}/shop`}>
                  <img src="/icons/shonen-detoured.png" width="160" alt="Shonen Industries"
                  />
                </Link>
              </div>
              <p className="mb-2 text-red-400 font-bold text-center">{dict.home.features.industries.exp2}</p>
              <p className="mb-2 text-red-500 font-bold text-center">{dict.home.features.industries.exp3}</p>
              <p className="mb-2 text-red-600 font-bold text-center">{dict.home.features.industries.exp4}</p>
            </div>
          </Card>
        </div>
      </div>
      <h2 className="text-center w-full mt-2 text-3xl font-chilititle text-yellow-200">{dict.home.nogen}</h2>
    </section>
  );
};

export default Features;
