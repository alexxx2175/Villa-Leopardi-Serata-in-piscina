import fs from "fs";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Resend client lazily
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️ WARNING: RESEND_API_KEY has not been configured in your environment variables. Email notification features will be skipped."
    );
    return null;
  }

  return new Resend(apiKey);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Booking
  app.post("/api/book", async (req, res) => {
    const { name, guests, phone, email, message } = req.body;

    const adminTarget = process.env.ADMIN_EMAIL || "zorziriccardo20@gmail.com";
    // Resend's default free sandbox sender is "onboarding@resend.dev"
    const senderEmail = process.env.SENDER_EMAIL || "Villa Leopardi <onboarding@resend.dev>";

    console.log("--- NUOVA RICHIESTA DI PRENOTAZIONE ---");
    console.log(`Nome: ${name}, Ospiti: ${guests}, Email: ${email}`);

    // Get Resend API Client
    const resendClient = getResendClient();

    if (resendClient) {
      try {
        // 1. Email to the Admin (Hotel concierge)
        const adminSubject = `Nuova Richiesta Sunset Table: ${guests} Ospiti - ${name}`;
        const adminHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fcfbfa; color: #1c1c1a; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eae7e2; padding: 30px; border-radius: 4px; }
              .header { border-bottom: 1px solid #f3f0ec; padding-bottom: 20px; margin-bottom: 20px; }
              h2 { font-size: 18px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: #bdb1a1; margin: 0; }
              .grid-table { margin: 20px 0; border: 1px solid #f3f0ec; border-radius: 3px; overflow: hidden; }
              .grid-row { display: flex; padding: 12px 16px; border-bottom: 1px solid #f3f0ec; }
              .grid-row:last-child { border-bottom: none; }
              .grid-label { width: 150px; text-transform: uppercase; font-size: 10px; font-weight: bold; letter-spacing: 0.1em; color: #8a8a80; }
              .grid-val { font-size: 13px; color: #1c1c1a; font-weight: 500; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Nuova Prenotazione Ricevuta</h2>
              </div>
              <p style="font-size: 13px; color: #5a5a54;">Un nuovo ospite ha espresso interesse per l'evento <strong>Sunset Table</strong> presso Villa Leopardi:</p>
              
              <div class="grid-table">
                <div class="grid-row">
                  <div class="grid-label">Nome Ospite</div>
                  <div class="grid-val">${name}</div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">Ospiti</div>
                  <div class="grid-val">${guests} persone</div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">Smarphone</div>
                  <div class="grid-val">${phone}</div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">Contatto E-mail</div>
                  <div class="grid-val">${email}</div>
                </div>
                <div class="grid-row">
                  <div class="grid-label">Taccuino Note</div>
                  <div class="grid-val">${message || "Nessun messaggio inserito"}</div>
                </div>
              </div>
              
              <p style="font-size: 11px; color: #bdb1a1; margin-top: 25px;">Questa e-mail è stata instradata in tempo reale tramite il portale integrato di Villa Leopardi.</p>
            </div>
          </body>
          </html>
        `;

        await resendClient.emails.send({
          from: senderEmail,
          to: adminTarget,
          subject: adminSubject,
          html: adminHtml,
        });

        console.log(`✓ Email di notifica amministratore inviata con successo a ${adminTarget}`);

        // 2. Beautiful Confirmation Email directly to the Guest (if they supplied one)
        if (email) {
          const guestSubject = "Villa Leopardi - Ricezione Richiesta Prenotazione Sunset Table";
          const guestHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fcfbfa; color: #1c1c1a; margin: 0; padding: 40px 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eae7e2; padding: 40px; border-radius: 4px; }
                .header { text-align: center; border-bottom: 1px solid #f3f0ec; padding-bottom: 30px; margin-bottom: 30px; }
                .logo { font-size: 20px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1c1a; margin: 0; }
                .logo-sub { font-size: 10px; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: #bdb1a1; margin-top: 5px; }
                h1 { font-size: 18px; font-weight: 400; letter-spacing: 0.05em; margin-bottom: 20px; text-align: center; color: #1c1c1a; text-transform: uppercase; }
                p { font-size: 13.5px; line-height: 1.62; color: #5a5a54; margin-bottom: 20px; }
                .details-box { background-color: #fdfdfc; border: 1px solid #f3f0ec; padding: 25px; border-radius: 3px; margin: 30px 0; }
                .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f9f8f6; font-size: 12.5px; }
                .details-row:last-child { border-bottom: none; }
                .label { color: #8a8a80; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em; font-weight: bold; }
                .value { font-weight: 500; color: #1c1c1a; }
                .footer { text-align: center; font-size: 10px; color: #bdb1a1; border-top: 1px solid #f3f0ec; padding-top: 30px; margin-top: 30px; letter-spacing: 0.05em; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Villa Leopardi</div>
                  <div class="logo-sub">Torri del Benaco</div>
                </div>
                <h1>Richiesta di prenotazione ricevuta</h1>
                <p>Gentile <strong>${name}</strong>,</p>
                <p>La ringraziamo per l'interesse dimostrato nei confronti di Villa Leopardi. Abbiamo registrato correttamente la Sua richiesta di prenotazione per l'evento <strong>Sunset Table</strong>.</p>
                <p>Il nostro Concierge Staff verificherà la disponibilità delle nostre postazioni panoramiche e si metterà in contatto con Lei a breve per confermare la prenotazione.</p>
                
                <div class="details-box">
                  <div class="details-row">
                    <span class="label">Ospite</span>
                    <span class="value">${name}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Numero Ospiti</span>
                    <span class="value">${guests} persone</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Telefono fornito</span>
                    <span class="value">${phone}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Recapito E-mail</span>
                    <span class="value">${email}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Note Particolari</span>
                    <span class="value">${message || "Nessuna richiesta speciale"}</span>
                  </div>
                </div>
                
                <p>Restiamo a Sua completa disposizione per qualsiasi necessità o personalizzazione dell'evento.</p>
                
                <div class="footer">
                  VILLA LEOPARDI &copy; 2026 &mdash; LAGO DI GARDA, ITALIA
                </div>
              </div>
            </body>
            </html>
          `;

          await resendClient.emails.send({
            from: senderEmail,
            to: email,
            subject: guestSubject,
            html: guestHtml,
          });

          console.log(`✓ Email di cortesia inviata con successo all'ospite: ${email}`);
        }
      } catch (err) {
        console.error("❌ ERRORE durante la spedizione delle email con Resend:", err);
      }
    } else {
      console.warn("⚠️ Resend non configurato. Le email non sono state inviate.");
    }

    res.json({ success: true, message: "Richiesta ricevuta correttamente." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
