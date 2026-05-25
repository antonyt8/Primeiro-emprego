import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useNavigate } from "react-router-dom";
import { COURSES, INSTITUTIONS } from "@/constants/program";
import { authApi } from "@/api/authApi";
import { HttpError } from "@/api/http";
import { useSession } from "@/lib/session";

type FieldStatus = "idle" | "valid" | "invalid";

interface FieldState {
  value: string;
  status: FieldStatus;
  error?: string;
}

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validateCPF = (v: string) => /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(v);
const validatePassword = (v: string) => v.length >= 8;

const FieldIndicator = ({ status }: { status: FieldStatus }) => {
  if (status === "valid") return <Check className="h-4 w-4 text-success" />;
  if (status === "invalid") return <AlertCircle className="h-4 w-4 text-destructive" />;
  return null;
};

const fieldBorder = (status: FieldStatus) => {
  if (status === "valid") return "border-success focus-visible:ring-success";
  if (status === "invalid") return "border-destructive focus-visible:ring-destructive";
  return "";
};

const extractApiErrorMessage = (error: unknown) => {
  if (!(error instanceof HttpError)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return "Nao foi possivel concluir a operacao.";
  }

  if (error.payload && typeof error.payload === "object") {
    const payload = error.payload as { message?: string; errors?: Record<string, string[]>; reason?: string };
    if (payload.reason) return payload.reason;
    if (payload.message) return payload.message;

    const firstError = payload.errors && Object.values(payload.errors)[0]?.[0];
    if (firstError) return firstError;
  }

  return `Erro ${error.status}.`;
};

