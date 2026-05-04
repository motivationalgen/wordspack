import { SEOHead } from '@/components/SEOHead';
import { Layout } from '@/components/Layout';
import { AdSlot } from '@/components/AdSlot';

const About = () => {
  const title = 'About Wordspack - Free Word Tools';
  const description = 'Wordspack: Collection of free online word tools for writing, gaming, learning. Fast, no signup.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Wordspack',
    description: description,
  };

  return (
    <Layout>
      <SEOHead title={title} description={description} path="/about" jsonLd={jsonLd} />
      <div className="container max-w-4xl space-y-8">
        <section className="prose prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:font-semibold max-w-none">
          <h2>What is Wordspack?</h2>
          <p>
            Wordspack is a collection of free, fast online tools for word games, writing, learning, and more. 
            No signups, no ads in the way of functionality—just clean tools that work on any device.
          </p>

          <h2>Our tools</h2>
          <ul>
            <li>Word games: scrambler, anagrams, rhymes</li>
            <li>Writing: grammar check, paraphraser, summarizer</li>
            <li>Productivity: word counter, case converter, readability</li>
            <li>Fun & learning: random words, typing test, word of the day</li>
          </ul>

          <h2>Why we built it</h2>
          <p>Scattered tools across the web are slow or paywalled. We wanted one place with everything, optimized for speed and privacy.</p>

          <h2>Technology</h2>
          <p>Built with React, Tailwind, Vite. AI-powered features coming soon.</p>

          <div className="text-center py-12">
            <p className="text-2xl font-bold text-primary mb-4">Bookmark us for your next word need!</p>
          </div>
        </section>

        <AdSlot variant="mid-content" />
      </div>
    </Layout>
  );
};

export default About;
