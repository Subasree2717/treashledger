import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent! We\'ll get back to you soon.');
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-16 px-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground uppercase text-center tracking-[0.1em]">Contact Us</h1>
        <p className="text-muted-foreground mt-2 text-center">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Mail, label: 'Email', value: 'support@treashledger.app' },
          { icon: Phone, label: 'Phone', value: '+91 1234567891' },
          { icon: MapPin, label: 'Address', value: 'chennai, Tamil Nadu' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-5 flex items-start gap-3 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl border border-border p-8 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Send a Message</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder="What is this about?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
            placeholder="Tell us how we can help..."
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl gradient-primary text-white hover:opacity-90 transition-all disabled:opacity-50 btn-glow"
        >
          <Send className="h-4 w-4" /> {sending ? 'Sending...' : 'Send Message'}
        </button>
      </motion.form>
    </div>
  );
}
