"use client";

import { Card } from "ù/card";
import { Button } from "ù/button";
import { 
  Palette, 
  Video, 
  Code, 
  Wand2,
  Globe, 
  Boxes, 
  PenTool,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";

interface ServicePrice {
  eur: number;
  tabz: number;
  agt: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fourHours: ServicePrice;
  fullDay: ServicePrice;
}

export function Services() {
  const [duration, setDuration] = useState<'4h' | 'day'>('4h');

  const services: Service[] = [
    {
      id: 'webdesign',
      name: 'Web Design',
      description: 'Modern, responsive web design with focus on UX/UI',
      icon: <Code className="h-6 w-6" />,
      fourHours: { eur: 200, tabz: 2000, agt: 400 },
      fullDay: { eur: 450, tabz: 4500, agt: 900 }
    },
    {
      id: 'video',
      name: 'Video Editing',
      description: 'Professional video editing and post-production',
      icon: <Video className="h-6 w-6" />,
      fourHours: { eur: 180, tabz: 1800, agt: 360 },
      fullDay: { eur: 400, tabz: 4000, agt: 800 }
    },
    {
      id: 'aftereffects',
      name: 'After Effects',
      description: 'Motion graphics and visual effects',
      icon: <Wand2 className="h-6 w-6" />,
      fourHours: { eur: 220, tabz: 2200, agt: 440 },
      fullDay: { eur: 500, tabz: 5000, agt: 1000 }
    },
    {
      id: 'illustration',
      name: 'Illustration',
      description: 'Digital and traditional illustration',
      icon: <Palette className="h-6 w-6" />,
      fourHours: { eur: 150, tabz: 1500, agt: 300 },
      fullDay: { eur: 350, tabz: 3500, agt: 700 }
    },
    {
      id: 'motiondesign',
      name: 'Motion Design',
      description: 'Animated graphics and visual storytelling',
      icon: <PenTool className="h-6 w-6" />,
      fourHours: { eur: 200, tabz: 2000, agt: 400 },
      fullDay: { eur: 450, tabz: 4500, agt: 900 }
    },
    {
      id: 'fullwebsite',
      name: 'Full Website',
      description: 'Complete website development from design to deployment',
      icon: <Globe className="h-6 w-6" />,
      fourHours: { eur: 250, tabz: 2500, agt: 500 },
      fullDay: { eur: 600, tabz: 6000, agt: 1200 }
    },
    {
      id: '3d',
      name: '3D Creation',
      description: '3D modeling, texturing, and animation',
      icon: <Boxes className="h-6 w-6" />,
      fourHours: { eur: 230, tabz: 2300, agt: 460 },
      fullDay: { eur: 550, tabz: 5500, agt: 1100 }
    },
    {
      id: 'handmade',
      name: 'Handmade Art',
      description: 'Traditional art and physical creations',
      icon: <PenTool className="h-6 w-6" />,
      fourHours: { eur: 160, tabz: 1600, agt: 320 },
      fullDay: { eur: 380, tabz: 3800, agt: 760 }
    },
    {
      id: 'stories',
      name: 'Original Scenario & Comic pages',
      description: 'Per day: One page of comic any style, or ten pages of uncanny scenario',
      icon: <PenTool className="h-6 w-6" />,
      fourHours: { eur: 120, tabz: 1600, agt: 320 },
      fullDay: { eur: 300, tabz: 3800, agt: 760 }
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Services & Pricing</h2>
      
      <div className="flex justify-center mb-8">
        <Tabs value={duration} onValueChange={(v) => setDuration(v as '4h' | 'day')}>
          <TabsList>
            <TabsTrigger value="4h" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              4 Hours
            </TabsTrigger>
            <TabsTrigger value="day" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Full Day
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                {service.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">EUR</span>
                <span className="font-semibold">
                  €{duration === '4h' ? service.fourHours.eur : service.fullDay.eur}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">TABZ</span>
                <span className="font-semibold">
                  {duration === '4h' ? service.fourHours.tabz : service.fullDay.tabz} TABZ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AGT</span>
                <span className="font-semibold">
                  {duration === '4h' ? service.fourHours.agt : service.fullDay.agt} AGT
                </span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-quintary text-quadriary hover:text-black hover:bg-muted-foreground hover:text-black hover:bg-muted-foreground">
              Request Service
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Notes:</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Prices are for standard services. Complex projects may require custom quotes.</li>
          <li>• Full day is calculated as 8 working hours.</li>
          <li>• TABZ and AGT prices are pegged to EUR value at time of payment.</li>
          <li>• Rush orders may incur additional fees.</li>
          <li>• Revisions are included but limited based on project scope.</li>
        </ul>
      </div>
    </div>
  );
}