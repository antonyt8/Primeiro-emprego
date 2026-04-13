import { Users } from "lucide-react";

const IndigenousProgramSection = () => {
  return (
    <section id="programa-indigena" className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Primeiro Emprego Indígena
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              O Programa Primeiro Emprego Indígena é uma seleção exclusiva para alunos do Curso de Licenciatura Intercultural Indígena (CLIND) da Universidade Estadual de Alagoas (UNEAL).
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Processo 100% Eletrônico
                  </h3>
                  <p className="text-muted-foreground">
                    Nosso processo de seleção é totalmente eletrônico, garantindo transparência e segurança para todos os candidatos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary text-primary-foreground font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Critério Justo e Transparente
                  </h3>
                  <p className="text-muted-foreground">
                    Nosso critério de seleção é o Coeficiente de Rendimento (CR), que busca valorizar o desempenho acadêmico dos estudantes.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-foreground font-medium">
                Não perca a chance de participar desse programa exclusivo e contribuir para a valorização da educação indígena em Alagoas.
              </p>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:flex items-center justify-center">
            <img 
              src="https://s2-g1.glbimg.com/gKHrAEMn50IA_gVZHaR9M-PECUI=/0x0:1280x853/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2025/y/B/utYpOQQeAVr11PYqbTRw/whatsapp-image-2024-04-22-at-14.22.26-1-.jpeg" 
              alt="Estudantes do CLIND - Licenciatura Intercultural Indígena" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndigenousProgramSection;
