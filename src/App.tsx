/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideFacebook, Calendar, MapPin, Music, Sunset, Star, ChevronDown, LucideInstagram, Mail, Phone, Users, X, Globe, Lock } from "lucide-react";
import droneImage from "./assets/images/regenerated_image_1779188638766.png";
import GmailConsole from "./components/GmailConsole";
import { getAccessToken } from "./lib/firebase";
import { sendGmailMessage } from "./services/gmail";

const IMAGES = {
  hero: "/hero.png",
  aperitivo: "/aperitivo.png",
  poolSide: "/poolside.jpg",
  villa: "/villa.jpg",
  party: "/party.jpg",
  drone: droneImage,
};

type Language = "IT" | "EN" | "DE";

function VillaLeopardiLogo({ isDarkBg = false, size = "normal" }: { isDarkBg?: boolean, size?: "normal" | "large" | "footer" }) {
  const textColor = isDarkBg ? "text-brand-primary animate-pulse-slow" : "text-brand-contrast";
  const starColor = isDarkBg ? "text-brand-primary fill-brand-primary" : "text-brand-contrast fill-brand-contrast";

  const labelSize = size === "large" 
    ? "text-[12px] md:text-[14px] tracking-[0.55em]" 
    : size === "footer"
    ? "text-[10px] tracking-[0.5em]"
    : "text-[9px] tracking-[0.45em]";
    
  const titleSize = size === "large" 
    ? "text-2xl md:text-3xl tracking-[0.35em] font-light" 
    : size === "footer"
    ? "text-base tracking-[0.3em] font-light"
    : "text-xs tracking-[0.25em] font-light";
    
  const starSize = size === "large" ? 12 : size === "footer" ? 8 : 7;
  const spacing = size === "large" ? "gap-1 mt-3" : "gap-0.5 mt-1.5";

  return (
    <div className={`flex flex-col items-center justify-center leading-none text-center select-none font-serif ${textColor}`}>
      <span className={`${labelSize} uppercase`}>VILLA</span>
      <span className={`${titleSize} uppercase mt-1`}>LEOPARDI</span>
      <div className={`flex ${spacing} justify-center items-center`}>
        {[1, 2, 3, 4].map((s) => (
          <Star key={s} size={starSize} className={`${starColor} stroke-none`} />
        ))}
        <span className="font-sans font-bold leading-none select-none ml-1" style={{ fontSize: `${starSize * 1.15}px` }}>S</span>
      </div>
    </div>
  );
}

function VLMonogram({ isDarkBg = false, size = "md" }: { isDarkBg?: boolean, size?: "sm" | "md" | "lg" }) {
  const textColor = isDarkBg ? "text-brand-primary border-brand-primary" : "text-brand-primary border-brand-primary/40";
  const containerClasses = size === "sm" 
    ? "w-8 h-8 text-[10px]" 
    : size === "lg" 
    ? "w-16 h-16 text-xl" 
    : "w-12 h-12 text-base";

  return (
    <div className={`rounded-full border flex items-center justify-center font-serif leading-none select-none shrink-0 ${textColor} ${containerClasses}`}>
      <span className="relative -translate-x-[2px] -translate-y-[1px]">V</span>
      <span className="relative translate-x-[2px] translate-y-[2px] italic font-semibold">L</span>
    </div>
  );
}