const AuthPage = () => {
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "register">(location.pathname === "/cadastro" ? "register" : "login");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Login fields
  const [loginEmail, setLoginEmail] = useState<FieldState>({ value: "", status: "idle" });
  const [loginPassword, setLoginPassword] = useState<FieldState>({ value: "", status: "idle" });

  // Register fields
  const [regName, setRegName] = useState<FieldState>({ value: "", status: "idle" });
  const [regCPF, setRegCPF] = useState<FieldState>({ value: "", status: "idle" });
  const [regEmail, setRegEmail] = useState<FieldState>({ value: "", status: "idle" });
  const [regInstitution, setRegInstitution] = useState("");
  const [regCourse, setRegCourse] = useState("");
  const [regPeriod, setRegPeriod] = useState("");
  const [regPassword, setRegPassword] = useState<FieldState>({ value: "", status: "idle" });
  const [regConfirm, setRegConfirm] = useState<FieldState>({ value: "", status: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setIsAuthenticated } = useSession();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    setMode(location.pathname === "/cadastro" ? "register" : "login");
    setStep(1);
  }, [location.pathname]);

  const validateField = useCallback((value: string, validator: (v: string) => boolean, errorMsg: string): FieldState => {
    if (!value) return { value, status: "idle" };
    return validator(value)
      ? { value, status: "valid" }
      : { value, status: "invalid", error: errorMsg };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    const emailValid = validateEmail(loginEmail.value);
    const passValid = loginPassword.value.length > 0;
    if (!emailValid || !passValid) return;

    try {
      setSubmitting(true);
      await authApi.login({
        email: loginEmail.value.trim(),
        password: loginPassword.value,
      });
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      setApiError(extractApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const canAdvanceStep = () => {
    if (step === 1) return regName.value.length >= 2 && regCPF.status === "valid" && regEmail.status === "valid";
    if (step === 2) return regInstitution && regCourse && regPeriod;
    if (step === 3) return regPassword.status === "valid" && regConfirm.status === "valid";
    return false;
  };

  const handleRegisterNext = async () => {
    setApiError("");
    setSuccessMessage("");
    if (!canAdvanceStep()) return;
    if (step < totalSteps) setStep(step + 1);
    else {
      try {
        setSubmitting(true);
        const registerEmail = regEmail.value.trim();
        const registerPassword = regPassword.value;

        await authApi.register({
          name: regName.value.trim(),
          cpf: regCPF.value.replace(/\D/g, ""),
          email: registerEmail,
          password: registerPassword,
          password_confirmation: regConfirm.value,
        });

        setSuccessMessage("Conta criada com sucesso. Sessao iniciada.");

        setIsAuthenticated(true);

        navigate("/dashboard");
      } catch (error) {
        setApiError(extractApiErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div id="conteudo-principal" data-main-content className="flex min-h-screen">
      {/* Left panel - branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md mx-auto space-y-8"
        >
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10" />
            <span className="text-2xl font-bold">Primeiro Emprego AL</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            O seu futuro profissional começa aqui.
          </h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Conectamos estudantes universitários de Alagoas a oportunidades reais de estágio no serviço público estadual.
          </p>
          <div className="flex gap-6 pt-4">
            <div className="rounded-xl bg-primary-foreground/10 p-4">
              <p className="text-2xl font-bold">2.500+</p>
              <p className="text-sm opacity-70">Vagas</p>
            </div>
            <div className="rounded-xl bg-primary-foreground/10 p-4">
              <p className="text-2xl font-bold">45+</p>
              <p className="text-sm opacity-70">Órgãos</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 text-primary font-bold text-lg mb-4">
            <Building2 className="h-6 w-6" />
            Primeiro Emprego AL
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
                  <p className="text-muted-foreground mt-1">Aceda à sua conta para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {apiError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>}
                  {successMessage && <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">{successMessage}</p>}
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium text-foreground">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className={`pl-10 pr-10 h-12 rounded-lg ${fieldBorder(loginEmail.status)}`}
                        value={loginEmail.value}
                        onChange={(e) => setLoginEmail(validateField(e.target.value, validateEmail, "E-mail inválido"))}
                        required
                      />
                      <div className="absolute right-3 top-3.5">
                        <FieldIndicator status={loginEmail.status} />
                      </div>
                    </div>
                    {loginEmail.status === "invalid" && (
                      <p className="text-xs text-destructive">{loginEmail.error}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-sm font-medium text-foreground">Palavra-passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-12 rounded-lg"
                        value={loginPassword.value}
                        onChange={(e) => setLoginPassword({ value: e.target.value, status: e.target.value ? "valid" : "idle" })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-primary hover:underline">
                      Esqueceu a palavra-passe?
                    </button>
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-base">
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Não tem conta?{" "}
                  <button className="text-primary font-medium hover:underline" onClick={() => { setMode("register"); navigate("/cadastro"); }}>
                    Criar conta
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
                  <p className="text-muted-foreground mt-1">Passo {step} de {totalSteps}</p>
                  <Progress value={progress} className="mt-3 h-2" />
                </div>

                {apiError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>}
                {successMessage && <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">{successMessage}</p>}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="register-name" className="text-sm font-medium text-foreground">Nome completo</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-name"
                            placeholder="Seu nome completo"
                            className={`pl-10 pr-10 h-12 rounded-lg ${fieldBorder(regName.status)}`}
                            value={regName.value}
                            onChange={(e) => setRegName(validateField(e.target.value, (v) => v.trim().length >= 2, "Nome deve ter pelo menos 2 caracteres"))}
                          />
                          <div className="absolute right-3 top-3.5">
                            <FieldIndicator status={regName.status} />
                          </div>
                        </div>
                        {regName.status === "invalid" && <p className="text-xs text-destructive">{regName.error}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="register-cpf" className="text-sm font-medium text-foreground">CPF</label>
                        <div className="relative">
                          <Input
                            id="register-cpf"
                            placeholder="000.000.000-00"
                            className={`pr-10 h-12 rounded-lg ${fieldBorder(regCPF.status)}`}
                            value={regCPF.value}
                            onChange={(e) => setRegCPF(validateField(e.target.value, validateCPF, "CPF inválido (ex: 123.456.789-00)"))}
                          />
                          <div className="absolute right-3 top-3.5">
                            <FieldIndicator status={regCPF.status} />
                          </div>
                        </div>
                        {regCPF.status === "invalid" && <p className="text-xs text-destructive">{regCPF.error}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="register-email" className="text-sm font-medium text-foreground">E-mail</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="seu@email.com"
                            className={`pl-10 pr-10 h-12 rounded-lg ${fieldBorder(regEmail.status)}`}
                            value={regEmail.value}
                            onChange={(e) => setRegEmail(validateField(e.target.value, validateEmail, "E-mail inválido"))}
                          />
                          <div className="absolute right-3 top-3.5">
                            <FieldIndicator status={regEmail.status} />
                          </div>
                        </div>
                        {regEmail.status === "invalid" && <p className="text-xs text-destructive">{regEmail.error}</p>}
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="register-institution" className="text-sm font-medium text-foreground">Instituição de Ensino</label>
                        <Select value={regInstitution} onValueChange={setRegInstitution}>
                          <SelectTrigger id="register-institution" className="h-12 rounded-lg">
                            <SelectValue placeholder="Selecione a instituição" />
                          </SelectTrigger>
                          <SelectContent>
                            {INSTITUTIONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="register-course" className="text-sm font-medium text-foreground">Curso</label>
                        <Select value={regCourse} onValueChange={setRegCourse}>
                          <SelectTrigger id="register-course" className="h-12 rounded-lg">
                            <SelectValue placeholder="Selecione o curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {COURSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="register-period" className="text-sm font-medium text-foreground">Período atual</label>
                        <Select value={regPeriod} onValueChange={setRegPeriod}>
                          <SelectTrigger id="register-period" className="h-12 rounded-lg">
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}º Período</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="register-password" className="text-sm font-medium text-foreground">Palavra-passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            className={`pl-10 pr-10 h-12 rounded-lg ${fieldBorder(regPassword.status)}`}
                            value={regPassword.value}
                            onChange={(e) => {
                              const ps = validateField(e.target.value, validatePassword, "Mínimo 8 caracteres");
                              setRegPassword(ps);
                              if (regConfirm.value) {
                                setRegConfirm(validateField(regConfirm.value, (v) => v === e.target.value, "As palavras-passe não coincidem"));
                              }
                            }}
                          />
                          <div className="absolute right-3 top-3.5">
                            <FieldIndicator status={regPassword.status} />
                          </div>
                        </div>
                        {regPassword.status === "invalid" && <p className="text-xs text-destructive">{regPassword.error}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="register-password-confirm" className="text-sm font-medium text-foreground">Confirmar palavra-passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="register-password-confirm"
                            type="password"
                            placeholder="Repita a palavra-passe"
                            className={`pl-10 pr-10 h-12 rounded-lg ${fieldBorder(regConfirm.status)}`}
                            value={regConfirm.value}
                            onChange={(e) => setRegConfirm(validateField(e.target.value, (v) => v === regPassword.value, "As palavras-passe não coincidem"))}
                          />
                          <div className="absolute right-3 top-3.5">
                            <FieldIndicator status={regConfirm.status} />
                          </div>
                        </div>
                        {regConfirm.status === "invalid" && <p className="text-xs text-destructive">{regConfirm.error}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="h-12 rounded-lg">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar
                    </Button>
                  )}
                  <Button
                    onClick={handleRegisterNext}
                    disabled={!canAdvanceStep() || submitting}
                    className="flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg text-base disabled:opacity-50"
                  >
                    {step < totalSteps ? "Próximo" : "Criar Conta"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Já tem conta?{" "}
                  <button className="text-primary font-medium hover:underline" onClick={() => { setMode("login"); setStep(1); navigate("/login"); }}>
                    Entrar
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
