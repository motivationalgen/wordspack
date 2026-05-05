import { SEOHead } from '@/components/SEOHead';
import { AdSlot } from '@/components/AdSlot';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const title = 'Contact Us - Wordspack';
  const description = 'Contact Wordspack support, feature requests, or issues.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Wordspack Contact',
    description: description,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In prod, integrate EmailJS or backend
    console.log('Contact form:', formData);
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead title={title} description={description} path="/contact" jsonLd={jsonLd} />
      <div className="container max-w-2xl space-y-8">
        {submitted ? (
          <div className="text-center p-12 bg-secondary/50 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Thanks!</h2>
            <p>We'll get back to you soon.</p>
            <Button asChild className="mt-6">
              <a href="/">Back to Home!</a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Textarea
              placeholder="Your message"
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        )}

        <section className="prose prose-headings:text-foreground prose-p:text-foreground/80 max-w-none text-sm">
          <h3>Or reach out:</h3>
          <ul>
            <li><a href="mailto:hello@wordspack.com">hello@wordspack.com</a></li>
            <li>Follow on social (coming soon)</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Contact;
