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
              If you have any questions or business inquiries,
            </p>
            <p>
              You can contact us via email at{" "}
              <a href="mailto:ethan@theproblemplatform.com">ethan@theproblemplatform.com</a>.
            </p>
            <br/>
            <p>We look forward to hearing from you!</p>
          </Container>
        </Section>
      </Main>
    </>
  );
}
