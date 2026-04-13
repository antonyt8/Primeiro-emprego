import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const INSTITUTIONS = ["UFAL", "UNEAL", "IFAL", "CESMAC", "UNIT", "FAT"];
const COURSES = ["Administração", "Direito", "Engenharia Civil", "Ciência da Computação", "Medicina", "Pedagogia", "Contabilidade"];
const PERIODS = ["1º Período", "2º Período", "3º Período", "4º Período", "5º Período", "6º Período", "7º Período", "8º Período"];

const EligibilityFilter = () => {
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState<"eligible" | "ineligible" | null>(null);

  const handleCheck = () => {
    if (!institution || !course || !period) return;
    const periodNum = parseInt(period);
    setResult(periodNum >= 3 ? "eligible" : "ineligible");
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Verifique a sua <span className="text-primary">Elegibilidade</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Descubra em segundos se pode participar no programa
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mx-auto mt-8 max-w-3xl shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Instituição</label>
                  <Select value={institution} onValueChange={setInstitution}>
                    <SelectTrigger className="h-12 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {INSTITUTIONS.map(i => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Curso</label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger className="h-12 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Período</label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="h-12 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIODS.map((p, idx) => (
                        <SelectItem key={p} value={String(idx + 1)}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-primary text-primary-foreground h-12 rounded-lg text-base"
                onClick={handleCheck}
                disabled={!institution || !course || !period}
              >
                <Search className="mr-2 h-5 w-5" />
                Verificar Elegibilidade
              </Button>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    {result === "eligible" ? (
                      <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4 text-success">
                        <CheckCircle2 className="h-6 w-6 shrink-0" />
                        <div>
                          <p className="font-semibold">Parabéns! Pode participar!</p>
                          <p className="text-sm opacity-80">O seu curso e período são elegíveis para o programa.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
                        <XCircle className="h-6 w-6 shrink-0" />
                        <div>
                          <p className="font-semibold">Ainda não é elegível</p>
                          <p className="text-sm opacity-80">É necessário estar a partir do 3º período para participar.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default EligibilityFilter;
