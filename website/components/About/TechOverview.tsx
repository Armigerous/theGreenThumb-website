import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Droplet, Sun, Thermometer, Cloud } from "lucide-react";

const TechOverview: React.FC = () => {
  const technologies = [
    { name: "Soil Moisture Sensors", icon: Droplet },
    { name: "Light Sensors", icon: Sun },
    { name: "Temperature & Humidity Sensors", icon: Thermometer },
    { name: "Cloud-based Plant Database", icon: Cloud },
  ];

  return (
    <section className="py-16 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-primary">
          Our Technology Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <Card
              key={index}
              className="bg-card hover:shadow-lg transition-shadow"
            >
              <CardContent className="flex flex-col items-center p-4 sm:p-6">
                {React.createElement(tech.icon, {
                  size: 48,
                  className: "text-primary mb-4",
                })}
                <p className="text-center font-medium text-sm sm:text-base">
                  {tech.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechOverview;
