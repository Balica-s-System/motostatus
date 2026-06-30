import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP, organization } from "better-auth/plugins";
import { createElement } from "react";
import InvitationEmail from "@/mails/templates/invitation-email";
import OtpEmail from "@/mails/templates/otp-email";
import { prisma } from "./prisma";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL as string,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Moto Status <noreply@send.motostatus.com.br>",
          to: [email],
          subject: "Moto Status - Seu código de verificação",
          react: createElement(OtpEmail, { otp }),
        });
      },
    }),
    organization({
      async sendInvitationEmail(data) {
        const acceptLink = `${process.env.BETTER_AUTH_URL}/onboarding/member`;
        await resend.emails.send({
          from: "Moto Status <noreply@send.motostatus.com.br>",
          to: [data.email],
          subject: `Convite para ${data.organization.name}`,
          react: createElement(InvitationEmail, {
            inviterName: data.inviter.user.name,
            organizationName: data.organization.name,
            role: data.role,
            acceptLink,
          }),
        });
      },
    }),
  ],
  user: {
    additionalFields: {
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      name: {
        type: "string",
        required: false,
      },
      image: {
        type: "string",
        required: false,
      },
    },
  },
});
