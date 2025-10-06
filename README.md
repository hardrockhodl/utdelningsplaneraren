# Konsultverktyg

> En komplett verktygslåda för konsulter och företagare i Sverige

Ett webbaserat verktyg som hjälper svenska konsulter och egenföretagare att beräkna timpris, löner, utdelningar och skatter enligt svenska skatteregler.

[![Built with React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)

## 📋 Innehållsförteckning

- [Översikt](#översikt)
- [Funktioner](#funktioner)
- [Installation](#installation)
- [Användning](#användning)
- [Teknisk Stack](#teknisk-stack)
- [Projektstruktur](#projektstruktur)
- [Utveckling](#utveckling)
- [Bidra](#bidra)
- [Licens](#licens)

## 🎯 Översikt

Konsultverktyg är en svensk kalkylator-plattform som hjälper dig att:

- **Beräkna rätt timpris** för dina konsulttjänster
- **Planera lön och utdelningar** enligt 3:12-reglerna
- **Förstå skattekonsekvenser** i fåmansföretag
- **Optimera din ekonomi** över flera år

Alla beräkningar följer Skatteverkets officiella regler och skattetabeller.

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
Beräkna nettoeffekten av en förmånsbil på din nettolön. Välj bil från Skatteverkets databas eller ange värden manuellt.

**Funktioner:**
- Databas med bilmodeller från Skatteverket
- Automatisk beräkning av förmånsvärde
- Stöd för nettolöne- och bruttolöneavdrag
- Jämförelse med privat leasing
- Reducering för 3000 mil i tjänsten

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

## 🛠 Teknisk Stack

- **Frontend Framework:** React 18.3
- **Language:** TypeScript 5.5
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router 7.9
- **Icons:** Lucide React
- **Database:** Supabase
- **Linting:** ESLint 9.9

## 📁 Projektstruktur

```
konsultverktyg/
├── src/
│   ├── components/         # Återanvändbara komponenter
│   │   ├── PlatformLayout.tsx
│   │   ├── PlatformHeader.tsx
│   │   ├── PlatformFooter.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── TotalsCards.tsx
│   │   ├── YearTable.tsx
│   │   └── DebugView.tsx
│   ├── pages/             # Sidkomponenter
│   │   ├── HomePage.tsx
│   │   ├── FaktureraRattTimpris.tsx
│   │   ├── LonEfterSkatt.tsx
│   │   ├── Utdelningsplaneraren.tsx
│   │   ├── Tjanstepension.tsx
│   │   ├── K10Blankett.tsx
│   │   ├── FormansbilCalculator.tsx
│   │   └── AdminCarSync.tsx
│   ├── lib/               # Hjälpfunktioner och beräkningar
│   │   ├── calculations.ts
│   │   ├── skatteverket.ts
│   │   ├── taxTables.ts
│   │   ├── labels.ts
│   │   ├── supabase.ts
│   │   ├── carsDatabase.ts
│   │   ├── syncCarData.ts
│   │   └── formansbilCalculations.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useTheme.ts
│   ├── types/             # TypeScript typdefinitioner
│   │   └── index.ts
│   ├── imgs/              # Bilder och assets
│   ├── App.tsx            # Huvudkomponent
│   ├── main.tsx           # Entry point
│   └── index.css          # Global CSS
├── public/                # Statiska filer
├── .env                   # Miljövariabler (skapas av dig)
├── package.json           # NPM-beroenden och scripts
├── tsconfig.json          # TypeScript-konfiguration
├── vite.config.ts         # Vite-konfiguration
├── tailwind.config.js     # Tailwind CSS-konfiguration
└── README.md             # Detta dokument
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

Kommundata och bildata hämtas från Skatteverkets öppna API:

**Kommuner:**
```
https://skatteverket.entryscape.net/store/9/resource/2
```

**Bildata:**
```
https://skatteverket.entryscape.net/rowstore/dataset/fad86bf9-67e3-4d68-829c-7b9a23bc5e42/json
```

### Car Data Sync

Förmånsbilskalkylatorn använder en Supabase-databas för att lagra bildata från Skatteverket. Detta ger snabbare laddningstider jämfört med att hämta alla bilar direkt från API:et vid varje sidladdning.

**Första gången:**
- Applikationen synkar automatiskt bildata från Skatteverket när du besöker förmånsbilskalkylatorn
- Synkprocessen tar cirka 10-30 sekunder och görs bara en gång

**Uppdatera data:**
- Besök `/admin/car-sync` för att manuellt synka bildata
- Använd uppdateringsknappen i förmånsbilskalkylatorn

**Databasstruktur:**
- `car_records` - Lagrar bilmodeller, priser, fordonsskatt, etc.
- `car_data_metadata` - Spårar senaste synktidpunkt och status

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

## 📧 Kontakt

Har du frågor eller förslag? Öppna gärna ett issue på GitHub.

---

**Hänvisning:** Detta verktyg tillhandahålls endast för informationssyfte. Konsultera alltid en skatterådgivare för specifika skatteråd.
