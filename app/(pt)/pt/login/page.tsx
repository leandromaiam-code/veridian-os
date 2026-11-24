import type { Metadata } from "next";
import LoginClient from "@/components/login-client";

export const metadata: Metadata = {
  title: "Entre no estúdio · Veriddan",
  description: "Entre para acessar o Veriddan OS — Jarvis, Fabric, Vortex, Pulse.",
};

export default function LoginPagePt() {
  return <LoginClient locale="pt" />;
}
