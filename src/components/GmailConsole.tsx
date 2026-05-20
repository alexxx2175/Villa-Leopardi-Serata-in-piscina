import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, LogOut, CheckCircle2, AlertCircle, Inbox, 
  ChevronRight, X, Lock, RefreshCw, Send, Sparkles 
} from "lucide-react";
import { initAuth, googleSignIn, logout as firebaseLogout, getAccessToken } from "../lib/firebase";
import { listRecentGmailMessages, sendGmailMessage, GmailMessage } from "../services/gmail";
import { User } from "firebase/auth";

interface GmailConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  brandPrimaryColor?: string; // rgb: #bdb1a1
}

export default function GmailConsole({ isOpen, onClose, brandPrimaryColor = "#bdb1a1" }: GmailConsoleProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  
  // Custom interactive composer
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  
  // Active confirmation state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, activeToken) => {
        setUser(currentUser);
        setToken(activeToken);
        setIsLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch recent messages when token is available
  const handleFetchMessages = async (currentToken: string) => {
    setIsFetchingMessages(true);
    try {
      const fetched = await listRecentGmailMessages(currentToken);
      setMessages(fetched);
    } catch (e) {
      console.error("Failed to list messages:", e);
    } finally {
      setIsFetchingMessages(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleFetchMessages(token);
    } else {
      setMessages([]);
    }
  }, [token]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Pre-fill fields with standard luxury templates
  const applyTemplate = (type: "conferma" | "info" | "promemoria") => {
    setSubject(
      type === "conferma" 
        ? "Villa Leopardi - Conferma Tavolo al Tramonto" 
        : type === "info"
        ? "Villa Leopardi - Informazioni Dettagliate Evento Sunset Table"
        : "Villa Leopardi - Promemoria Evento Esclusivo"
    );
    setBodyText(
      type === "conferma"
        ? "Gentile Ospite,\n\nsiamo lieti di confermare la tua prenotazione per l'evento esclusive Sunset Table presso Villa Leopardi.\n\nIl tuo tavolo a bordo piscina ti attende a partire dalle ore 18:30.\n\nCordiali saluti,\nIl Team di Villa Leopardi\nTorri del Benaco, Lago di Garda"
        : type === "info"
        ? "Gentile Ospite,\n\nin risposta alla tua richiesta, ti informiamo che l'evento Sunset Table include una selezione gourmet firmata da chef stellati, abbinamenti con Champagne Pannier di alta gamma e un accompagnamento musicale live raffinato.\n\nRestiamo a disposizione per qualsiasi ulteriore richiesta specifica o intolleranza alimentare.\n\nCordiali saluti,\nStaff Villa Leopardi"
        : "Gentile Ospite,\n\nti ricordiamo che l'evento esclusivo Sunset Table si terrà questo sabato dalle ore 18:30.\n\nTi consigliamo un abbigliamento elegant-casual per godere al meglio dell'atmosfera del tramonto sul Lago di Garda.\n\nCordiali saluti,\nVilla Leopardi"
    );
  };

  // Triggered by the user submitting the Quick Send form
  const handleSendAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !bodyText) {
      setSendError("Compila tutti i campi prima di procedere.");
      return;
    }
    setSendError(null);
    setSendSuccess(null);
    // Mandatory Workspace Rule: Show confirmation before executing a mutating API call
    setShowConfirmModal(true);
  };

  // Executed after user confirms they want to proceed
  const handleConfirmedSend = async () => {
    if (!token) return;
    setShowConfirmModal(false);
    setIsSending(true);
    try {
      await sendGmailMessage(token, recipient, subject, bodyText);
      setSendSuccess(`Email inviata con successo a ${recipient}!`);
      setRecipient("");
      setSubject("");
      setBodyText("");
    } catch (error: any) {
      console.error("Failed to send message:", error);
      setSendError(`Errore nell'invio tramite Gmail: ${error.message || error}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden font-sans">
      {/* Overlay Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-contrast/80 backdrop-blur-sm"
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative bg-brand-neutral w-full max-w-2xl h-full shadow-2xl flex flex-col z-10 border-l border-brand-accent/40"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-brand-accent/30 flex justify-between items-center bg-brand-neutral">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-brand-contrast"
              style={{ backgroundColor: `${brandPrimaryColor}15` }}
            >
              <Mail className="text-brand-primary" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-brand-contrast uppercase tracking-wider">
                Console Gestione Gmail
              </h3>
              <p className="text-[10px] text-brand-primary uppercase tracking-widest font-light mt-0.5">
                Villa Leopardi Staff Portal
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-brand-contrast/40 hover:text-brand-primary hover:bg-brand-accent/10 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Console Workspace Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw className="animate-spin text-brand-primary" size={28} />
            </div>
          ) : !user || !token ? (
            /* UNAUTHENTICATED STATE */
            <div className="space-y-6 max-w-md mx-auto py-12 text-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${brandPrimaryColor}10` }}
              >
                <Lock className="text-brand-primary" size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif font-medium text-brand-contrast">
                  Accesso Amministratore
                </h4>
                <p className="text-sm text-brand-contrast/75 leading-relaxed">
                  Collega il tuo account Google aziendale o personale con autorizzazione **Gmail** per gestire le prenotazioni di Villa Leopardi live. Potrai:
                </p>
              </div>

              <div className="bg-brand-primary/10 border border-brand-accent/30 p-4 rounded-lg text-left text-xs space-y-2.5 text-brand-contrast/90 leading-relaxed font-light">
                <p className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                  <span>Sfogliare e leggere le ultime email e richieste di RSVP inerenti l'evento **Sunset Table** direttamente nella console.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                  <span>Rispondere istantaneamente ai clienti inviando inviti raffinati e conferme tavoli tramite **Gmail API** autenticata.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                  <span>Configurazione automatica e protetta nel browser per massimizzare l'operatività del personale.</span>
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="pt-4 flex justify-center">
                <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button w-full sm:w-auto shadow-md border border-brand-accent/30 hover:shadow-xl transition-all"
                  style={{ cursor: "pointer" }}
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isLoggingIn ? "Connessione..." : "Accedi con Google"}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED STATE */
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-white/40 border border-brand-accent/30 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 text-left">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "Admin"} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-brand-primary"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brand-primary text-brand-neutral flex items-center justify-center font-bold rounded-full">
                      {user.displayName?.charAt(0) || "A"}
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif font-bold text-base text-brand-contrast">
                      {user.displayName || "Villa Advisor"}
                    </h4>
                    <span className="text-xs text-brand-contrast/85 font-mono">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden md:inline px-2.5 py-1 text-[9px] font-mono tracking-widest font-bold uppercase rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300">
                    Live Verified
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase rounded border border-rose-200/40 text-rose-800 hover:bg-rose-50 transition-all font-bold"
                  >
                    <LogOut size={12} /> Scollega
                  </button>
                </div>
              </div>

              {/* SECTION: Live Booking Correspondence */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-brand-accent/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Inbox className="text-brand-primary" size={18} />
                    <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-brand-contrast">
                      Inbox Prenotazioni Recenti
                    </h4>
                  </div>
                  <button
                    onClick={() => handleFetchMessages(token)}
                    disabled={isFetchingMessages}
                    className="p-1 px-2.5 rounded hover:bg-brand-accent/20 flex items-center gap-1 text-[10px] text-brand-primary uppercase tracking-widest transition-all disabled:opacity-40"
                  >
                    <RefreshCw size={10} className={isFetchingMessages ? "animate-spin" : ""} />
                    Ricarica
                  </button>
                </div>

                {isFetchingMessages ? (
                  <div className="py-8 text-center space-y-2">
                    <RefreshCw size={20} className="animate-spin text-brand-primary mx-auto" />
                    <p className="text-xs text-brand-contrast/60">Interrogazione Gmail API in corso...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-8 bg-brand-accent/15 rounded-lg text-center p-6 border border-brand-accent/30">
                    <Inbox size={28} className="text-brand-primary/40 mx-auto mb-2" />
                    <p className="text-xs text-brand-contrast/70 font-medium">Nessuna email RSVP di "Sunset Table" trovata nel tuo Gmail.</p>
                    <p className="text-[10px] text-brand-contrast/50 mt-1 max-w-sm mx-auto">Vengono mostrate solo le risposte e le email contenenti "Sunset Table", "Prenotazione" o "Villa Leopardi".</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className="p-4 bg-white/60 border border-brand-accent/20 hover:border-brand-primary rounded-lg transition-all text-left text-xs space-y-1 relative group cursor-pointer"
                        onClick={() => {
                          // Quick assign to recipient
                          const emailMatch = msg.from?.match(/<([^>]+)>/);
                          const cleanEmail = emailMatch ? emailMatch[1] : msg.from?.trim();
                          if (cleanEmail) setRecipient(cleanEmail);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-brand-contrast opacity-95 truncate max-w-[70%]">{msg.from}</span>
                          <span className="text-[9px] font-mono text-brand-contrast/50">{new Date(msg.date || "").toLocaleDateString()}</span>
                        </div>
                        <div className="font-serif italic font-medium text-brand-primary">{msg.subject}</div>
                        <p className="text-[11px] text-brand-contrast/80 line-clamp-2 leading-relaxed">{msg.snippet}</p>
                        <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[8px] font-mono uppercase tracking-wider text-brand-primary font-bold">
                          Rispondi <ChevronRight size={10} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: Luxury Custom Email Composer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-brand-accent/20 pb-2">
                  <Sparkles className="text-brand-primary animate-pulse-slow" size={18} />
                  <h4 className="text-sm font-serif font-bold uppercase tracking-wider text-brand-contrast">
                    Compositore Rapido Smart Mail
                  </h4>
                </div>

                <form onSubmit={handleSendAttempt} className="space-y-4 text-left">
                  {sendSuccess && (
                     <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-start gap-2.5 leading-relaxed">
                       <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                       <span>{sendSuccess}</span>
                     </div>
                  )}

                  {sendError && (
                     <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-800 flex items-start gap-2.5 leading-relaxed">
                       <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                       <span>{sendError}</span>
                     </div>
                  )}

                  {/* Template Picker */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-brand-contrast/60 block mb-1">Carica Modello Villa</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        type="button"
                        onClick={() => applyTemplate("conferma")}
                        className="px-3 py-1 bg-brand-accent/20 hover:bg-brand-primary/20 text-brand-contrast text-[10px] uppercase font-bold border border-brand-accent/40 rounded transition-all"
                      >
                        Conferma Tavolo
                      </button>
                      <button 
                        type="button"
                        onClick={() => applyTemplate("info")}
                        className="px-3 py-1 bg-brand-accent/20 hover:bg-brand-primary/20 text-brand-contrast text-[10px] uppercase font-bold border border-brand-accent/40 rounded transition-all"
                      >
                        Informazioni Menù
                      </button>
                      <button 
                        type="button"
                        onClick={() => applyTemplate("promemoria")}
                        className="px-3 py-1 bg-brand-accent/20 hover:bg-brand-primary/20 text-brand-contrast text-[10px] uppercase font-bold border border-brand-accent/40 rounded transition-all"
                      >
                        Invia Promemoria
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-contrast/60 block">E-mail Destinatario</label>
                      <input 
                        type="email" 
                        required
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="ospite@dominio.it"
                        className="w-full bg-white border border-brand-accent/65 px-3 py-2.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-contrast/60 block">Oggetto Email</label>
                      <input 
                        type="text" 
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Es. Richiesta Confermata"
                        className="w-full bg-white border border-brand-accent/65 px-3 py-2.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-brand-contrast/60 block">Corpo dell'Email</label>
                    <textarea 
                      rows={5}
                      required
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      placeholder="Scrivi qui il messaggio..."
                      className="w-full bg-white border border-brand-accent/65 p-3 text-xs rounded resize-none focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-contrast"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-brand-contrast text-brand-neutral py-4 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-brand-primary hover:text-brand-contrast rounded transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
                  >
                    <Send size={12} /> {isSending ? "INVIO IN CORSO..." : "INVIA CON GMAIL"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Safety Workspace-Integration Confirmation Modal (MANDATORY) */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-brand-contrast/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-neutral w-full max-w-md p-6 border border-brand-accent/40 rounded-xl shadow-2xl relative"
            >
              <h4 className="text-md font-serif font-bold text-brand-contrast mb-3 uppercase tracking-wide flex items-center gap-2">
                <AlertCircle className="text-brand-primary" size={18} />
                Conferma Invio Gmail
              </h4>
              <p className="text-xs text-brand-contrast/80 leading-relaxed mb-4">
                Sei sicuro di voler trasmettere questo messaggio attraverso l'API di **Gmail** con il mittente esplicito <strong className="font-mono text-[10.5px] bg-brand-accent/20 px-1 py-0.5 rounded">{user?.email}</strong>?
              </p>
              
              <div className="bg-white/80 border border-brand-accent/20 rounded p-3 mb-5 max-h-40 overflow-y-auto text-left text-[11px] font-mono space-y-1 text-brand-contrast/85">
                <div><span className="font-bold">A:</span> {recipient}</div>
                <div><span className="font-bold">Oggetto:</span> {subject}</div>
                <div className="border-t border-brand-accent/20 pt-1.5 mt-1.5 whitespace-pre-wrap">{bodyText}</div>
              </div>

              <div className="flex gap-3 justify-end text-[10px] uppercase tracking-widest font-bold">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-brand-contrast/65 border border-brand-accent/30 hover:bg-brand-accent/15 rounded transition-all"
                >
                  Annulla
                </button>
                <button 
                  onClick={handleConfirmedSend}
                  className="px-5 py-2 bg-brand-contrast text-brand-neutral hover:bg-brand-primary hover:text-brand-contrast rounded transition-all"
                >
                  Sì, Invia Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
