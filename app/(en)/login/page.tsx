import type { Metadata } from "next";
import LoginClient from "@/components/login-client";

export const metadata: Metadata = {
  title: "Enter the studio · Veridian",
  description: "Sign in to access Veridian OS — Jarvis, Fabric, Vortex, Pulse.",
};

export default function LoginPage() {
  return <LoginClient />;
}
