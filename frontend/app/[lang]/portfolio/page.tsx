"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { ArtworkGrid } from "@comp/portfolio/ArtworkGrid";
import { VideoShowcase } from "@comp/portfolio/VideoShowcase";
import { CategorySidebar } from "@comp/portfolio/CategorySidebar";
import { AdsSidebar } from "@comp/portfolio/AdsSidebar";
import { ThemeProvider, useTheme } from '@comp/theme/ThemeContext';
import Link from "next/link";
import { Services } from "@comp/portfolio/Services";

function PortfolioContent() {
  const { theme } = useTheme();
  
  return (
    <div className={`container mx-auto py-8 ${theme}`}>
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>

      <div className="flex gap-8">
        <CategorySidebar />

        <main className="flex-1">
          <Tabs defaultValue="illustrations" className="space-y-8">
            <TabsList>
              <TabsTrigger value="illustrations">Illustrations</TabsTrigger>
              <TabsTrigger value="comics">Comics</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="graphics">Graphic Works</TabsTrigger>
            </TabsList>

            <TabsContent value="illustrations">
              <ArtworkGrid category="illustrations" titles={["rien", "pour", "l'instant"]} />
            </TabsContent>

            <TabsContent value="comics">
              <ArtworkGrid category="comics" titles={["Les Feignards", "Attorney Out", "Saint Tsuya", "Rival Screen Punk", "Randomized", "Asha old school", "Uncannette Crossover"]} />
            </TabsContent>

            <TabsContent value="videos">
              <VideoShowcase />
            </TabsContent>

            <TabsContent value="graphics">
              <ArtworkGrid category="graphics" titles={["rien", "pour", "l'instant"]} />
            </TabsContent>
          </Tabs>

          <section className="tech">
            <div>
              <h3>Technologies utilisées pour ce site</h3>
              <div className="flex flex-wrap w-[80%] mx-auto p-4 items-center justify-between gap-12">
                <div>
                  <Link href="/">
                    <img src="/icons/js.png" alt="" width="50px" />
                    <p>Javascript</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/react.png" alt="" width="50px" />
                    <p>React 18</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/tail.webp" alt="" width="50px" />
                    <p>Tailwind3</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/sass.webp" alt="" width="50px" />
                    <p>Sass</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/node.png" alt="" width="50px" />
                    <p>Node</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/blend.png" alt="" width="50px" />
                    <p>Blender</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/three.jpeg" alt="" width="50px" />
                    <p>Three JS</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/next.webp" alt="" width="50px" />
                    <p>Next 14</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/postg.png" alt="" width="50px" />
                    <p>Postgre SQL</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/shad.png" alt="" width="50px" />
                    <p>Shad CN</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/prisma-2.svg" alt="" width="50px" />
                    <p>Prisma</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/ethers.png" alt="Ethers" width="50px" />
                    <p>Ethers</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Services />

          <section className="tech">
            <div>
              <h3>Autres technologies que j'aime utiliser : </h3>
              <div className="flex flex-wrap w-[80%] mx-auto p-4 items-center justify-between gap-12">
                <div>
                  <Link href="/">
                    <img src="/icons/mongo.png" alt="" width="50px" />
                    <p>Mongo DB</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/wp.png" alt="" width="50px" />
                    <p>Wordpress</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/react.png" alt="" width="50px" />
                    <p>Python</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/prem.png" alt="" width="50px" />
                    <p>Adobe Premiere</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/ae.png" alt="" width="50px" />
                    <p>Adobe After Effect</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/photoshop.png" alt="" width="50px" />
                    <p>Adobe Photoshop</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/illust.jpg" alt="" width="50px" />
                    <p>Adobe Illustrator</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/aud.png" alt="" width="50px" />
                    <p>Adobe Audition</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="tech">
            <div>
              <h3 >Technologies utilisees dans d'autres projets : </h3>
              <div className="flex flex-wrap w-[80%] mx-auto p-4 items-center justify-between gap-12">
                <div>
                  <Link href="/">
                    <img src="/icons/php.png" alt="" width="50px" />
                    <p>Php 8.3</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/sql.png" alt="" width="50px" />
                    <p>MySQL</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/symf.webp" alt="" width="50px" />
                    <p>Symfony 6.3</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/twig.png" alt="" width="50px" />
                    <p>Twig 2</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/rust.png" alt="" width="50px" />
                    <p>Rust</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/red.png" alt="" width="50px" />
                    <p>Redux Store</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/styledes.png" alt="" width="50px" />
                    <p>Styled Components</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/vue.jpg" alt="" width="50px" />
                    <p>Vue JS</p>
                  </Link>
                </div>
                <div>
                  <Link href="/">
                    <img src="/icons/docker.png" alt="" width="50px" />
                    <p>Docker Desktop</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <AdsSidebar />
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <ThemeProvider>
      <PortfolioContent />
    </ThemeProvider>
  );
}