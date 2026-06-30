import type { Metadata } from "next";
import OnboardingForm from "./_components/onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding | Moto Status",
  description:
    "Selecione como deseja começar no Moto Status: criando uma nova organização ou configurando seu perfil de membro.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  return <OnboardingForm />;
}
