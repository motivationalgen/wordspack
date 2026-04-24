import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "./pages/NotFound.tsx";

const Home = lazy(() => import("./pages/Home"));
const WordScrambler = lazy(() => import("./pages/WordScrambler"));
const RandomWordGenerator = lazy(() => import("./pages/RandomWordGenerator"));
const WordCounter = lazy(() => import("./pages/WordCounter"));
const WordOfTheDay = lazy(() => import("./pages/WordOfTheDay"));
const BrandNameGenerator = lazy(() => import("./pages/BrandNameGenerator"));
const TypingSpeedTest = lazy(() => import("./pages/TypingSpeedTest"));
const ParaphrasingTool = lazy(() => import("./pages/ParaphrasingTool"));
const GrammarChecker = lazy(() => import("./pages/GrammarChecker"));
const TextSummarizer = lazy(() => import("./pages/TextSummarizer"));
const SynonymFinder = lazy(() => import("./pages/SynonymFinder"));
const AnagramSolver = lazy(() => import("./pages/AnagramSolver"));
const RhymeGenerator = lazy(() => import("./pages/RhymeGenerator"));
const CaseConverter = lazy(() => import("./pages/CaseConverter"));
const ReadabilityChecker = lazy(() => import("./pages/ReadabilityChecker"));
const SentenceRewriter = lazy(() => import("./pages/SentenceRewriter"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="container py-20 text-center text-muted-foreground text-sm">Loading…</div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/wordspack" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/word-scrambler" element={<WordScrambler />} />
                <Route path="/random-word-generator" element={<RandomWordGenerator />} />
                <Route path="/word-counter" element={<WordCounter />} />
                <Route path="/word-of-the-day" element={<WordOfTheDay />} />
                <Route path="/brand-name-generator" element={<BrandNameGenerator />} />
                <Route path="/typing-speed-test" element={<TypingSpeedTest />} />
                <Route path="/paraphrasing-tool" element={<ParaphrasingTool />} />
                <Route path="/grammar-checker" element={<GrammarChecker />} />
                <Route path="/text-summarizer" element={<TextSummarizer />} />
                <Route path="/synonym-antonym-finder" element={<SynonymFinder />} />
                <Route path="/anagram-solver" element={<AnagramSolver />} />
                <Route path="/rhyme-generator" element={<RhymeGenerator />} />
                <Route path="/case-converter" element={<CaseConverter />} />
                <Route path="/readability-checker" element={<ReadabilityChecker />} />
                <Route path="/sentence-rewriter" element={<SentenceRewriter />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/Elora"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
