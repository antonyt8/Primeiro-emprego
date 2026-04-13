import { motion } from "framer-motion";
import { CircleHelp, FileCheck2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqItems = [
  {
    question: "1. O que é o Programa Primeiro Emprego?",
    answer: (
      <p>
        O Programa Primeiro Emprego é uma iniciativa de seleção de estágio não obrigatório que tem como objetivo
        alocar estudantes do ensino superior para atuar nos órgãos do Poder Executivo do Estado de Alagoas,
        proporcionando experiência prática na administração pública.
      </p>
    ),
  },
  {
    question: "2. Quem pode participar do programa?",
    answer: (
      <div className="space-y-3">
        <p>Podem participar estudantes universitários que atendam aos seguintes critérios:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Estar matriculado em instituições de ensino superior alagoanas e/ou com sede em Alagoas;</li>
          <li>Estar cursando na modalidade presencial ou a distância (EAD);</li>
          <li>
            Estar cursando, no mínimo, o segundo ano (para cursos de periodicidade anual) ou o terceiro semestre
            (para cursos de periodicidade semestral).
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: "3. Como e onde faço a minha inscrição?",
    answer: (
      <p>
        A inscrição é feita exclusivamente de forma online através do site oficial do programa: primeiroemprego.al.gov.br.
        Para se inscrever, é necessário aguardar a abertura de um edital e clicar no botão "Inscreva-se aqui" na página inicial.
      </p>
    ),
  },
  {
    question: "4. Como funciona o processo seletivo? Tem prova?",
    answer: (
      <p>
        Não há prova. O processo seletivo é totalmente eletrônico e o principal critério de seleção é o Coeficiente de
        Rendimento (CR). O CR é o índice que mede o desempenho acadêmico do estudante ao longo do curso, ao fim de cada
        período letivo.
      </p>
    ),
  },
  {
    question: "5. Como são distribuídas as vagas? Existem cotas?",
    answer: (
      <div className="space-y-3">
        <p>
          Sim, o programa tem um forte caráter de inclusão social. O quantitativo total de vagas ofertadas nos processos
          seletivos é distribuído nas seguintes categorias:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>40% para estudantes que cursaram todo o ensino médio em escolas públicas ou em escolas particulares com bolsa integral;</li>
          <li>40% para estudantes inscritos no CadÚnico;</li>
          <li>10% para Pessoas com Deficiência (PcD);</li>
          <li>10% para ampla concorrência.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "6. O que é o Banco de Talentos? Fui classificado, já estou contratado?",
    answer: (
      <p>
        A aprovação e classificação no processo seletivo servem para compor o Banco de Talentos. Estar no Banco de
        Talentos significa que você está habilitado para ser chamado, mas não garante contratação imediata. As vagas são
        disponibilizadas gradativamente, de acordo com a necessidade e demanda de cada órgão do Governo.
      </p>
    ),
  },
  {
    question: "7. Como os órgãos selecionam os estagiários do Banco de Talentos?",
    answer: (
      <p>
        Os órgãos estaduais solicitam estagiários de cursos específicos para a Seplag. A partir desse pedido, o sistema
        eletrônico automaticamente envia os candidatos mais bem colocados no Banco de Talentos, obedecendo rigorosamente
        aos percentuais de cotas e ampla concorrência previstos no edital.
      </p>
    ),
  },
  {
    question: "8. Como vou saber se fui convocado(a) para assumir uma vaga?",
    answer: (
      <p>
        Caso o seu perfil seja selecionado para uma vaga solicitada por algum órgão, você receberá um e-mail de
        notificação (no endereço cadastrado na inscrição) contendo todas as instruções para a contratação. É fundamental
        manter seus dados de contato atualizados e conferir sua caixa de entrada e spam.
      </p>
    ),
  },
  {
    question: "9. O que é o Programa Primeiro Emprego Indígena?",
    answer: (
      <p>
        É uma modalidade do programa com seleção exclusiva voltada para os alunos do Curso de Licenciatura Intercultural
        Indígena (CLIND) da Universidade Estadual de Alagoas (UNEAL). O processo também é totalmente eletrônico e seleciona
        pelo Coeficiente de Rendimento (CR), buscando contribuir para a valorização da educação e das comunidades indígenas
        em Alagoas.
      </p>
    ),
  },
  {
    question: "10. Onde encontro os editais e os resultados das seleções?",
    answer: (
      <p>
        Todos os documentos, incluindo os editais abertos, editais anteriores e as listas de candidatos habilitados
        (Banco de Talentos) e estagiários contratados, ficam disponíveis permanentemente no site oficial do programa,
        nas seções "Editais", "Documentos" e "Banco de Talentos".
      </p>
    ),
  },
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="conteudo-principal" className="bg-card py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-8 rounded-2xl border bg-background p-6 shadow-sm md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CircleHelp className="h-5 w-5" />
                </span>
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  Perguntas Frequentes (FAQ) - Programa Primeiro Emprego
                </h1>
              </div>
              <p className="text-muted-foreground">
                Nesta seção, você encontra as respostas para as principais dúvidas sobre o Programa Primeiro Emprego do
                Governo de Alagoas, gerenciado pela Seplag.
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
                <FileCheck2 className="h-4 w-4" />
                Base oficial de orientações para inscrição, seleção e convocação
              </div>

              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger className="text-left text-base hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;