const TRANSLATIONS = {
  IT: {
    nav: {
      about: "L'Evento",
      gallery: "Galleria",
      booking: "Prenota",
      reservations: "Prenotazioni",
      gmail: "Console Gmail"
    },
    hero: {
      subtitle: "Leopardi Signature Events",
      title1: "Sunset",
      title2: "Table",
      desc: "poolside experience",
    },
    about: {
      badge: "Sunset Table 2026",
      title: "Dove il gusto incontra",
      titleItalic: "la luce del tramonto.",
      desc1: "Villa Leopardi presenta una serata esclusiva pensata per accompagnare il calare del sole con eleganza e sapori di mare.",
      desc2: "Un'esperienza gastronomica d'autore avvolta dall'atmosfera magica dei nostri giardini, tra il riverbero della piscina a sfioro e le ultime luci del giorno.",
      menuTitle: "Menù della",
      menuSerata: "serata",
      menuItems: [
        "Selezione di crudo di pesce in abbinamento a calice di Champagne Pannier",
        "Risotto ai frutti di mare",
        "Dessert finale"
      ],
      experienceBadge: "4-Star Superior Experience"
    },
    features: [
      { label: "Lounge Music", desc: "DJ Set & Vibrazioni" },
      { label: "Tramonto", desc: "Poolside View" },
      { label: "Esclusivo", desc: "Max 50 Posti" },
      { label: "Data", desc: "20 Giugno 2026" },
    ],
    gallery: {
      badge: "Visual Moments",
      title: "La nostra cornice.",
      quote: "La bellezza non è che l'inizio del terrore che siamo ancora appena capaci di sopportare."
    },
    bookingSection: {
      title: "Unisciti a noi.",
      slots: [
        { label: "Orario", value: "dalle 18:30" },
        { label: "Musica", value: "Lounge music & DJ set" },
        { label: "Capacità", value: "Max 50 Posti" }
      ],
      note: "Posti limitati. Prenotazioni su villaleopardi.it per assicurarti un tavolo al tramonto.",
      btnPrimary: "Prenota Ora",
      btnSecondary: "WhatsApp Direct"
    },
    footer: {
      desc: "Affacciata sulle acque cristalline del Lago di Garda, la nostra villa 4 stelle superior a Torri del Benaco è il luogo ideale per un soggiorno all’insegna del relax e dell’eleganza.",
      contact: "Contatti",
      social: "Connect",
      facebook: "Pagina Facebook",
      instagram: "Pagina Instagram",
      copyright: "Copyright © 2026 Villa Leopardi."
    },
    modal: {
      badge: "Sunset Table 2026",
      title: "Richiesta",
      titleItalic: "Prenotazione",
      name: "Il tuo Nome",
      namePlaceholder: "Nome e Cognome...",
      guests: "Numero Persone",
      guestsPlaceholder: "Quanti sarete?",
      phone: "Telefono",
      email: "Email",
      message: "Messaggio o Domande",
      messagePlaceholder: "Scrivi qui eventuali richieste particolari...",
      submit: "Invia Richiesta",
      submitting: "Invio in corso...",
      successTitle: "Richiesta Inviata!",
      successDesc: "Ti ricontatteremo a breve.",
      footerNote: "Sarete ricontattati dal nostro staff per confermare la disponibilità del tavolo."
    }
  },
  EN: {
    nav: {
      about: "The Event",
      gallery: "Gallery",
      booking: "Book",
      reservations: "Reservations",
      gmail: "Gmail Console"
    },
    hero: {
      subtitle: "Leopardi Signature Events",
      title1: "Sunset",
      title2: "Table",
      desc: "poolside experience",
    },
    about: {
      badge: "Sunset Table 2026",
      title: "Where taste meets",
      titleItalic: "the sunset light.",
      desc1: "Villa Leopardi presents an exclusive evening designed to accompany the sunset with elegance and seafood flavors.",
      desc2: "A signature gastronomic experience wrapped in the magical atmosphere of our gardens, between the reflection of the infinity pool and the last lights of the day.",
      menuTitle: "Evening",
      menuSerata: "menu",
      menuItems: [
        "Selection of raw fish paired with a glass of Champagne Pannier",
        "Seafood risotto",
        "Final dessert"
      ],
      experienceBadge: "4-Star Superior Experience"
    },
    features: [
      { label: "Lounge Music", desc: "DJ Set & Vibrations" },
      { label: "Sunset", desc: "Poolside View" },
      { label: "Exclusive", desc: "Max 50 Guests" },
      { label: "Date", desc: "June 20th, 2026" },
    ],
    gallery: {
      badge: "Visual Moments",
      title: "Our Frame.",
      quote: "Beauty is nothing but the beginning of terror, which we are still just able to endure."
    },
    bookingSection: {
      title: "Join Us.",
      slots: [
        { label: "Time", value: "from 18:30" },
        { label: "Music", value: "Lounge music & DJ set" },
        { label: "Capacity", value: "Max 50 Guests" }
      ],
      note: "Limited slots. Book on villaleopardi.it to ensure a sunset table.",
      btnPrimary: "Book Now",
      btnSecondary: "WhatsApp Direct"
    },
    footer: {
      desc: "Overlooking the crystal-clear waters of Lake Garda, our 4-star superior villa in Torri del Benaco is the perfect place for a stay dedicated to relaxation and elegance.",
      contact: "Contacts",
      social: "Connect",
      facebook: "Facebook Page",
      instagram: "Instagram Page",
      copyright: "Copyright © 2026 Villa Leopardi."
    },
    modal: {
      badge: "Sunset Table 2026",
      title: "Booking",
      titleItalic: "Request",
      name: "Your Name",
      namePlaceholder: "Full Name...",
      guests: "Number of Guests",
      guestsPlaceholder: "How many guests?",
      phone: "Phone",
      email: "Email",
      message: "Message or Questions",
      messagePlaceholder: "Write any special requests here...",
      submit: "Submit Request",
      submitting: "Sending...",
      successTitle: "Request Sent!",
      successDesc: "We will contact you shortly.",
      footerNote: "Our staff will contact you to confirm table availability."
    }
  },
  DE: {
    nav: {
      about: "Das Event",
      gallery: "Galerie",
      booking: "Buchen",
      reservations: "Reservierungen",
      gmail: "Gmail-Zentrale"
    },
    hero: {
      subtitle: "Leopardi Signature Events",
      title1: "Sunset",
      title2: "Table",
      desc: "poolside experience",
    },
    about: {
      badge: "Sunset Table 2026",
      title: "Wo Geschmack auf",
      titleItalic: "das Sonnenuntergangslicht trifft.",
      desc1: "Villa Leopardi präsentiert einen exklusiven Abend, der den Sonnenuntergang mit Eleganz und Meeresaromen begleitet.",
      desc2: "Ein gastronomisches Erlebnis der Extraklasse, eingebettet in die magische Atmosphäre unserer Gärten, zwischen dem Spiegelbild des Infinity-Pools und dem letzten Licht des Tages.",
      menuTitle: "Abend",
      menuSerata: "menü",
      menuItems: [
        "Auswahl an rohem Fisch kombiniert mit einem Glas Champagne Pannier",
        "Meeresfrüchte-Risotto",
        "Finales Dessert"
      ],
      experienceBadge: "4-Sterne Superior Erfahrung"
    },
    features: [
      { label: "Lounge Musik", desc: "DJ Set & Vibes" },
      { label: "Sonnenuntergang", desc: "Poolside View" },
      { label: "Exklusiv", desc: "Max 50 Plätze" },
      { label: "Datum", desc: "20. Juni 2026" },
    ],
    gallery: {
      badge: "Visual Moments",
      title: "Unser Rahmen.",
      quote: "Das Schöne è nichts als des Schrecklichen Anfang, den wir noch grade ertragen."
    },
    bookingSection: {
      title: "Begleiten Sie uns.",
      slots: [
        { label: "Uhrzeit", value: "ab 18:30" },
        { label: "Musik", value: "Lounge Musik & DJ Set" },
        { label: "Kapazität", value: "Max 50 Plätze" }
      ],
      note: "Begrenzte Plätze. Buchen Sie auf villaleopardi.it, um sich einen Tisch bei Sonnenuntergang zu sichern.",
      btnPrimary: "Jetzt Buchen",
      btnSecondary: "WhatsApp Direct"
    },
    footer: {
      desc: "Mit Blick auf das kristallklare Wasser des Gardasees ist unsere 4-Sterne-Superior-Villa in Torri del Benaco der ideale Ort für einen Aufenthalt im Zeichen von Entspannung und Eleganz.",
      contact: "Kontakt",
      social: "Connect",
      facebook: "Facebook-Seite",
      instagram: "Instagram-Seite",
      copyright: "Copyright © 2026 Villa Leopardi."
    },
    modal: {
      badge: "Sunset Table 2026",
      title: "Reservierungs",
      titleItalic: "Anfrage",
      name: "Ihr Name",
      namePlaceholder: "Vor- und Nachname...",
      guests: "Anzahl Personen",
      guestsPlaceholder: "Wie viele Personen?",
      phone: "Telefon",
      email: "E-Mail",
      message: "Nachricht oder Fragen",
      messagePlaceholder: "Schreiben Sie hier Ihre Wünsche...",
      submit: "Anfrage Senden",
      submitting: "Wird gesendet...",
      successTitle: "Anfrage Gesendet!",
      successDesc: "Wir werden uns in Kürze bei Ihnen melden.",
      footerNote: "Unser Personal wird Sie kontaktieren, um die Tischverfügbarkeit zu bestätigen."
    }
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>("IT");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGmailConsoleOpen, setIsGmailConsoleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const T = TRANSLATIONS[lang];

  const [formData, setFormData] = useState({
    name: "",
    guests: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Trigger actual Gmail send if administrator is logged in through Google
        const activeToken = getAccessToken();
        if (activeToken) {
          try {
            const mailSubject = `Nuova prenotazione Sunset Table: ${formData.guests} ospiti - ${formData.name}`;
            const mailMsg = `Richiesta Ricevuta!\n\nNome: ${formData.name}\nOspiti: ${formData.guests}\nTelefono: ${formData.phone}\nEmail: ${formData.email}\nMessaggio: ${formData.message || "Nessuno"}\n\nQuesta notifica è stata inviata automaticamente tramite l'API di Gmail di Villa Leopardi.`;
            
            // Send email to the hotel admin inbox and a copy to the guest!
            await sendGmailMessage(activeToken, "zorziriccardo20@gmail.com", mailSubject, mailMsg);
            if (formData.email) {
              const guestSubject = "Villa Leopardi - Ricezione Richiesta Prenotazione";
              const guestMsg = `Gentile ${formData.name},\n\nabbiamo ricevuto la tua richiesta di prenotazione per l'evento Sunset Table.\nIl nostro staff verificherà la disponibilità per ${formData.guests} persone e ti contatterà al più presto.\n\nDettagli della richiesta:\n- Telefono: ${formData.phone}\n- Note: ${formData.message || "Nessuna"}\n\nCordiali saluti,\nVilla Leopardi Staff`;
              await sendGmailMessage(activeToken, formData.email, guestSubject, guestMsg);
            }
          } catch (gmailErr) {
            console.error("Autosending email notifications via Gmail failed: ", gmailErr);
          }
        }

        setSubmitted(true);
        setTimeout(() => {
          setIsBookingOpen(false);
          setSubmitted(false);
          setFormData({ name: "", guests: "", phone: "", email: "", message: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-brand-neutral selection:bg-brand-primary selection:text-brand-neutral">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-brand-neutral/80 backdrop-blur-md border-b border-brand-accent/30">
        <a href="/" className="flex items-center">
          <img 
            src="/Logo.png" 
            alt="Villa Leopardi" 
            className="h-10 md:h-12 w-auto object-contain transition-opacity duration-300 hover:opacity-85"
          />
        </a>
        <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-brand-contrast/80">
          <a href="#about" className="hover:text-brand-primary transition-colors">{T.nav.about}</a>
          <a href="#gallery" className="hover:text-brand-primary transition-colors">{T.nav.gallery}</a>
          <a href="#booking" className="hover:text-brand-primary transition-colors">{T.nav.booking}</a>
        </div>
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest border border-brand-contrast/10 hover:bg-brand-contrast/5 transition-all rounded-sm"
            >
              <Globe size={12} className="opacity-50" />
              {lang}
              <ChevronDown size={10} className={`transition-transform duration-300 ${isLangMenuOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 bg-brand-neutral border border-brand-accent/40 shadow-2xl overflow-hidden rounded-sm min-w-[120px]"
                >
                  {(["IT", "EN", "DE"] as Language[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setIsLangMenuOpen(false); }}
                      className={`w-full px-6 py-3 text-[10px] uppercase tracking-widest text-left hover:bg-brand-primary/10 transition-colors ${lang === l ? "bg-brand-accent/35 font-bold text-brand-primary" : "text-brand-contrast/70"}`}
                    >
                      {l === "IT" ? "Italiano" : l === "EN" ? "English" : "Deutsch"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsGmailConsoleOpen(true)}
            title={T.nav.gmail}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest border border-brand-contrast/20 hover:bg-brand-primary/10 hover:border-brand-primary transition-all rounded"
          >
            <Lock size={11} className="text-brand-primary" />
            <span className="font-bold">{T.nav.gmail}</span>
          </button>

          <button 
            onClick={() => setIsBookingOpen(true)}
            className="px-5 py-2 text-[10px] uppercase tracking-widest border border-brand-contrast/20 hover:bg-brand-contrast hover:text-brand-neutral transition-all duration-300"
          >
            {T.nav.reservations}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-[center_47%]"
          style={{ backgroundImage: `url(${IMAGES.hero})` }}
        />
        <div className="absolute inset-0 bg-brand-contrast/40 z-0" />
        
        <div className="relative z-10 text-center text-brand-neutral px-4">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "1em" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-4"
          >
            <span className="text-xs md:text-sm uppercase font-light tracking-[1em]">{T.hero.subtitle}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center mb-6"
          >
            <span className="text-5xl md:text-9xl font-serif font-light tracking-[0.18em] text-brand-primary uppercase leading-tight mb-2 select-none">{T.hero.title1}</span>
            <span className="text-5xl md:text-9xl font-serif font-light tracking-[0.18em] text-brand-primary uppercase leading-tight select-none">{T.hero.title2}</span>
            <div className="flex gap-1.5 justify-center items-center mt-8 opacity-85 select-none">
              {[1, 2, 3, 4].map((s) => (
                <Star key={s} size={14} className="text-brand-primary fill-brand-primary stroke-none animate-pulse-slow" />
              ))}
              <span className="text-brand-primary font-sans font-bold text-sm tracking-normal ml-1 leading-none uppercase">S</span>
            </div>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-10"
          >
            <p className="max-w-xl mx-auto text-sm md:text-3xl font-signature opacity-90 leading-relaxed text-brand-primary italic lowercase">
              {T.hero.desc}
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mt-10"
            >
              <ChevronDown className="opacity-50" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp}>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold mb-4 block underline decoration-brand-accent underline-offset-8">{T.about.badge}</span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
              {T.about.title} <br /> 
              <span className="italic text-brand-primary">{T.about.titleItalic}</span>
            </h2>
            <div className="space-y-6 text-brand-contrast/70 leading-loose text-sm md:text-lg font-light">
              <p>{T.about.desc1}</p>
              <p>{T.about.desc2}</p>
            </div>

            {/* Menu Section */}
            <div className="mt-12 p-8 bg-brand-accent/20 border border-brand-accent/60 rounded-[12px]">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-6 text-brand-contrast">{T.about.menuTitle} <span className="font-signature normal-case tracking-normal text-xl">{T.about.menuSerata}</span>:</h3>
              <ul className="space-y-4 text-brand-contrast/80">
                {T.about.menuItems.map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                    <p className="text-sm italic">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden border-[12px] border-brand-accent/40 rounded-[12px] shadow-2xl rotate-2">
              <img 
                src={IMAGES.aperitivo} 
                alt="Luxury Aperitivo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-primary p-8 text-brand-contrast w-52 shadow-xl rounded-[12px] border border-brand-accent/30 hidden md:block -rotate-3">
              <div className="flex gap-0.5 items-center mb-4 select-none text-brand-contrast">
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} size={10} className="text-brand-contrast fill-brand-contrast stroke-none" />
                ))}
                <span className="font-sans font-bold text-[11px] ml-1 leading-none">S</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold leading-normal">{T.about.experienceBadge}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-brand-contrast text-brand-neutral overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {T.features.map((item, i) => {
            const IconComponent = [Music, Sunset, Users, Calendar][i];
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                {IconComponent && (
                  <IconComponent 
                    className="mx-auto mb-6 text-brand-primary group-hover:scale-110 transition-transform duration-300" 
                    strokeWidth={1} 
                    size={32} 
                  />
                )}
                <h3 className="text-xs uppercase tracking-widest font-bold mb-2 text-brand-accent">{item.label}</h3>
                <p className="text-[10px] uppercase opacity-75 tracking-widest text-brand-neutral">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-brand-neutral">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold mb-4 block underline decoration-brand-accent underline-offset-8">{T.gallery.badge}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-contrast">{T.gallery.title}</h2>
            </div>
            <p className="max-w-sm text-sm text-brand-contrast/70 leading-relaxed italic">
              "{T.gallery.quote}"
            </p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <motion.div variants={fadeInUp} className="md:col-span-8 h-[300px] md:h-[500px] overflow-hidden rounded-[12px] shadow-md border border-brand-accent/30">
              <img src={IMAGES.drone} alt="Villa Overview" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </motion.div>
            <motion.div variants={fadeInUp} className="md:col-span-4 h-[300px] md:h-[500px] overflow-hidden rounded-[12px] shadow-md border border-brand-accent/30">
              <img src={IMAGES.poolSide} alt="Pool Side" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </motion.div>
            <motion.div variants={fadeInUp} className="md:col-span-4 h-[300px] md:h-[500px] overflow-hidden rounded-[12px] shadow-md border border-brand-accent/30">
              <img src={IMAGES.villa} alt="Villa" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </motion.div>
            <motion.div variants={fadeInUp} className="md:col-span-8 h-[300px] md:h-[500px] overflow-hidden rounded-[12px] shadow-md border border-brand-accent/30">
              <img src={IMAGES.party} alt="Night Atmosphere" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Info & Booking Section */}
      <section id="booking" className="py-24 bg-brand-neutral border-y border-brand-accent/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03]">
          <span className="text-[300px] font-serif leading-none italic pointer-events-none text-brand-contrast">Villa</span>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-contrast mb-12">{T.bookingSection.title}</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16 px-4">
              {T.bookingSection.slots.map((slot, i) => {
                const IconComponent = [Calendar, MapPin, Star][i];
                return (
                  <div key={i} className="p-8 border border-brand-accent/60 bg-brand-neutral/40 rounded-[12px] hover:bg-brand-neutral/80 transition-all duration-300 shadow-sm">
                    {IconComponent && (
                      <IconComponent className="mx-auto mb-4 text-brand-primary" size={20} />
                    )}
                    <h4 className="text-[10px] uppercase font-bold tracking-widest mb-2 text-brand-contrast opacity-80">{slot.label}</h4>
                    <p className="text-sm font-serif text-brand-contrast font-medium">{slot.value}</p>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-brand-contrast/70 mb-10 tracking-[0.1em] uppercase max-w-lg mx-auto font-light">
              {T.bookingSection.note}
            </p>

            <div className="flex justify-center items-center">
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-brand-contrast text-brand-neutral px-12 py-5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-brand-primary hover:text-brand-contrast rounded-[8px] transition-all duration-500 shadow-xl w-full sm:w-auto"
              >
                {T.bookingSection.btnPrimary}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-brand-contrast text-brand-neutral/80 border-t border-brand-accent/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          <div className="md:col-span-2">
            <div className="mb-8 flex items-center gap-6">
              <VillaLeopardiLogo isDarkBg={true} size="footer" />
            </div>
            <p className="text-sm leading-loose max-w-sm font-light opacity-60">
              {T.footer.desc}
            </p>
          </div>
          <div>
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary mb-6">{T.footer.contact}</h5>
            <div className="space-y-4 text-xs font-light">
              <a href="tel:+390452457318" className="flex items-center gap-3 hover:text-brand-primary transition-colors"><Phone size={14} /> +39 045 2457318</a>
              <a href="mailto:info@villaleopardi.it" className="flex items-center gap-3 hover:text-brand-primary transition-colors"><Mail size={14} /> info@villaleopardi.it</a>
              <p className="flex items-center gap-3 leading-relaxed"><MapPin size={14} className="shrink-0" /> Via Gardesana 21 30, Torri del Benaco, VR</p>
            </div>
          </div>
          <div>
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-brand-primary mb-6">{T.footer.social}</h5>
            <div className="space-y-3 text-xs font-light flex flex-col">
              <a href="#" className="flex items-center gap-3 hover:text-brand-primary transition-colors"><LucideFacebook size={14} /> {T.footer.facebook}</a>
              <a href="#" className="flex items-center gap-3 hover:text-brand-primary transition-colors"><LucideInstagram size={14} /> {T.footer.instagram}</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-brand-neutral/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-40">
          <p>{T.footer.copyright}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-brand-contrast/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-brand-neutral w-full max-w-lg p-8 md:p-12 shadow-2xl border border-brand-accent/30 rounded-[16px] overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute -top-12 -right-12 p-20 opacity-[0.03] text-brand-contrast">
                <span className="text-[120px] font-serif leading-none italic pointer-events-none">Villa</span>
              </div>

              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-6 right-6 text-brand-contrast/40 hover:text-brand-primary transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold mb-2 block">{T.modal.badge}</span>
                <h2 className="text-3xl md:text-4xl font-serif text-brand-contrast mb-8 tracking-tight">{T.modal.title} <span className="italic text-brand-primary">{T.modal.titleItalic}</span></h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="text-brand-primary" size={32} />
                      </div>
                      <h3 className="text-2xl font-serif text-brand-contrast mb-2">{T.modal.successTitle}</h3>
                      <p className="text-sm opacity-60 text-brand-contrast">{T.modal.successDesc}</p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 block ml-1 text-brand-contrast">{T.modal.name}</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={T.modal.namePlaceholder} 
                          className="w-full bg-brand-neutral border border-brand-accent/65 px-4 py-4 text-sm rounded-[8px] focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 block ml-1 text-brand-contrast">{T.modal.guests}</label>
                          <input 
                            type="number" 
                            required
                            min="1"
                            max="50"
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            placeholder={T.modal.guestsPlaceholder} 
                            className="w-full bg-brand-neutral border border-brand-accent/65 px-4 py-4 text-sm rounded-[8px] focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 block ml-1 text-brand-contrast">{T.modal.phone}</label>
                          <input 
                            type="tel" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+39 000 0000000" 
                            className="w-full bg-brand-neutral border border-brand-accent/65 px-4 py-4 text-sm rounded-[8px] focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 block ml-1 text-brand-contrast">{T.modal.email}</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="la-tua@email.com" 
                          className="w-full bg-brand-neutral border border-brand-accent/65 px-4 py-4 text-sm rounded-[8px] focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-60 block ml-1 text-brand-contrast">{T.modal.message}</label>
                        <textarea 
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={T.modal.messagePlaceholder} 
                          className="w-full bg-brand-neutral border border-brand-accent/65 px-4 py-4 text-sm rounded-[8px] focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all resize-none text-brand-contrast"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-contrast text-brand-neutral py-5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-brand-primary hover:text-brand-contrast rounded-[8px] transition-all duration-500 mt-4 shadow-lg shadow-brand-primary/10 disabled:opacity-50"
                      >
                        {isSubmitting ? T.modal.submitting : T.modal.submit}
                      </button>
                      
                      <p className="text-[9px] uppercase tracking-widest text-center opacity-45 leading-relaxed text-brand-contrast/80">
                        {T.modal.footerNote}
                      </p>
                    </>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <GmailConsole isOpen={isGmailConsoleOpen} onClose={() => setIsGmailConsoleOpen(false)} />
    </div>
  );
}
