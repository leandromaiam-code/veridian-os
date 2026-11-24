import type { Metadata } from "next";
import LoginClient from "@/components/login-client";

export const metadata: Metadata = {
  title: "Enter the studio · Veriddan",
  description: "Sign in to access Veriddan OS — Jarvis, Fabric, Vortex, Pulse.",
};

export default function LoginPage() {
  return <LoginClient />;
}
