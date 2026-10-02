import type { Metadata } from "next";
import LoginClient from "@/components/login-client";

export const metadata: Metadata = {
  title: "Entre no estúdio · Veridian",
  description: "Entre para acessar o Veridian OS — Jarvis, Fabric, Vortex, Pulse.",
};

export default function LoginPagePt() {
  return <LoginClient locale="pt" />;
}
