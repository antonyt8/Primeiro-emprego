import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { programCatalog, evaluateEligibility, normalizePeriod } from "@/services/programService";
import { programApi, type CatalogItem } from "@/api/programApi";
import { HttpError } from "@/api/http";

const EligibilityFilter = () => {
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("");
  const [period, setPeriod] = useState("");
  const [result, setResult] = useState<"eligible" | "ineligible" | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [institutions, setInstitutions] = useState<CatalogItem[]>([]);
  const [courses, setCourses] = useState<CatalogItem[]>([]);

  useEffect(() => {
    const loadCatalogs = async () => {
      setLoadingCatalogs(true);

      try {
        const [institutionData, courseData] = await Promise.all([
          programApi.getInstitutions(),
          programApi.getCourses(),
        ]);

        setInstitutions(institutionData);
        setCourses(courseData);
      } catch {
        setInstitutions(programCatalog.institutions.map((item) => ({ id: item, name: item })));
        setCourses(programCatalog.courses.map((item) => ({ id: item, name: item })));
      } finally {
        setLoadingCatalogs(false);
      }
    };

    void loadCatalogs();
  }, []);

  const handleCheck = async () => {
    if (!institution || !course || !period) return;

    const normalizedPeriod = normalizePeriod(period);
    if (!normalizedPeriod) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const selectedInstitution = institutions.find((item) => item.id === institution);
      const selectedCourse = courses.find((item) => item.id === course);

      const response = await programApi.checkEligibility({
        institution_id: institution,
        course_id: course,
        institution: selectedInstitution?.name ?? institution,
        course: selectedCourse?.name ?? course,
        period: normalizedPeriod,
      });

      setResult(response.eligible ? "eligible" : "ineligible");
    } catch (error) {
      if (error instanceof HttpError && error.status === 422) {
        setResult("ineligible");
      } else {
        setResult(evaluateEligibility({
          institution: institution as "UFAL" | "UNEAL" | "IFAL" | "CESMAC" | "UNIT" | "FAT",
          course: course as "Administração" | "Direito" | "Engenharia Civil" | "Ciência da Computação" | "Medicina" | "Pedagogia" | "Contabilidade",
          period: normalizedPeriod,
        }));
        setErrorMessage("Nao foi possivel validar com a API agora. Resultado exibido pela regra local.");
      }
    } finally {
      setLoading(false);
    }
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
                  <p className="text-sm font-medium text-foreground">Instituição</p>
                  <Select value={institution} onValueChange={setInstitution}>
                    <SelectTrigger className="h-12 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions.map((i) => (
                        <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Curso</p>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger className="h-12 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Período</p>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="h-12 rounded-lg">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {programCatalog.periods.map((p) => (
                        <SelectItem key={p.value} value={String(p.value)}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-primary text-primary-foreground h-12 rounded-lg text-base"
                onClick={handleCheck}
                disabled={!institution || !course || !period || loading || loadingCatalogs}
              >
                <Search className="mr-2 h-5 w-5" />
                {loading || loadingCatalogs ? "Verificando..." : "Verificar Elegibilidade"}
              </Button>

              {errorMessage && (
                <p className="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{errorMessage}</p>
              )}

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
