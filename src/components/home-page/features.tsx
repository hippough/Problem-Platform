// React and Next.js
import React from "react";

// Layout Components
import { Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";

// Icons
import { Pencil, Eye, SquareCheck } from "lucide-react";

type FeatureText = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const featureText: FeatureText[] = [
  {
    icon: <Pencil className="h-6 w-6" />,
    title: "Write",
    description:
      "Share your challenges and ideas. Whether it's a problem to solve or an innovative solution, start the conversation here.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "See",
    description:
      "Explore a diverse range of issues and solutions shared by the community. Get inspired by the perspectives of others.",
  },
  {
    icon: <SquareCheck className="h-6 w-6" />,
    title: "Do",
    description:
      "Take action by engaging with the problems that matter to you. Collaborate, offer solutions, and make a difference.",
  },
];

const Feature = () => {
  return (
    <Section className="border-b">
      <Container className="not-prose">
        <div className="flex flex-col gap-6">
          <h3 className="text-4xl">
            <Balancer>
            Explore, Interact, and Solve on Problem Platform.
            </Balancer>
          </h3>
          <h4 className="text-2xl font-light opacity-70">
            <Balancer>
            Join a community of problem-solvers working together to tackle real-world challenges.
            </Balancer>
          </h4>

          <div className="mt-6 grid gap-6 md:mt-12 md:grid-cols-3">
            {featureText.map(({ icon, title, description }, index) => (
              <div className="flex flex-col gap-4" key={index}>
                {icon}
                <h4 className="text-xl text-primary">{title}</h4>
                <p className="text-base opacity-75">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Feature;
