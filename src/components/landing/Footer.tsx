import { Building2, Mail, Phone } from "lucide-react";

// Ajuste estes tamanhos livremente conforme a necessidade do layout.
const FOOTER_LOGO_SIZE_CLASS = "max-w-[150px] md:max-w-[200px]";
const FOOTER_LOGO_MARGIN_CLASS = "mb-8";

const Footer = () => {
  return (
    <footer id="rodape-site" className="bg-primary text-primary-foreground">
      <div className="container py-10">
        <div className={`${FOOTER_LOGO_MARGIN_CLASS} flex justify-center`}>
          <img
            src="https://primeiroemprego.al.gov.br/img/logo-governo-branca.png"
            alt="Logo do Governo de Alagoas"
            className={`h-auto w-full ${FOOTER_LOGO_SIZE_CLASS}`}
            loading="lazy"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="text-lg font-bold">Primeiro Emprego AL</span>
            </div>
            <p className="text-sm opacity-80">
              Programa do Governo do Estado de Alagoas para inserção de jovens universitários no mercado de trabalho.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
            <h4 className="font-semibold">Links Úteis</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="https://primeiroemprego.al.gov.br" className="hover:opacity-100 transition-opacity">Edital Vigente</a></li>
              <li><a href="/faq" className="hover:opacity-100 transition-opacity">Perguntas Frequentes</a></li>
              <li><a href="/politica-de-privacidade" className="hover:opacity-100 transition-opacity">Política de Privacidade</a></li>
              <li><a href="/acessibilidade" className="hover:opacity-100 transition-opacity">Acessibilidade</a></li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5">
            <h4 className="font-semibold">Contacto</h4>
            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                primeiroemprego@seplag.al.gov.br
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (82) 3315-1234
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} SEPLAG/STI — Governo do Estado de Alagoas. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
