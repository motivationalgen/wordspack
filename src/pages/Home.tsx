import { Link } from "react-router-dom";
import { TOOLS } from "@/lib/tools";
import { SEOHead } from "@/components/SEOHead";
import { AdSlot } from "@/components/AdSlot";
import { RecentActivity } from "@/components/RecentActivity";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FAQ } from "@/components/FAQ";
import { Layout } from "@/components/Layout";

import { Logo } from "@/components/Logo";

const Home = () => {
  return (
    <Layout>

        <SEOHead
        title="Wordspack — Smart tools for words, writing, and creativity"
        description="Free online word tools: word scrambler, random word generator, word counter, word of the day, brand name generator, and typing speed test."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Wordspack",
          url: "/",
          potentialAction: {
            "@type": "SearchAction",
            target: "/{tool}",
          },
        }}
      />
     

      <section className="container pt-6 pb-10">
        <div className="rounded-[20px] bg-gradient-hero text-primary-foreground p-8 sm:p-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Logo className="h-6 w-6 text-primary-foreground opacity-90" />
            <p className="uppercase tracking-[0.2em] text-xs font-semibold opacity-80">Wordspack</p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-3">
            Smart tools for words, writing, and creativity
          </h1>
          <p className="max-w-xl mx-auto text-primary-foreground/85 text-base sm:text-lg">
            15+ free, fast, mobile-first tools to help you write better, think faster, and create smarter — no signup,
            no fluff.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/word-scrambler">
                Try Word Scrambler <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/typing-speed-test">Test your typing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container">
        <h2 className="text-xl font-semibold mb-4">All tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <Link key={t.slug} to={t.path} className="tool-card">
              <div className="text-2xl">{t.emoji}</div>
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.short}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="container">
        <AdSlot variant="in-tool" />
      </div>

      <section className="container">
        <RecentActivity />
      </section>

      <section className="container mt-10 prose prose-sm sm:prose-base max-w-3xl">
        <h2 className="text-xl font-semibold">About Wordspack</h2>
        <p>
          Wordspack is a collection of free online word tools designed to help you write better, think faster, and
          create smarter. From word scramblers to typing tests and brand name generators, everything is built for
          speed and simplicity. There's no account to create, no popups, and no waiting on a server — every tool runs
          right in your browser.
        </p>
        <p>
          Whether you're a student polishing an essay, a writer hunting for inspiration, a teacher designing classroom
          games, a startup founder searching for the perfect brand name, or a gamer trying to crack today's Wordle,
          Wordspack has a tool that fits. The interface is the same on every page, so you only need to learn it once.
        </p>
        <p>
          Bookmark the homepage and come back any time. Your recent activity is saved in your browser session for two
          hours, so you can pick up exactly where you left off.
        </p>

        <FAQ
          items={[
            {
              question: "Are these word tools really free?",
              answer:
                "Yes, every tool on Wordspack is completely free to use. We do not require signups, subscriptions, or any payment to access full functionality.",
            },
            {
              question: "Is my data private?",
              answer:
                "Absolutely. All our tools run entirely in your web browser. This means the text you type or the words you generate never leave your device and are never stored on our servers.",
            },
            {
              question: "Do I need to install anything?",
              answer:
                "No. Wordspack is a web-based suite. As long as you have a modern web browser and an internet connection, you can use all our tools instantly.",
            },
            {
              question: "Can I use Wordspack on my phone?",
              answer:
                "Yes! Wordspack is built with a mobile-first design, ensuring a smooth and responsive experience on smartphones, tablets, and desktops alike.",
            },
          ]}
        />
      </section>
    </Layout>
  );
};

export default Home;
