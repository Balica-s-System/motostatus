import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface InvitationEmailProps {
  inviterName: string;
  organizationName: string;
  role: string;
  acceptLink: string;
}

export default function InvitationEmail({
  inviterName,
  organizationName,
  role,
  acceptLink,
}: InvitationEmailProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Você foi convidado para {organizationName}</Preview>

      <Body
        style={{
          margin: 0,
          padding: "40px 20px",
          backgroundColor: "#f5f5f5",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: "#111827",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                color: "#fff",
                margin: 0,
                fontSize: "28px",
              }}
            >
              🏍️ Moto Status
            </Heading>

            <Text
              style={{
                color: "#d1d5db",
                margin: "8px 0 0",
                fontSize: "14px",
              }}
            >
              Plataforma de gestão para concessionárias
            </Text>
          </Section>

          {/* Conteúdo */}
          <Section
            style={{
              padding: "40px 32px",
              textAlign: "center",
            }}
          >
            <Heading
              as="h2"
              style={{
                color: "#111827",
                marginTop: 0,
                fontSize: "22px",
              }}
            >
              Convite para equipe
            </Heading>

            <Text
              style={{
                color: "#6b7280",
                lineHeight: "24px",
                fontSize: "15px",
                margin: "16px 0",
              }}
            >
              <strong style={{ color: "#111827" }}>{inviterName}</strong>{" "}
              convidou você para fazer parte da equipe da{" "}
              <strong style={{ color: "#111827" }}>{organizationName}</strong>{" "}
              como <strong style={{ color: "#f97316" }}>{role}</strong>.
            </Text>

            <Section style={{ margin: "32px 0", textAlign: "center" }}>
              <Button
                href={acceptLink}
                style={{
                  backgroundColor: "#f97316",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "14px 36px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Aceitar Convite
              </Button>
            </Section>

            <Text
              style={{
                color: "#9ca3af",
                fontSize: "13px",
                marginTop: "24px",
              }}
            >
              Se você não esperava este convite, ignore este e-mail.
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} Moto Status. Todos os direitos
              reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
