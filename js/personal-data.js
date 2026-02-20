// ===== Sport Type Definitions =====
const SPORT_TYPES = {
  tennis:     { emoji: "\ud83c\udfbe", label: { en: "Tennis",     ja: "\u30c6\u30cb\u30b9" } },
  swimming:   { emoji: "\ud83c\udfca", label: { en: "Swimming",   ja: "\u6c34\u6cf3" } },
  running:    { emoji: "\ud83c\udfc3", label: { en: "Running",    ja: "\u30e9\u30f3\u30cb\u30f3\u30b0" } },
  tournament: { emoji: "\ud83c\udfc6", label: { en: "Tournament", ja: "\u5927\u4f1a" } }
};

// ===== Racket Definitions =====
const RACKETS = {
  racket1: { name: { en: "Racket 1", ja: "\u30e9\u30b1\u30c3\u30c81" } },
  racket2: { name: { en: "Racket 2", ja: "\u30e9\u30b1\u30c3\u30c82" } }
};

// ===== Restring History =====
const RESTRING_HISTORY = [
  { date: "2025-10-17", racket: "racket2", tension: "55p" },
  { date: "2026-01-22", racket: "racket1", tension: "55p" }
];

// ===== Sports Activity Data =====
// Thu = Tennis, Sat/Sun = Swimming (through 2026-02-21)
const ACTIVITIES = {
  // January 2026
  "2026-01-01": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-04": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-08": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-10": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-11": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-13": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-15": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-17": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-18": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-22": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-24": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    },
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-25": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-01-31": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  // February 2026
  "2026-02-01": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-05": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-07": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-08": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-12": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-14": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-15": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-17": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-19": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-20": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30d5\u30a9\u30a2\u306f\u8107\u3092\u7d5e\u3081\u3066\u30b0\u30ea\u30c3\u30d7\u30a8\u30f3\u30c9\u304b\u3089\u51fa\u3059\u3002\u30d0\u30c3\u30af\u306f\u30b9\u30d4\u30f3\u7cfb\u4e2d\u5fc3\u306e\u914d\u7403\u3067\u547c\u5438\u304c\u4e71\u308c\u306a\u3044\u3088\u3046\u306b\u3002\u30b5\u30fc\u30d6\u306f\u901f\u5ea6\u3092\u843d\u3068\u3057\u30662\u672c\u3068\u3082\u89d2\u3092\u72d9\u3046\u3002\u30d0\u30c3\u30af\u30dc\u30ec\u30fc\u306e\u30a2\u30a6\u30c8\u30b5\u30a4\u30c9\u30a4\u30f3\u3067\u304d\u308a\u3059\u304e\u306a\u3044\u3002", en:"\u30fc" },
      result:{ ja:"\u30d5\u30a9\u30a2\u30fb\u30d0\u30c3\u30af\u30fb\u30b5\u30fc\u30d6\u306f\u4e45\u3057\u3076\u308a\u306b\u826f\u3044\u611f\u3058\u3060\u3063\u305f\u3002\u7d99\u7d9a\u3059\u308b\u305f\u3081\u306b\u65e9\u304f\u7df4\u7fd2\u3057\u305f\u3044\u3002\u8abf\u5b50\u304c\u826f\u304b\u3063\u305f\u306e\u306f2\u65e5\u9023\u7d9a\u3067\u8eab\u4f53\u304c\u307b\u3050\u308c\u3066\u3044\u305f\u304b\u3089\u3002\u9663\u5f62\u7df4\u7fd2\u306e\u6700\u7d42\u30b2\u30fc\u30e0\u3067\u3001\u9577\u3044\u30e9\u30ea\u30fc\u304c\u7d9a\u3044\u305f\u30dd\u30a4\u30f3\u30c8\u306e\u5f8c\u3001\u5fc3\u62cd\u6570\u304c\u623b\u3089\u305a\u3001\u30a4\u30fc\u30b8\u30fc\u30df\u30b9\u30922\u672c\u9023\u7d9a\u3057\u3066\u3057\u307e\u3063\u305f\u3002", en:"\u30fc" },
      challenge:{ ja:"\u300c\u9045\u3044\u7403\u306b\u6163\u308c\u3059\u304e\u3066\u304b\u3001\u30d0\u30c3\u30af\u30dc\u30ec\u30fc\u304c2\u6bb5\u968e\u3067\u5f15\u3044\u3066\u3044\u308b\u300d\u3068\u30b3\u30fc\u30c1\u306b\u30a2\u30c9\u30d0\u30a4\u30b9\u3092\u3082\u3089\u3063\u305f\u3002\u4e0d\u8abf\u306e\u539f\u56e0\u306f\u3053\u308c\u304b\u3082\u3002\u5fc3\u62cd\u6570\u306e\u623b\u308a\u304c\u9045\u304f\u306a\u3063\u3066\u308b\u3002", en:"\u30fc" },
      next:{ ja:"\u30d0\u30c3\u30af\u30dc\u30ec\u30fc\u306e\u30c6\u30a4\u30af\u30d0\u30c3\u30af\u3067\u3042\u305d\u3073\u3092\u6301\u305f\u305b\u306a\u3044\u3088\u3046\u306b\u3059\u308b\u3002", en:"\u30fc" }
    }
  ],
  "2026-02-21": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  "2026-02-28": [
    { sport:"tournament", emoji:"\ud83c\udfc6",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ],
  // April 2026
  "2026-04-12": [
    { sport:"tournament", emoji:"\ud83c\udfc6",
      focus:{ ja:"\u30fc", en:"\u30fc" },
      result:{ ja:"\u30fc", en:"\u30fc" }, challenge:{ ja:"\u30fc", en:"\u30fc" }, next:{ ja:"\u30fc", en:"\u30fc" }
    }
  ]
};

