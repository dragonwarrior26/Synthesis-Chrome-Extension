
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    email?: string;
}

export const WelcomeEmail = ({ email }: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to the Synthesis early access list</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Welcome to Synthesis</Heading>
                <Text style={text}>
                    Thank you for joining the waitlist. We're building the future of
                    information consumption, and we're excited to have you on board.
                </Text>
                <Text style={text}>
                    You've secured your spot for early access. We'll verify your entry and notify you as soon as your access is approved.
                </Text>
                <Section style={btnContainer}>
                    <Link
                        style={button}
                        href="https://synthesisext.com"
                    >
                        Visit Website
                    </Link>
                </Section>
                <Text style={footer}>
                    Synthesis • Research at the Speed of Thought
                </Text>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

const main = {
    backgroundColor: "#000000",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
};

const h1 = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "1.1",
    margin: "0 0 15px",
};

const text = {
    color: "#a1a1aa",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "24px 0",
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
};

const footer = {
    color: "#52525b",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "48px 0 0",
};
