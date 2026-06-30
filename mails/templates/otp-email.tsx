import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

export default function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>Moto Status - Seu código de verificação</Preview>

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
              Verifique seu e-mail
            </Heading>

            <Text
              style={{
                color: "#6b7280",
                lineHeight: "24px",
                fontSize: "15px",
              }}
            >
              Utilize o código abaixo para confirmar sua identidade e acessar o
              Moto Status.
            </Text>

            <Section
              style={{
                margin: "32px 0",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                padding: "24px",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                }}
              >
                Código de verificação
              </Text>

              <Text
                style={{
                  margin: "12px 0 0",
                  fontSize: "40px",
                  fontWeight: "700",
                  letterSpacing: "10px",
                  color: "#111827",
                }}
              >
                {otp}
              </Text>
            </Section>

            <Text
              style={{
                color: "#9ca3af",
                fontSize: "13px",
              }}
            >
              Este código expira em alguns minutos. Se você não solicitou este
              acesso, ignore este e-mail.
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
