import { motion } from "framer-motion";
import {MessageSquare, FileText, Search, Users, Briefcase } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Inscrição",
    description: "Preencha os seus dados e envie a documentação necessária pelo portal.",
  },
  {
    icon: Search,
    title: "Análise",
    description: "A sua inscrição é analisada e validada pela equipe do programa.",
  },
  {
    icon: Users,
    title: "Banco de Talentos",
    description: "O seu perfil entra no banco de talentos disponível para os órgãos estaduais.",
  },
  {
    icon: MessageSquare,
    title: "Entrevista",
    description: "Se aprovado, será convocado para uma entrevista com os órgãos participantes.",
  },
  {
    icon: Briefcase,
    title: "Contratação",
    description: "Ao surgir uma vaga compatível, recebe a convocatória para iniciar o estágio.",
  },
];

const TimelineSection = () => {
  return (
    <section className="bg-card py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Como <span className="text-primary">Funciona</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Cinco passos simples até à sua primeira experiência profissional
          </p>
        </motion.div>

        <div className="relative mt-10">
          {/* Line connecting steps - desktop */}
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-border md:block" />

          <div className="grid gap-5 md:grid-cols-5 md:gap-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center md:px-1"
              >
                {/* Step number badge */}
                <div className="relative z-10 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md md:h-11 md:w-11">
                    <step.icon className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground md:h-5 md:w-5">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-foreground md:text-[15px]">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-[13px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;