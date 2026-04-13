import { motion } from "framer-motion";
import { ShieldCheck, Lock, Scale, PhoneCall, Globe, MapPin } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="conteudo-principal" className="bg-card py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-5xl space-y-6"
          >
            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Politica de Privacidade - Programa Primeiro Emprego
                </h1>
              </div>

              <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                <p>
                  A Secretaria de Estado do Planejamento, Gestao e Patrimonio de Alagoas (Seplag-AL) valoriza a
                  privacidade e a seguranca das informacoes dos candidatos inscritos no Programa Primeiro Emprego.
                </p>
                <p>
                  Esta Politica de Privacidade tem como objetivo informar, de forma clara e transparente, como
                  coletamos, utilizamos, armazenamos e protegemos os seus dados pessoais, em conformidade com a Lei
                  Geral de Protecao de Dados Pessoais (LGPD - Lei no 13.709/2018).
                </p>
              </div>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">1. Quais dados pessoais nos coletamos?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Para viabilizar a sua inscricao e participacao no processo seletivo, coletamos as seguintes
                categorias de dados:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                <li>
                  Dados de Identificacao e Contato: Nome completo, CPF, RG, data de nascimento, e-mail, telefone e
                  endereco.
                </li>
                <li>
                  Dados Academicos: Instituicao de ensino, curso, periodo/semestre atual e historico escolar contendo
                  o Coeficiente de Rendimento (CR).
                </li>
                <li>
                  Dados Socioeconomicos e Sensiveis (para fins de cotas): Informacoes sobre escolaridade (ensino medio
                  em escola publica ou com bolsa integral), inscricao no Cadastro Unico (CadUnico), autodeclaracao
                  indigena e laudos medicos (no caso de candidatos Pessoas com Deficiencia - PcD).
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">2. Para qual finalidade utilizamos seus dados?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Os dados coletados sao utilizados exclusivamente para as seguintes finalidades ligadas ao Programa
                Primeiro Emprego:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                <li>Realizar a sua inscricao nos editais do programa;</li>
                <li>Avaliar e validar os requisitos de participacao (matricula, periodo cursado, elegibilidade para cotas);</li>
                <li>Calcular a classificacao com base no Coeficiente de Rendimento (CR) para formacao do Banco de Talentos;</li>
                <li>
                  Entrar em contato via e-mail ou telefone para convocacao, envio de orientacoes de contratacao e avisos
                  sobre o processo seletivo;
                </li>
                <li>
                  Gerar estatisticas anonimizadas para acompanhamento e melhoria das politicas publicas de estagio do
                  Governo de Alagoas.
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">3. Com quem compartilhamos seus dados?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                A Seplag nao comercializa seus dados pessoais. O compartilhamento ocorre apenas no ambito do Poder
                Executivo Estadual, restrito as seguintes situacoes:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                <li>
                  Orgaos Solicitantes: Quando voce for selecionado do Banco de Talentos, seus dados de identificacao,
                  contato e formacao serao compartilhados com o orgao ou secretaria estadual onde voce ira estagiar,
                  para fins de formalizacao do Termo de Compromisso de Estagio (TCE).
                </li>
                <li>
                  Auditoria e Fiscalizacao: Com orgaos de controle interno e externo do Estado, quando requisitado
                  legalmente para prestacao de contas do programa.
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">4. Como protegemos e armazenamos suas informacoes?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Seus dados sao armazenados em servidores seguros do Governo do Estado de Alagoas, gerenciados pela
                Superintendencia de Tecnologia da Informacao (STI). Adotamos medidas tecnicas, administrativas e de
                seguranca da informacao para proteger seus dados contra acessos nao autorizados, perdas, alteracoes ou
                vazamentos.
              </p>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">5. Por quanto tempo mantemos seus dados?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Seus dados pessoais serao armazenados pelo tempo necessario para cumprir as finalidades descritas nesta
                politica, incluindo a duracao da validade do edital em que voce se inscreveu, o periodo do seu contrato
                de estagio (caso selecionado) e os prazos legais exigidos para guarda de documentos na administracao
                publica.
              </p>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">6. Quais sao os seus direitos?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Conforme a LGPD, voce, como titular dos dados, tem o direito de:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                <li>Confirmar a existencia de tratamento de seus dados;</li>
                <li>Acessar os dados que possuimos sobre voce;</li>
                <li>Solicitar a correcao de dados incompletos, inexatos ou desatualizados;</li>
                <li>
                  Solicitar a eliminacao de dados, ressalvadas as obrigacoes legais de guarda de documentos publicos e
                  do historico do processo seletivo;
                </li>
                <li>Obter informacoes sobre as entidades publicas com as quais compartilhamos seus dados.</li>
              </ul>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">7. Alteracoes nesta Politica</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Esta Politica de Privacidade pode passar por atualizacoes para refletir melhorias no sistema ou mudancas
                na legislacao. Recomendamos que voce visite esta pagina periodicamente para se manter informado.
              </p>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">8. Contato</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Em caso de duvidas sobre esta Politica de Privacidade ou sobre o tratamento dos seus dados no ambito do
                Programa Primeiro Emprego, entre em contato conosco atraves dos canais de atendimento oficiais da Seplag.
              </p>

              <div className="mt-5 space-y-3 rounded-xl border bg-muted/40 p-4 text-sm text-foreground md:text-base">
                <p className="font-semibold">
                  Secretaria de Estado do Planejamento, Gestao e Patrimonio de Alagoas (Seplag)
                </p>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <PhoneCall className="mt-1 h-4 w-4 shrink-0" />
                  <span>Telefone: (82) 3315-1511</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Globe className="mt-1 h-4 w-4 shrink-0" />
                  <span>Site: seplag.al.gov.br</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" />
                  <span>Endereco: Rua Dr. Cincinato Pinto, 503 - Centro, Maceio - AL, 57020-050</span>
                </div>
              </div>
            </article>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary md:text-base">
              <div className="flex items-start gap-2">
                <Lock className="mt-1 h-4 w-4 shrink-0" />
                <p>
                  Esta politica segue os principios da LGPD (Lei no 13.709/2018), com foco em transparência,
                  seguranca e respeito aos direitos dos titulares de dados.
                </p>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <Scale className="mt-1 h-4 w-4 shrink-0" />
                <p>Para solicitacoes formais, utilize sempre os canais oficiais da Seplag.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
