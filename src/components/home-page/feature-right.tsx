"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import PostProblemImage from "../../../public/post_problem.png"; // Add your image paths here
import ReactToProblemImage from "../../../public/react_problem.png"; // Add your image paths here
import ShareThoughtsImage from "../../../public/comment_problem.png"; // Add your image paths here
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const Feature = () => {
  const [activeItem, setActiveItem] = useState("item-1");

  const getImageSrc = () => {
    switch (activeItem) {
      case "item-1":
        return PostProblemImage;
      case "item-2":
        return ReactToProblemImage;
      case "item-3":
        return ShareThoughtsImage;
      default:
        return "";
    }
  };

  return (
    <Section>
      <Container className="grid items-stretch md:grid-cols-2 md:gap-12">
        <div className="flex flex-col py-6">
          <h3 className="!my-0 text-base">Interact With Others</h3>
          <Accordion 
            type="single" 
            className="w-full" 
            value={activeItem} 
            onValueChange={setActiveItem}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm md:text-x py-1">Post your problem.</AccordionTrigger>
              <AccordionContent className="text-sm md:text-s">
                Share your issues with the world and seek improvements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm md:text-s py-1">React to other problems.</AccordionTrigger>
              <AccordionContent className="text-sm md:text-s">
                Like or dislike, let others know your reaction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm md:text-s py-1">Share your thoughts.</AccordionTrigger>
              <AccordionContent className="text-sm md:text-s">
                Add comments to problems you're interested in.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="not-prose relative flex h-96 overflow-hidden rounded-lg border">
          <Image
            src={getImageSrc()}
            alt="feature image"
            className="fill object-cover"
          />
        </div>
      </Container>
    </Section>
  );
};

export default Feature;