// ===== Personal Page Translations =====
const PERSONAL_TRANSLATIONS = {
  en: {
    "page.title": "Ryotaro Shimizu",
    "page.greeting": "My Practice Notes",
    "page.subtitle": "just a personal log",
    "page.portfolio": "Academic Portfolio",
    "calendar.title": "Sports Activity Calendar",
    "calendar.today": "Today",
    "tooltip.focus": "Focus",
    "tooltip.result": "Result",
    "tooltip.challenge": "Challenge",
    "tooltip.next": "Next time",
    "tooltip.restring": "Last Restring",
    "calendar.legend": "Legend",
    "calendar.sun": "Sun", "calendar.mon": "Mon", "calendar.tue": "Tue",
    "calendar.wed": "Wed", "calendar.thu": "Thu", "calendar.fri": "Fri",
    "calendar.sat": "Sat",
    "calendar.months": ["January","February","March","April","May","June",
                        "July","August","September","October","November","December"]
  },
  ja: {
    "page.title": "\u6e05\u6c34\u826f\u592a\u90ce",
    "page.greeting": "\u30ce\u30fc\u30c8",
    "page.subtitle": "\u30b9\u30dd\u30fc\u30c4\u30ed\u30b0",
    "page.portfolio": "\u30a2\u30ab\u30c7\u30df\u30c3\u30af\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa",
    "calendar.title": "\u30b9\u30dd\u30fc\u30c4\u6d3b\u52d5\u30ab\u30ec\u30f3\u30c0\u30fc",
    "calendar.today": "\u4eca\u65e5",
    "tooltip.focus": "\u610f\u8b58\u3057\u305f\u3053\u3068",
    "tooltip.result": "\u7d50\u679c",
    "tooltip.challenge": "\u8ab2\u984c",
    "tooltip.next": "\u6b21\u56de",
    "tooltip.restring": "\u6700\u7d42\u30ac\u30c3\u30c8\u8cbc\u308a\u66ff\u3048",
    "calendar.legend": "\u51e1\u4f8b",
    "calendar.sun": "\u65e5", "calendar.mon": "\u6708", "calendar.tue": "\u706b",
    "calendar.wed": "\u6c34", "calendar.thu": "\u6728", "calendar.fri": "\u91d1",
    "calendar.sat": "\u571f",
    "calendar.months": ["1\u6708","2\u6708","3\u6708","4\u6708","5\u6708","6\u6708",
                        "7\u6708","8\u6708","9\u6708","10\u6708","11\u6708","12\u6708"]
  }
};
