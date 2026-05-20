import fs from "fs";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Booking
  app.post("/api/book", (req, res) => {
    const { name, guests, phone, email, message } = req.body;
    
    // The details for the email
    const targetEmail = "zorziriccardo20@gmail.com";
    const subject = `${guests} persone ${name} e sunset table`;
    const body = `
      Nuova Richiesta di Prenotazione:
      Nome: ${name}
      Persone: ${guests}
      Telefono: ${phone}
      Email: ${email}
      Messaggio: ${message || "Nessun messaggio."}
    `;

    console.log("--- NUOVA PRENOTAZIONE ---");
    console.log(`To: ${targetEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("---------------------------");

    // In a real scenario, you would use a service like SendGrid, Resend, or Nodemailer here.
    // For now, we simulate success.
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
