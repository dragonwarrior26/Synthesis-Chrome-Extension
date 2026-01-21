import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />

      <footer className="py-12 border-t border-white/10 bg-black">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Synthesis Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-semibold text-white">Synthesis</span>
            </div>

            <div className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} Synthesis. All rights reserved.
            </div>

            <div className="flex gap-6 text-sm text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="mailto:support@synthesisext.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
