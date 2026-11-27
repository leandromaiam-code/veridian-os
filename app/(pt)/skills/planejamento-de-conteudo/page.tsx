import { redirect } from "next/navigation";

// A skill passou a se chamar content-planner-agent; o endereço antigo leva para o novo, com o ?ig= junto.
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(await searchParams)) if (typeof v === "string") q.set(k, v);
  const s = q.toString();
  redirect("/skills/content-planner-agent" + (s ? "?" + s : ""));
}
