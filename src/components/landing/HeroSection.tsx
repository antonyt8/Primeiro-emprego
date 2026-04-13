import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-card py-16 md:py-24">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/5" />
      </div>

      <div className="container relative z-10">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Star className="h-4 w-4" />
              Programa Governo de Alagoas
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Primeiro{" "}
              <span className="text-primary">Emprego</span>{" "}
              <span className="text-accent">AL</span>
            </h1>

            <p className="max-w-lg text-lg text-muted-foreground">
              O seu primeiro passo rumo ao mercado de trabalho. Inscreva-se no programa que conecta estudantes universitários a oportunidades reais no serviço público de Alagoas.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/auth")}
              >
                Inscrever-me
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-lg border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => navigate("/auth")}
              >
                Já tenho conta
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-primary">2.500+</p>
                <p className="text-sm text-muted-foreground">Vagas oferecidas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">45+</p>
                <p className="text-sm text-muted-foreground">Órgãos parceiros</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Satisfação</p>
              </div>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl" />
              <div className="relative flex h-72 w-72 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 md:h-96 md:w-96">
                <div className="space-y-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <GraduationCap className="h-10 w-10" />
                  </div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground px-8">
                    Da universidade ao mercado de trabalho
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
