import Image from "next/image";
import { BrassDivider } from "@/components/ui";

export function Footer() {
  return (
    <footer className="relative bg-forest text-parchment">
      <div className="px-10 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/assets/logos/veridian-symbol.png"
                alt="Veridian"
                width={40}
                height={40}
                className="opacity-95"
              />
              <span className="font-cormorant font-light text-3xl text-parchment">
                Veridian
              </span>
            </div>
            <p className="font-cormorant italic font-light text-seafoam text-xl leading-snug max-w-xs">
              We grow autonomous startups.
            </p>
          </div>

          {/* Ecosystem */}
          <div className="md:col-span-2">
            <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-celadon/70 block mb-5">
              Ecosystem
            </span>
            <ul className="flex flex-col gap-3 font-sans text-[15px] text-parchment/85">
              <li><a className="hover:text-brass-light transition-colors" href="#modules">Jarvis</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="#modules">Fabric</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="#modules">Vortex</a></li>
            </ul>
          </div>

          {/* Ventures */}
          <div className="md:col-span-3">
            <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-celadon/70 block mb-5">
              Ventures
            </span>
            <ul className="flex flex-col gap-3 font-sans text-[15px] text-parchment/85">
              <li><a className="hover:text-brass-light transition-colors" href="https://conciera.ai">Conciera</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="https://knexo.io">kNexo</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="#ventures">TEG+</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="#ventures">LoveDopa</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="#ventures">ZettaPay</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-celadon/70 block mb-5">
              Contact
            </span>
            <ul className="flex flex-col gap-3 font-sans text-[15px] text-parchment/85">
              <li><a className="hover:text-brass-light transition-colors" href="mailto:contato@veridian.ai">contato@veridian.ai</a></li>
              <li><a className="hover:text-brass-light transition-colors" href="https://linkedin.com">linkedin/leandromaia</a></li>
              <li className="text-celadon/60">São Paulo · Brasil</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <BrassDivider width="w-full" className="bg-brass/30" />
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-celadon/60">
            © 2026 Veridian AI Studio · Built by 4Profit.AI
          </span>
          <span className="font-mono uppercase tracking-[0.22em] text-[10px] text-celadon/60">
            v0.1 · Forge edition
          </span>
        </div>
      </div>
    </footer>
  );
}
