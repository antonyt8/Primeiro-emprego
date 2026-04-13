import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import EligibilityFilter from "@/components/landing/EligibilityFilter";
import TimelineSection from "@/components/landing/TimelineSection";
import QuotaCards from "@/components/landing/QuotaCards";
import DocumentsSection from "@/components/landing/DocumentsSection";
import IndigenousProgramSection from "@/components/landing/IndigenousProgramSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="conteudo-principal">
        <HeroSection />
        <div id="elegibilidade">
          <EligibilityFilter />
        </div>
        <div id="como-funciona">
          <TimelineSection />
        </div>
        <IndigenousProgramSection />
        <div id="cotas">
          <QuotaCards />
        </div>
        <DocumentsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
