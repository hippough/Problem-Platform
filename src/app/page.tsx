import {Container, Main, Section} from "@/components/craft";
import CTA from "@/components/home-page/call-to-action";
import Feature from "@/components/home-page/feature-right";
import Features from "@/components/home-page/features";
import Footer from "@/components/home-page/footer";
import Hero from "@/components/home-page/hero";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <NavBar />
      <Main>
        <Section>
          <Container>
            <Hero />
            <section id="features">
              <Features />
            </section>
            <section>
              <Feature />
            </section>
            
            <CTA />
            
          </Container>
        </Section>
      </Main>
      <Footer />
    </>
    
  );
}