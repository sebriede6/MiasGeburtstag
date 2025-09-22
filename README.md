# 🎂 Mias Interaktive Geburtstagskarte

Eine wunderschöne, interaktive Geburtstagskarte für den 12. Geburtstag!

## ✨ Features

- **Aufklappbare Karte** - Schöne 3D-Animation beim Öffnen
- **Happy Birthday Melodie** - Spielt automatisch beim Aufklappen
- **12 flackernde Kerzen** - Realistische Flammen-Animation
- **Mikrofon-Integration** - Kerzen durch Pusten auspusten
- **Mobile optimiert** - Perfekt für Smartphones
- **Konfetti-Effekt** - Wenn alle Kerzen ausgeblasen sind

## 🚀 Kostenlose Deployment-Optionen

### Option 1: GitHub Pages (Empfohlen)

1. **Repository erstellen:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Mias Geburtstagskarte"
   ```

2. **Auf GitHub hochladen:**
   - Neues Repository auf GitHub.com erstellen
   - Repository-Link kopieren

   ```bash
   git remote add origin [DEIN-REPOSITORY-LINK]
   git branch -M main
   git push -u origin main
   ```

3. **GitHub Pages aktivieren:**
   - In Repository Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "main" auswählen
   - Folder: "/ (root)" auswählen
   - Save klicken

4. **Deine Karte ist online unter:**
   `https://[DEIN-USERNAME].github.io/[REPOSITORY-NAME]`

### Option 2: Netlify

1. **Netlify.com besuchen** und kostenlosen Account erstellen
2. **"Add new site" > "Deploy manually"**
3. **Alle Dateien in den Drop-Bereich ziehen**
4. **Fertig!** - Du bekommst eine URL wie `https://amazing-site-123456.netlify.app`

### Option 3: Vercel

1. **Vercel.com besuchen** und kostenlosen Account erstellen
2. **GitHub Repository verbinden** oder Dateien hochladen
3. **Deploy klicken**
4. **Deine Karte ist live!**

## 📱 Mobile Nutzung

Die Karte ist vollständig für mobile Geräte optimiert:

- Responsive Design
- Touch-freundliche Bedienung
- PWA-Unterstützung (kann als App installiert werden)
- Mikrofon-API für Pusten-Erkennung

## 🎵 Audio-Features

- **Automatische Melodie** beim Aufklappen
- **Mikrofon-Erkennung** zum Ausblasen der Kerzen
- **Fallback-Optionen** falls Audio blockiert wird
- **Web Audio API** für browserübergreifende Kompatibilität

## 🔧 Anpassungen

Du kannst folgende Elemente leicht anpassen:

- **Name ändern:** In `index.html` "Mia" durch gewünschten Namen ersetzen
- **Alter ändern:** Anzahl der Kerzen in HTML und CSS anpassen
- **Farben:** In `styles.css` die Farbverläufe anpassen
- **Nachrichten:** Geburtstagswünsche in HTML personalisieren

## 🛠️ Technische Details

- **Vanilla JavaScript** - Keine Frameworks benötigt
- **CSS3 Animationen** - Flüssige 3D-Effekte
- **Web Audio API** - Moderne Audio-Integration
- **MediaDevices API** - Mikrofon-Zugriff
- **Service Worker** - Offline-Funktionalität
- **Progressive Web App** - App-ähnliche Erfahrung

## 📞 Support

Bei Fragen oder Problemen:

1. Mikrofon-Berechtigung in Browser-Einstellungen prüfen
2. HTTPS-Verbindung sicherstellen (für Mikrofon erforderlich)
3. Neueste Browser-Version verwenden

---

## 🎉 Viel Spaß beim Feiern
