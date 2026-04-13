import { useState } from "react";
import { Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav id="menu-principal" className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <Building2 className="h-6 w-6" />
          <span className="hidden sm:inline">Primeiro Emprego AL</span>
          <span className="sm:hidden">PE-AL</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#elegibilidade" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Elegibilidade</a>
          <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Como Funciona</a>
          <a href="#cotas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cotas</a>
          <Button onClick={() => navigate("/auth")} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg">
            Aceder ao Sistema
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="#elegibilidade" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Elegibilidade</a>
            <a href="#como-funciona" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Como Funciona</a>
            <a href="#cotas" className="py-2 text-sm font-medium text-muted-foreground" onClick={() => setOpen(false)}>Cotas</a>
            <Button onClick={() => { setOpen(false); navigate("/auth"); }} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg w-full">
              Aceder ao Sistema
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
