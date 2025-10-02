export const labels = {
  site: {
    title: {
      sv: 'Utdelningsplaneraren',
      en: 'Dividend Planner',
    },
    subtitle: {
      sv: 'Lön, skatt och utdelningsplanering för konsulter',
      en: 'Salary, taxes, and dividend planning for consultants',
    },
  },
  terms: {
    grossSalary: {
      sv: 'Bruttolön',
      en: 'Gross salary',
      desc: {
        sv: 'Lön före skatt per månad eller år.',
        en: 'Salary before tax per month or year.',
      },
    },
    netSalary: {
      sv: 'Nettolön',
      en: 'Net salary',
      desc: {
        sv: 'Lön efter skatt per månad eller år.',
        en: 'Salary after tax per month or year.',
      },
    },
    employerContribution: {
      sv: 'Arbetsgivaravgift',
      en: 'Employer contribution',
      desc: {
        sv: 'Sociala avgifter som företaget betalar på lön.',
        en: 'Social security fee paid by the employer on top of salary.',
      },
    },
    regionalSupport: {
      sv: 'Regionalt stöd',
      en: 'Regional support',
      desc: {
        sv: 'Nedsättning av arbetsgivaravgifter för fast driftställe i stödområden. 10% avdrag, max 7 100 kr/månad.',
        en: 'Employer contribution reduction for fixed establishments in support areas. 10% deduction, max 7,100 SEK/month.',
      },
    },
    municipalTax: {
      sv: 'Kommunalskatt',
      en: 'Municipal tax',
      desc: {
        sv: 'Skatt som betalas till kommunen på lön.',
        en: 'Local income tax applied to salary.',
      },
    },
    marginalTaxRate: {
      sv: 'Marginalskatt',
      en: 'Marginal tax rate',
      desc: {
        sv: 'Skattesats på inkomster över en viss gräns.',
        en: 'Tax rate applied to income above a certain threshold.',
      },
    },
    operatingSurplus: {
      sv: 'Överskott',
      en: 'Operating surplus',
      desc: {
        sv: 'Intäkter minus lön, avgifter och kostnader.',
        en: 'Revenue minus salary, fees, and costs.',
      },
    },
    netProfit: {
      sv: 'Årets resultat',
      en: 'Net profit after corporate tax',
      desc: {
        sv: 'Resultat efter bolagsskatt.',
        en: 'Profit after corporate tax.',
      },
    },
    equityOpening: {
      sv: 'Ingående fritt eget kapital',
      en: 'Opening free equity',
      desc: {
        sv: 'Kapital från tidigare år som finns kvar att dela ut.',
        en: 'Equity carried forward from previous years available for distribution.',
      },
    },
    equityClosing: {
      sv: 'Utgående fritt eget kapital',
      en: 'Closing free equity',
      desc: {
        sv: 'Kapital som blir kvar efter årets resultat och utdelning.',
        en: 'Equity left after profit and dividends this year.',
      },
    },
    freeEquity: {
      sv: 'Fritt eget kapital',
      en: 'Free equity',
      desc: {
        sv: 'Kapital i bolaget som får delas ut.',
        en: 'Equity in the company available for distribution.',
      },
    },
    buffer: {
      sv: 'Buffert',
      en: 'Buffer',
      desc: {
        sv: 'Andel av överskottet som sparas i bolaget.',
        en: 'Share of surplus retained in the company.',
      },
    },
    grossDividend: {
      sv: 'Utdelning brutto',
      en: 'Gross dividend',
      desc: {
        sv: 'Utdelning före skatt.',
        en: 'Dividend before taxes.',
      },
    },
    netDividend: {
      sv: 'Utdelning netto',
      en: 'Net dividend',
      desc: {
        sv: 'Utdelning efter skatt.',
        en: 'Dividend after taxes.',
      },
    },
    dividendPct: {
      sv: 'Utdelning (%)',
      en: 'Dividend percentage',
      desc: {
        sv: 'Andel av maximalt utdelningsbart kapital som delas ut.',
        en: 'Percentage of maximum distributable equity chosen for payout.',
      },
    },
    dividendAllowanceSEK: {
      sv: 'Utdelningsutrymme (kr)',
      en: 'Dividend allowance (SEK)',
      desc: {
        sv: 'Belopp som kan delas ut med 20 % skatt enligt 3:12.',
        en: 'Amount eligible for 20% tax under 3:12 rules.',
      },
    },
    dividendAllowancePct: {
      sv: 'Utdelningsutrymme (%)',
      en: 'Dividend allowance (%)',
      desc: {
        sv: 'Andel av kapitalet som kan delas ut till 20 % skatt.',
        en: 'Share of equity eligible for 20% tax.',
      },
    },
    savedDividendAllowance: {
      sv: 'Sparat utdelningsutrymme',
      en: 'Saved dividend allowance',
      desc: {
        sv: 'Outnyttjat utdelningsutrymme som förs vidare.',
        en: 'Unused dividend allowance carried forward.',
      },
    },
    maxDividendByEquity: {
      sv: 'Max utdelning p.g.a. EK',
      en: 'Maximum distributable by equity',
      desc: {
        sv: 'Högsta utdelning som tillåts enligt fritt eget kapital.',
        en: 'Highest dividend allowed by available free equity.',
      },
    },
    simplifiedRule: {
      sv: 'Förenklingsregeln',
      en: 'Simplified rule',
      desc: {
        sv: 'Ger ett schablonbelopp (2,75 × IBB) i lågbeskattad utdelning.',
        en: 'Provides a standard allowance (2.75 × IBB) for low-tax dividends.',
      },
    },
    mainRule: {
      sv: 'Huvudregeln',
      en: 'Main rule',
      desc: {
        sv: 'Baserar utrymmet på löneunderlag och aktiernas anskaffningsvärde.',
        en: 'Allowance based on payroll costs and share acquisition value.',
      },
    },
    ibb: {
      sv: 'Inkomstbasbelopp (IBB)',
      en: 'Income base amount (IBB)',
      desc: {
        sv: 'Fast belopp som ändras varje år och används i beräkningar.',
        en: 'A government-set base amount updated yearly, used in tax calculations.',
      },
    },
    payrollBasis: {
      sv: 'Löneunderlag',
      en: 'Payroll basis',
      desc: {
        sv: 'Totala lönekostnader i bolaget under året.',
        en: 'Total salary expenses in the company for the year.',
      },
    },
    qualifiedShare: {
      sv: 'Kvalificerad andel i fåmansföretag',
      en: 'Qualified share in closely held company',
      desc: {
        sv: 'Aktier i fåmansbolag där ägaren är verksam i betydande omfattning.',
        en: 'Shares in a closely held company where the owner is actively working.',
      },
    },
  },
};
