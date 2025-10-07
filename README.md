# Konsultverktyg

> En komplett verktygslåda för konsulter och företagare i Sverige

Ett webbaserat verktyg som hjälper svenska konsulter och egenföretagare att beräkna timpris, löner, utdelningar och skatter enligt svenska skatteregler. Alla verktyg är gratis att använda och kräver ingen registrering.

[![Built with React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-green.svg)](https://konsulthjalpen.se)

## 📋 Innehållsförteckning

- [Översikt](#översikt)
- [Funktioner](#funktioner)
- [Installation](#installation)
- [Användning](#användning)
- [SEO och Prestanda](#seo-och-prestanda)
- [Teknisk Stack](#teknisk-stack)
- [Projektstruktur](#projektstruktur)
- [Utveckling](#utveckling)
- [Bidra](#bidra)
- [Licens](#licens)

## 🎯 Översikt

Konsulthjälpen är en svensk kalkylator-plattform som hjälper dig att:

- **Beräkna rätt timpris** för dina konsulttjänster
- **Planera lön och utdelningar** enligt 3:12-reglerna
- **Förstå skattekonsekvenser** i fåmansföretag
- **Optimera din ekonomi** över flera år

Alla beräkningar följer Skatteverkets officiella regler och skattetabeller. Din data sparas lokalt i din webbläsare - ingen registrering krävs.

## ✨ Funktioner

### 🎯 Fakturera rätt timpris
Räkna fram vilket timpris du behöver ta för dina tjänster. Ange din önskade lön, dina kostnader och hur många timmar du fakturerar per månad – få ett tydligt underlag för att sätta ett timpris som täcker lön, skatt och utgifter.

**Funktioner:**
- Beräkning baserad på önskad nettolön
- Anpassning för arbetsgivaravgifter
- Buffertalternativ för osäkra perioder
- Jämförelse av olika faktureringsscenarier

### 💰 Lön efter skatt
Beräkna din nettolön baserat på bruttolön och kommun. Använder Skatteverkets officiella skattetabeller för exakta beräkningar.

**Funktioner:**
- Kommunvisa skattesatser från Skatteverket
- Stöd för kyrkoavgift
- Jobbskatteavdrag
- Årlig översikt och månadsvis uppdelning

### 📊 Utdelningsplaneraren
Planera din lön, skatt och utdelning som konsult. Optimera din ekonomi över flera år med hänsyn till 3:12-reglerna.

**Funktioner:**
- Simulering över flera år
- Gränsbeloppsberäkningar enligt 3:12-regler
- Optimering av utdelning vs lön
- Visualisering av skatteeffekter

### 🏦 Tjänstepension
Räkna ut din tjänstepension enligt ITP-1 reglerna. Se hur pensionspremien beräknas baserat på lön och inkomstbasbelopp.

**Funktioner:**
- ITP-1 beräkningar
- Lönebaserade premier
- Prisbasbeloppsanpassning
- Överskjutande löneberäkningar

### 🚗 Förmånsbilskalkylator
Räkna ut nettoeffekten av en förmånsbil på din nettolön. Jämför bruttolöneavdrag och nettolöneavdrag, och se vilken modell som ger lägst kostnad.

**Funktioner:**
- Beräkning av förmånsvärde för olika bilmodeller
- Jämförelse mellan bruttolöneavdrag och nettolöneavdrag
- Integration med bilregister för exakta data
- Skatteeffektsberäkningar

### 📄 Belopp och procentsatser
Skatteuppgifter för fåmansföretag. Hitta gränsbelopp, procentsatser, takbelopp och lönekrav för olika inkomstår.

**Funktioner:**
- K10-blankett information
- Gränsbelopp för olika år
- Schablonbelopp
- Referensdata från Skatteverket

## 🚀 Installation

### Förutsättningar

- Node.js (version 18 eller senare)
- npm eller yarn

### Steg för steg

1. **Klona repositoryt**
```bash
git clone https://github.com/yourusername/konsultverktyg.git
cd konsultverktyg
```

2. **Installera beroenden**
```bash
npm install
```

3. **Konfigurera miljövariabler**
```bash
cp .env.example .env
```

Redigera `.env` och lägg till dina Supabase-uppgifter (om du använder databasen):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Starta utvecklingsservern**
```bash
npm run dev
```

Applikationen körs nu på `http://localhost:5173`

## 💻 Användning

### Utvecklingsläge

Kör utvecklingsservern med hot reload:

```bash
npm run dev
```

### Byggning för produktion

Skapa en produktionsbyggnad:

```bash
npm run build
```

Förhandsgranska produktionsbyggnaden:

```bash
npm run preview
```

### Linting och typkontroll

Kör ESLint:

```bash
npm run lint
```

Kör TypeScript typkontroll:

```bash
npm run typecheck
```

## 🔍 SEO och Prestanda

Konsulthjälpen är optimerad för sökmotorer och prestanda:

### SEO-funktioner

- **Omfattande Meta Tags:** Varje sida har unika, nyckelordsrika meta-taggar på svenska
- **Open Graph & Twitter Cards:** Optimerade sociala delningar
- **Structured Data (JSON-LD):** Schema.org markup för WebApplication och SoftwareApplication
- **XML Sitemap:** Automatiskt genererad sitemap för alla verktyg (`/sitemap.xml`)
- **Robots.txt:** Konfigurerad för optimal crawling
- **Dynamiska sidtitlar:** SEO-vänliga titlar för varje kalkylator
- **Canonical URLs:** Förhindrar duplikat innehåll
- **Svenska språkdeklarationer:** Korrekt `lang="sv"` och `locale="sv_SE"`

### Prestandaoptimering

- **Code Splitting:** Separata bundles för vendor och lucide-ikoner
- **Optimerad chunk-storlek:** Hanterad bundle-storlek för snabbare laddning
- **Preconnect & DNS-Prefetch:** Snabbare anslutningar till externa tjänster
- **Minifiering:** Optimerad produktionskod
- **Lazy Loading:** Komponenter laddas vid behov

### Tekniska SEO-förbättringar

```typescript
// Dynamiska meta tags per sida
<SEO
  title="Lön efter skatt"
  description="Beräkna din nettolön efter skatt..."
  keywords="lön efter skatt, nettolön kalkylator..."
  canonical="https://konsulthjalpen.se/lon-efter-skatt"
/>

// Structured Data för verktyg
<StructuredData
  type="tool"
  toolName="Lön efter skatt"
  toolDescription="Beräkna din nettolön..."
  toolUrl="https://konsulthjalpen.se/lon-efter-skatt"
/>
```

### Sökordsfokus

Optimerad för svenska sökord inom:
- Konsultverktyg och kalkylatorer
- Lön, skatt och nettolön
- Timpris och konsultarvode
- Utdelning och 3:12-regler
- Förmånsbil och bilförmån
- Tjänstepension ITP-1
- K10-blankett och fåmansföretag

## 🛠 Teknisk Stack

- **Frontend Framework:** React 18.3
- **Language:** TypeScript 5.5
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 7.9
- **Icons:** Lucide React
- **Database:** Supabase
- **Linting:** ESLint 9.9
- **SEO:** Custom SEO & StructuredData komponenter

## 📁 Projektstruktur

```
konsulthjalpen/
├── src/
│   ├── components/         # Återanvändbara komponenter
│   │   ├── PlatformLayout.tsx
│   │   ├── PlatformHeader.tsx
│   │   ├── PlatformFooter.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── TotalsCards.tsx
│   │   ├── YearTable.tsx
│   │   ├── DebugView.tsx
│   │   ├── SEO.tsx              # SEO meta tags hantering
│   │   ├── StructuredData.tsx   # JSON-LD schema markup
│   │   └── AdSenseUnit.tsx
│   ├── pages/                   # Sidkomponenter
│   │   ├── HomePage.tsx
│   │   ├── FaktureraRattTimpris.tsx
│   │   ├── LonEfterSkatt.tsx
│   │   ├── FormansbilCalculator.tsx
│   │   ├── Utdelningsplaneraren.tsx
│   │   ├── Tjanstepension.tsx
│   │   ├── K10Blankett.tsx
│   │   └── NotFound.tsx         # 404-sida
│   ├── lib/                     # Hjälpfunktioner och beräkningar
│   │   ├── calculations.ts
│   │   ├── skatteverket.ts
│   │   ├── taxTables.ts
│   │   ├── formansbilCalculations.ts
│   │   ├── cars.ts
│   │   └── labels.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── useTheme.ts
│   ├── types/                   # TypeScript typdefinitioner
│   │   └── index.ts
│   ├── imgs/                    # Bilder och assets
│   ├── App.tsx                  # Huvudkomponent
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global CSS
├── public/                      # Statiska filer
│   ├── robots.txt               # Sökmotorsinstruktioner
│   ├── sitemap.xml              # XML sitemap
│   └── Ads.txt                  # Google AdSense
├── .env                         # Miljövariabler (skapas av dig)
├── package.json                 # NPM-beroenden och scripts
├── tsconfig.json                # TypeScript-konfiguration
├── vite.config.ts               # Vite-konfiguration (med SEO opt.)
├── tailwind.config.js           # Tailwind CSS-konfiguration
└── README.md                    # Detta dokument
```

## 🔧 Utveckling

### Kodstil

Projektet använder ESLint för kodkvalitet. Följ dessa riktlinjer:

- Använd funktionella komponenter med hooks
- TypeScript för all kod
- Beskrivande variabel- och funktionsnamn
- Kommentarer för komplex affärslogik

### Teman

Applikationen stödjer ljust och mörkt tema. Tema-hantering sker via `useTheme` hook och CSS-variabler i `index.css`.

### Skatteverket API

Kommundata hämtas från Skatteverkets öppna API:
```
https://skatteverket.entryscape.net/store/9/resource/2
```

## 🤝 Bidra

Vi välkomnar bidrag! För att bidra:

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/AmazingFeature`)
3. Committa dina ändringar (`git commit -m 'Add some AmazingFeature'`)
4. Pusha till branchen (`git push origin feature/AmazingFeature`)
5. Öppna en Pull Request

### Riktlinjer för bidrag

- Säkerställ att din kod följer projektets kodstil
- Skriv tydliga commit-meddelanden
- Testa dina ändringar innan du skickar in
- Uppdatera dokumentation vid behov

## 📝 Licens

Detta projekt är licensierat under MIT-licensen - se [LICENSE](LICENSE) filen för detaljer.

## 👥 Författare

- Utvecklad av konsulter, för konsulter

## 🙏 Tack till

- [Skatteverket](https://skatteverket.se) för öppen skattedata
- [React](https://reactjs.org/) community
- [Vite](https://vitejs.dev/) team
- Alla bidragsgivare

## 🚀 SEO Checklista för Driftsättning

När du driftsätter till produktion, säkerställ följande:

- [ ] Uppdatera alla URL:er i `sitemap.xml` till din produktionsdomän
- [ ] Uppdatera canonical URLs i alla SEO-komponenter
- [ ] Lägg till Google Search Console verifiering
- [ ] Skicka in sitemap.xml till Google Search Console
- [ ] Konfigurera Google Analytics (valfritt)
- [ ] Verifiera robots.txt är tillgänglig
- [ ] Testa alla meta tags med [OpenGraph Preview](https://www.opengraph.xyz/)
- [ ] Verifiera strukturerad data med [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Lägg till SSL-certifikat (HTTPS)
- [ ] Konfigurera domän i `.env` filer

## 📧 Kontakt

Har du frågor eller förslag? Öppna gärna ett issue på GitHub.

---

**Hänvisning:** Detta verktyg tillhandahålls endast för informationssyfte. Konsultera alltid en skatterådgivare för specifika skatteråd.
