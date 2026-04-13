import { motion } from "framer-motion";
import { FileText, Search, Users, Briefcase } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Inscrição",
    description: "Preencha os seus dados e envie a documentação necessária pelo portal.",
  },
  {
    icon: Search,
    title: "Análise",
    description: "A sua inscrição é analisada e validada pela equipa do programa.",
  },
  {
    icon: Users,
    title: "Banco de Talentos",
    description: "O seu perfil entra no banco de talentos disponível para os órgãos estaduais.",
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
            Quatro passos simples até à sua primeira experiência profissional
          </p>
        </motion.div>

        <div className="relative mt-12">
          {/* Line connecting steps - desktop */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-border md:block" />

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number badge */}
                <div className="relative z-10 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
