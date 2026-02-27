import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SearchInput from "@/components/SearchInput";
import NetworkGraph from "@/components/NetworkGraph";
import RiskScore from "@/components/RiskScore";
import ResultsSidebar from "@/components/ResultsSidebar";
import LoadingAnimation from "@/components/LoadingAnimation";
import { analyzeUsername, type AnalysisResult } from "@/lib/analyzer";

const Index = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = useCallback((username: string) => {
    setIsLoading(true);
    setResult(null);
    // Simulate network delay
    setTimeout(() => {
      setResult(analyzeUsername(username));
      setIsLoading(false);
    }, 1800);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header area */}
      <div className={`w-full transition-all duration-500 ${result ? "pt-6 pb-4" : "pt-[20vh] pb-8"}`}>
        <div className="max-w-5xl mx-auto px-6">
          <SearchInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {isLoading && <LoadingAnimation />}
      </AnimatePresence>

      {/* Results */}
      {result && !isLoading && (
        <div className="flex-1 max-w-7xl mx-auto px-6 pb-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Graph */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <NetworkGraph nodes={result.nodes} links={result.links} />
              <RiskScore result={result} />
            </div>
            {/* Right: Sidebar details */}
            <div className="lg:col-span-7">
              <ResultsSidebar result={result} />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-4 text-center">
        <p className="text-[11px] text-muted-foreground/60">
          Simulated Privacy Audit Prototype. No real data scraping is performed.
        </p>
      </footer>
    </div>
  );
};

export default Index;
