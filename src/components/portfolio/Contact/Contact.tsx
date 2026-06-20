import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { Github, Linkedin, Twitter } from "@/components/portfolio/BrandIcons";
import circuitLeaf from "@/assets/circuit-leaf.jpg";
import { useLanguage } from "@/context/language-context";

export default function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const cards = [
    {
      Icon: MapPin,
      label: t("contact_location_label"),
      value: "Angola, Ícolo e Bengo, Sequele",
      href: "https://www.google.com/maps/search/?api=1&query=Angola,+Ícolo+e+Bengo,+Sequele",
    },
    {
      Icon: Mail,
      label: t("contact_email_label"),
      value: "2001vivaldo@gmail.com",
      href: "mailto:2001vivaldo@gmail.com",
    },
    {
      Icon: Phone,
      label: t("contact_whatsapp_label"),
      value: "(+244) 928 994 233",
      href: "https://wa.me/244928994233",
    },
  ];

  const socials = [
    { Icon: Github, label: "GitHub", href: "https://github.com/Vivaldo-Roque/" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/vivaldoroque/" },
    { Icon: Twitter, label: "Twitter", href: "https://twitter.com/vivaldo_roque" },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-32"
      aria-label="Contact"
    >
      <div className="absolute inset-0" aria-hidden>
        <img
          src={circuitLeaf}
          alt=""
          aria-hidden
          loading="lazy"
          className="h-full w-full object-cover opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="max-w-2xl"
        >
          <p className="font-mono-code text-sm text-moss">// chapter_05</p>
          <h2 className="font-display mt-3 text-4xl font-bold sm:text-6xl">
            {t("contact_title").split(" ")[0]} {t("contact_title").split(" ").slice(1, -1).join(" ")}{" "}
            <span className="text-gradient-leaf">{t("contact_title").split(" ").slice(-1)[0]}</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            {t("contact_subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <ul className="space-y-4">
              {cards.map(({ Icon, label, value, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    className="group glass flex items-center gap-4 rounded-2xl p-5 transition hover:glow-border"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-moss/10 text-moss transition group-hover:bg-moss/20 group-hover:text-lime">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-mono-code block text-xs uppercase tracking-widest text-muted-foreground">
                        {label}
                      </span>
                      <span className="block truncate text-foreground transition group-hover:text-lime">
                        {value}
                      </span>
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-moss/30 bg-surface/60 text-foreground transition hover:border-moss hover:bg-moss/10 hover:text-lime"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 4000);
            }}
            className="glass space-y-5 rounded-2xl p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="name"
                className="font-mono-code text-xs uppercase tracking-widest text-muted-foreground"
              >
                {t("contact_form_name")}
              </label>
              <input
                id="name"
                required
                type="text"
                className="mt-2 w-full rounded-lg border border-moss/20 bg-background/60 px-4 py-3 text-foreground outline-none transition focus:border-moss focus:shadow-[0_0_0_4px_rgba(46,204,113,0.15)]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="font-mono-code text-xs uppercase tracking-widest text-muted-foreground"
              >
                {t("contact_form_email")}
              </label>
              <input
                id="email"
                required
                type="email"
                className="mt-2 w-full rounded-lg border border-moss/20 bg-background/60 px-4 py-3 text-foreground outline-none transition focus:border-moss focus:shadow-[0_0_0_4px_rgba(46,204,113,0.15)]"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="font-mono-code text-xs uppercase tracking-widest text-muted-foreground"
              >
                {t("contact_form_message")}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-lg border border-moss/20 bg-background/60 px-4 py-3 text-foreground outline-none transition focus:border-moss focus:shadow-[0_0_0_4px_rgba(46,204,113,0.15)]"
              />
            </div>
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-lime hover:shadow-[0_0_15px_-5px_var(--moss)]"
            >
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              {sent ? t("contact_form_success") : t("contact_form_send")}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
