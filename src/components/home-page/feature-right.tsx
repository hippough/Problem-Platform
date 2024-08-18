"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Post from "./example-post";

const Feature = () => {
  const [posts, setPosts] = useState<[]>([]);

  useEffect(() => {
    // Fetch recent posts from the API
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/recent"); // Adjust the API route as needed
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Section>
      <Container>
        <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
        <div className="py-4 space-y-4">
          {posts.map((problem: any) => (
              <Post
              key={problem._id.toString()}
              user={problem.name}
              text={problem.description}
              createdAt={problem.createdAt}
              likes={problem.likes.length}
              dislikes={problem.dislikes.length}
              comments={problem.comments.length}
              
          />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Feature;
