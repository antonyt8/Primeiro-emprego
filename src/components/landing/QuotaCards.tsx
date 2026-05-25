import { motion } from "framer-motion";
import { Accessibility, Users, BookOpen, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quotas = [
 
  {
    icon: BookOpen,
    label: "CadÚnico",
    percentage: 40,
    description: "Cadastro Único do Governo Federal",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Building2,
    label: "Rede Pública",
    percentage: 40,
    description: "Egressos de escolas públicas",
    color: "text-primary",
    bg: "bg-primary/10",
  },
   {
    icon: Accessibility,
    label: "PcD",
    percentage: 10,
    description: "Pessoas com Deficiência",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    label: "Ampla Concorrência",
    percentage: 10,
    description: "Aberta a todos os candidatos",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const QuotaCards = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Distribuição de <span className="text-primary">Cotas</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            As vagas são distribuídas de forma justa e transparente
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quotas.map((quota, index) => (
            <motion.div
              key={quota.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${quota.bg}`}>
                    <quota.icon className={`h-7 w-7 ${quota.color}`} />
                  </div>
                  <p className={`mt-4 text-5xl font-extrabold ${quota.color}`}>
                    {quota.percentage}%
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{quota.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{quota.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuotaCards;
