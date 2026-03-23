import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Img,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface LeadConfirmationEmailProps {
    patientName: string;
    referenceId: string;
    surgeryName: string;
}

export const LeadConfirmationEmail = ({
    patientName,
    referenceId,
    surgeryName,
}: LeadConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>We&apos;ve received your inquiry for {surgeryName}</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={header}>
                    <Heading style={heading}>HealthExpress India</Heading>
                </Section>
                <Section style={content}>
                    <Text style={paragraph}>Hi {patientName},</Text>
                    <Text style={paragraph}>
                        Thank you for choosing HealthExpress India. We have received your inquiry for <strong>{surgeryName}</strong>.
                    </Text>
                    <Section style={refSection}>
                        <Text style={refLabel}>Your Reference ID:</Text>
                        <Text style={refId}>{referenceId}</Text>
                    </Section>
                    <Text style={paragraph}>
                        Our medical coordination team is currently reviewing your requirements and will reach out to you within 24 hours to guide you through the next steps.
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        HealthExpress India - Simplifying Surgery & Hospitalization
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default LeadConfirmationEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    borderRadius: "8px",
    border: "1px solid #e6ebf1",
};

const header = {
    padding: "32px",
};

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#0d9488",
    textAlign: "center" as const,
};

const content = {
    padding: "0 32px",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#484848",
};

const refSection = {
    backgroundColor: "#f0fdfa",
    borderRadius: "8px",
    padding: "24px",
    textAlign: "center" as const,
    margin: "24px 0",
};

const refLabel = {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
};

const refId = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#0d9488",
    margin: "8px 0 0 0",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
};
