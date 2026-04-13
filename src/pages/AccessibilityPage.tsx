import { motion } from "framer-motion";
import { Accessibility, Keyboard, Contrast, ZoomIn, AudioLines, Hand, PhoneCall, Globe, MapPin } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const AccessibilityPage = () => {
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
                  <Accessibility className="h-5 w-5" />
                </span>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Acessibilidade - Programa Primeiro Emprego
                </h1>
              </div>

              <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                <p>
                  A Secretaria de Estado do Planejamento, Gestao e Patrimonio de Alagoas (Seplag-AL) tem o compromisso
                  de garantir que o portal do Programa Primeiro Emprego seja acessivel a todos os cidadaos, incluindo
                  pessoas com deficiencia (PcD).
                </p>
                <p>
                  Trabalhamos continuamente para que a nossa plataforma esteja em conformidade com as diretrizes de
                  acessibilidade digital, como o Modelo de Acessibilidade em Governo Eletronico (eMAG) e as Diretrizes
                  de Acessibilidade para Conteudo Web (WCAG), facilitando a navegacao, a compreensao e a inscricao de
                  todos os estudantes.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">1. Recursos de Acessibilidade do Portal</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Para garantir uma navegacao mais autonoma, este portal foi desenvolvido buscando suportar as seguintes
                funcionalidades e ferramentas:
              </p>

              <ul className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
                <li className="flex items-start gap-3">
                  <Keyboard className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Navegacao por Teclado:</strong> E possivel navegar por todos
                    os links, botoes e formularios do site utilizando a tecla Tab. Para retornar, utilize Shift + Tab.
                    Para confirmar uma acao, utilize Enter.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Contrast className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Alto Contraste:</strong> O site pode ser visualizado com melhor
                    legibilidade atraves das ferramentas de alto contraste nativas do seu sistema operacional ou navegador.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ZoomIn className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Tamanho da Fonte (Zoom):</strong> Voce pode aumentar ou
                    diminuir o tamanho dos textos do site utilizando os atalhos padrao do seu navegador (Ctrl + para
                    aumentar, Ctrl - para diminuir e Ctrl 0 para voltar ao tamanho original).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AudioLines className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Leitores de Tela:</strong> O codigo do site foi estruturado para
                    ser compativel com os principais leitores de tela do mercado (como NVDA, JAWS e DOSVox), utilizando
                    marcacoes semanticas que descrevem o conteudo e as imagens.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Hand className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <strong className="text-foreground">Libras (Lingua Brasileira de Sinais):</strong> Recomendamos a
                    utilizacao da suite VLibras, uma ferramenta gratuita e de codigo aberto, que traduz conteudos digitais
                    (texto, audio e video) para a Lingua Brasileira de Sinais.
                  </span>
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">2. Teclas de Atalho Padrao (Governo Federal / eMAG)</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Para facilitar a navegacao rapida, voce pode utilizar os seguintes atalhos de teclado, que seguem o
                padrao de acessibilidade do governo:
              </p>

              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                <li>Alt + 1: Ir direto para o conteudo principal da pagina.</li>
                <li>Alt + 2: Ir direto para o menu de navegacao.</li>
                <li>Alt + 3: Ir direto para o rodape do site.</li>
              </ul>

              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                (Nota: Nos navegadores Firefox, utilize Alt + Shift + numero. No Mac, utilize Control + Option + numero
                ou Command + numero).
              </p>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">3. Inclusao no Programa Primeiro Emprego</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                O Programa Primeiro Emprego e uma iniciativa inclusiva. Conforme previsto nos editais de selecao, 10%
                (dez por cento) do total das vagas ofertadas sao reservadas para estudantes com deficiencia (PcD),
                garantindo oportunidades iguais de insercao no mercado de trabalho e na administracao publica estadual.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                Durante o preenchimento da inscricao, o candidato devera sinalizar a sua condicao de PcD e anexar o
                laudo medico correspondente, conforme as regras do edital vigente.
              </p>
            </article>

            <article className="rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-semibold text-foreground">4. Encontrou alguma barreira de acessibilidade?</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                A melhoria da acessibilidade e um processo continuo. Se voce encontrou alguma dificuldade para navegar,
                ler conteudos ou preencher o formulario de inscricao em nosso site, por favor, entre em contato conosco
                para que possamos corrigir o problema o mais rapido possivel.
              </p>

              <div className="mt-5 space-y-3 rounded-xl border bg-muted/40 p-4 text-sm text-foreground md:text-base">
                <p className="font-semibold">Canais de Atendimento (Seplag):</p>
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

              <p className="mt-4 text-sm leading-7 text-primary md:text-base">
                A sua colaboracao e fundamental para construirmos um ambiente digital cada vez mais acessivel e inclusivo
                para todos os alagoanos.
              </p>
            </article>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccessibilityPage;
