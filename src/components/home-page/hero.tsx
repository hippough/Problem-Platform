// React and Next.js imports
import Link from "next/link";
import Image from "next/image";

// Third-party library imports
import Balancer from "react-wrap-balancer";

// Local component imports
import { Section, Container } from "../craft";
import { Button } from "@/components/ui/button";

// Asset imports
import Logo from "@/public/logo.svg";

const Hero = () => {
  return (
    <Section>
      <Container className="flex flex-col items-center text-center">
        {/* <Image
          src={Logo}
          width={172}
          height={72}
          alt="Company Logo"
          className="not-prose mb-6 dark:invert md:mb-8"
        /> */}
        <h1 className="!mb-0">
          <Balancer>
            Share Your Problems, Find Solutions.
          </Balancer>
        </h1>
        <h3 className="text-muted-foreground">
          <Balancer>
            Discover new perspectives by sharing your problems with others.
          </Balancer>
        </h3>
        <div className="not-prose mt-6 flex gap-2 md:mt-12">
          <Button asChild>
            <a href="/sign-in">
              Sign Up
            </a>
          </Button>
          <Button variant={"ghost"} asChild>
            <Link href="/#features">Learn More -{">"}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
