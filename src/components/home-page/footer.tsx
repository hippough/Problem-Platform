import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { Section, Container } from "../craft";
import Logo from "@/public/logo.svg";

export default function Footer() {
  return (
    <footer className="not-prose border-t">
      <Section>
        <Container className="grid gap-6">
          <div className="grid gap-6">
            <Link href="/" className="flex items-center">
                <Image
                src="/icon_light.svg" // Replace with your logo path
                alt="Logo"
                width={60}
                height={60}
                />
                <span className="text-xl font-semibold">Problem Platform</span>
            </Link>
            <p>
              <Balancer>
                Problem Platform, the place for problems and solutions.
              </Balancer>
            </p>
            <div className="mb-6 flex flex-col gap-4 text-sm text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row">
              <Link href="/#features">Features</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <p className="text-muted-foreground">
              ©{" "} 2024{" "}
              <Link href="/">Problem Platform</Link>
              . All rights reserved.
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
