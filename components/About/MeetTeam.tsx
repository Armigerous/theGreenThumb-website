"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const MeetTeam: React.FC = () => {
  const team = [
    {
      name: "Eligh Williams",
      role: "Mechanical Engineer – Hardware & Product Design",
      avatar: {
        img: "/eligh.jpeg",
        fallback: "EW",
      },
    },
    {
      name: "Sanskriti Deva",
      role: "Computer Engineer – Software & Product Management",
      avatar: {
        img: "/sanskriti.png",
        fallback: "SD",
      },
    },
    {
      name: "Sebastian King",
      role: "Mechanical Engineer – Hardware & Product Design",
      avatar: {
        img: "/sebastian.png",
        fallback: "SK",
      },
    },
    {
      name: "Eren Kahveci",
      role: "Computer Scientist – Software & Database Development",
      avatar: {
        img: "/eren.png",
        fallback: "EK",
      },
    },
    {
      name: "Bradley Clardy",
      role: "Computer Engineer – Hardware & Sensor Design",
      avatar: {
        img: "/bradley.png",
        fallback: "BC",
      },
    },
  ];

  return (
    <section className="py-24 bg-cream-300/80 rounded-lg shadow-xl">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center text-primary">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {team.map((member, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <CardHeader>
                <Avatar className="w-24 h-24">
                  <AvatarImage src={member.avatar.img} />
                  <AvatarFallback className="text-2xl">
                    {member.avatar.fallback}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTeam;
