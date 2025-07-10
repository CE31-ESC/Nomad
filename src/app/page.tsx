import { DestinationSearchForm } from "@/components/features/destination-search/DestinationSearchForm";
import PageContainer from "@/components/shared/PageContainer";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/50">
      <Header />
      <main className="flex-grow">
        <PageContainer className="flex flex-col items-center justify-center text-center py-12 md:py-20">
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-primary tracking-tight mb-6">
              Find Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Discover and book unique accommodations worldwide with Nomad Navigator. 
              Your journey starts here.
            </p>
            <DestinationSearchForm />
          </div>
        </PageContainer>
        
        <section className="py-16 bg-card">
          <PageContainer>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose Nomad Navigator?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-lg">
                <svg data-ai-hint="globe travel" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Vast Selection</h3>
                <p className="text-muted-foreground">Access thousands of hotels and unique stays in destinations across the globe.</p>
              </div>
              <div className="p-6 rounded-lg">
                <svg data-ai-hint="secure payment" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Secure Booking</h3>
                <p className="text-muted-foreground">Book with confidence using our secure payment system and transparent pricing.</p>
              </div>
              <div className="p-6 rounded-lg">
                <svg data-ai-hint="customer support" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <h3 className="text-xl font-semibold mb-2 text-foreground">24/7 Support</h3>
                <p className="text-muted-foreground">Our dedicated support team is here to help you around the clock.</p>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      <Footer />
    </div>
  );
}
