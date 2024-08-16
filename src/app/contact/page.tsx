import { Container, Main, Section } from "@/components/craft";
import NavBar from "@/components/navbar";

export default function Contact() {
  return (
    <>
      <NavBar />
      <Main>
        <Section>
          <Container>
            <h1>Contact Us</h1>
            <p>
              If you have any questions, concerns, or just want to get in touch,
              please feel free to reach out to us. We are here to help and would
              love to hear from you.
            </p>
            <p>
              You can contact us via email at{" "}
              <a href="mailto:contact@problemplatform.com">contact@problemplatform.com</a>.
            </p>
            <br/>
            <p>We look forward to hearing from you!</p>
          </Container>
        </Section>
      </Main>
    </>
  );
}
