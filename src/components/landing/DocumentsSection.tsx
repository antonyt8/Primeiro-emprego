import { motion } from "framer-motion";
import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";

const editalLinks = [
  { label: "Edital 02/2024 - 23/08/2024", href: "https://primeiroemprego.al.gov.br/statics/edital-02-2024.pdf" },
  { label: "Edital Indigena - 19/04/2023", href: "https://primeiroemprego.al.gov.br/statics/Edital-indigena-2.pdf" },
  { label: "Edital Geral - 19/04/2023", href: "https://primeiroemprego.al.gov.br/statics/Edital1-2023-geral.pdf" },
  { label: "Edital - 22/02/2022", href: "https://primeiroemprego.al.gov.br/statics/edital3_pontape.pdf" },
  { label: "Edital - 14/12/2021", href: "https://primeiroemprego.al.gov.br/statics/resultados/edital2_pontape.pdf" },
  { label: "Edital - 25/05/2021", href: "https://primeiroemprego.al.gov.br/statics/edital_rep.pdf" },
];

const bancoTalentosLinks = [
  { label: "Lista de candidatos habilitados - Edital 07/2025 - 04/08/2025", href: "https://primeiroemprego.al.gov.br/statics/Classificados%20Primeiro%20Emprego%202025.pdf" },
  { label: "Lista de candidatos habilitados - Edital 02/2024 - 30/08/2024", href: "https://primeiroemprego.al.gov.br/statics/CANDIDATOS%20APTOS%20EDITAL%202024.pdf" },
  { label: "Lista de candidatos habilitados - Edital Geral - 19/04/2023", href: "https://primeiroemprego.al.gov.br/statics/CANDIDATOS%20CLASSIFICADOS%20SISTEMA%202023-1-97.pdf" },
  { label: "Lista de candidatos indigenas habilitados - Edital Indigena - 19/04/2023", href: "https://primeiroemprego.al.gov.br/statics/Ind%C3%ADgena-habilitados.pdf" },
];

const contratadoLinks = [
  { label: "Lista dos Estagiarios Contratados - Atualizacao em marco de 2026", href: "https://primeiroemprego.al.gov.br/statics/Primeiro%20Emprego%20Mar%C3%A7o%202026.pdf" },
];

type LinkItem = {
  label: string;
  href: string;
};

const LinkList = ({ items }: { items: LinkItem[] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item.label}>
        <a
          href={item.href}
          className="group flex items-start justify-between gap-3 rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.07] px-3 py-2.5 text-sm text-primary-foreground/90 transition-all hover:border-primary-foreground/30 hover:bg-primary-foreground/[0.16]"
        >
          <span className="leading-6">{item.label}</span>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
        </a>
      </li>
    ))}
  </ul>
);

const DocumentsSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-20" id="documentos">
      <div className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />

      <div className="container relative space-y-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/15 p-6 text-primary-foreground shadow-xl backdrop-blur-sm md:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-extrabold md:text-3xl">Importante!</h2>
          </div>

          <p className="max-w-6xl text-sm leading-7 text-primary-foreground/95 md:text-base">
            A lista dos classificados para compor o banco de talentos esta disponivel no site do Programa Primeiro
            Emprego. As vagas sao disponibilizadas de acordo com a demanda dos orgaos. O sistema envia os candidatos
            obedecendo os percentuais que constam no edital. Caso voce seja aprovado, recebera um e-mail de notificacao
            com todas as instrucoes.
          </p>

          <div className="mt-6 rounded-xl border border-primary-foreground/20 bg-primary-foreground/[0.08] px-4 py-3">
            <p className="text-sm font-semibold md:text-base">Atenciosamente,</p>
            <p className="mt-1 text-sm font-semibold md:text-base">Governanca do Programa de Estagio Primeiro Emprego</p>
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/15 p-6 text-primary-foreground shadow-xl backdrop-blur-sm md:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <FileText className="h-5 w-5" />
            </span>
            <h2 className="text-2xl font-extrabold md:text-3xl">Documentos</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.08] p-4 md:p-5">
              <h3 className="mb-4 text-lg font-bold md:text-xl">Editais</h3>
              <LinkList items={editalLinks} />
            </div>

            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.08] p-4 md:p-5">
             
              <h3 className="mb-4 text-lg font-bold md:text-xl">Banco de Talentos: Candidatos Habilitados</h3>
              <LinkList items={bancoTalentosLinks} />
            </div>

            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.08] p-4 md:col-span-2 md:p-5">
              
              <h3 className="mb-4 text-lg font-bold md:text-xl">Estagiarios Contratados</h3>
              <LinkList items={contratadoLinks} />
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default DocumentsSection;
