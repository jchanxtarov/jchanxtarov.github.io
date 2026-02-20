// ===== Sport Type Definitions =====
const SPORT_TYPES = {
  tennis:     { emoji: "\ud83c\udfbe", label: { en: "Tennis",     ja: "\u30c6\u30cb\u30b9" } },
  swimming:   { emoji: "\ud83c\udfca", label: { en: "Swimming",   ja: "\u6c34\u6cf3" } },
  running:    { emoji: "\ud83c\udfc3", label: { en: "Running",    ja: "\u30e9\u30f3\u30cb\u30f3\u30b0" } },
  tournament: { emoji: "\ud83c\udfc6", label: { en: "Tournament", ja: "\u5927\u4f1a" } }
};

// ===== Sports Activity Data =====
const ACTIVITIES = {
  // January 2026
  "2026-01-05": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30d5\u30a9\u30a2\u30cf\u30f3\u30c9\u306e\u30b9\u30d4\u30f3\u91cf\u3092\u5897\u3084\u3059", en:"Increase topspin on forehand" },
      did:{ ja:"\u7403\u51fa\u3057\u7df4\u7fd2 30\u5206\u3001\u30b7\u30f3\u30b0\u30eb\u30b9 3\u30bb\u30c3\u30c8", en:"30min ball drills, 3 sets of singles" },
      result:{ ja:"\u30b9\u30d4\u30f3\u91cf\u306f\u6539\u5584\u3002\u30b3\u30f3\u30c8\u30ed\u30fc\u30eb\u304c\u307e\u3060\u4e0d\u5b89\u5b9a", en:"Spin improved. Control still inconsistent." },
      next:{ ja:"\u30d5\u30a9\u30ed\u30fc\u30b9\u30eb\u30fc\u306e\u9ad8\u3055\u3092\u610f\u8b58\u3059\u308b", en:"Focus on follow-through height" }
    }
  ],
  "2026-01-08": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30af\u30ed\u30fc\u30eb\u306e\u606f\u7d99\u304e\u30ea\u30ba\u30e0", en:"Freestyle breathing rhythm" },
      did:{ ja:"1000m\uff0825m \u00d7 40\u672c\uff09", en:"1000m (25m x 40 laps)" },
      result:{ ja:"\u5f8c\u534a\u306e\u30da\u30fc\u30b9\u304c\u843d\u3061\u305f", en:"Pace dropped in second half" },
      next:{ ja:"\u30da\u30fc\u30b9\u914d\u5206\u3092\u610f\u8b58\u3059\u308b", en:"Focus on pacing strategy" }
    }
  ],
  "2026-01-12": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30b5\u30fc\u30d6\u306e\u30c8\u30b9\u5b89\u5b9a", en:"Serve toss consistency" },
      did:{ ja:"\u30b5\u30fc\u30d6\u7df4\u7fd2 1\u6642\u9593\u3001\u30c0\u30d6\u30eb\u30b9 2\u30bb\u30c3\u30c8", en:"1hr serve practice, 2 sets doubles" },
      result:{ ja:"\u30d5\u30a1\u30fc\u30b9\u30c8\u30b5\u30fc\u30d6\u7387 60%\u219270%\u306b\u6539\u5584", en:"1st serve % improved 60% to 70%" },
      next:{ ja:"\u30bb\u30ab\u30f3\u30c9\u30b5\u30fc\u30d6\u306e\u30b9\u30d4\u30f3", en:"Second serve spin" }
    }
  ],
  "2026-01-15": [
    { sport:"running", emoji:"\ud83c\udfc3",
      focus:{ ja:"5km\u306e\u30da\u30fc\u30b9\u8d70", en:"5km pace run" },
      did:{ ja:"5km 25\u5206\u30da\u30fc\u30b9", en:"5km at 25min pace" },
      result:{ ja:"\u5b8c\u8d70\u3002\u6700\u5f8c 1km \u304c\u304d\u3064\u304b\u3063\u305f", en:"Completed. Last 1km was tough" },
      next:{ ja:"\u30da\u30fc\u30b9\u3092\u5747\u4e00\u306b\u4fdd\u3064", en:"Keep even pace throughout" }
    }
  ],
  "2026-01-19": [
    { sport:"tournament", emoji:"\ud83c\udfc6",
      focus:{ ja:"\u8a66\u5408\u3067\u306e\u96c6\u4e2d\u529b\u7dad\u6301", en:"Maintain focus during match" },
      did:{ ja:"TaRO's CUP \u7b2c7\u56de\u5927\u4f1a \u30b7\u30f3\u30b0\u30eb\u30b9\u51fa\u5834", en:"TaRO's CUP 7th tournament, singles" },
      result:{ ja:"\u6e96\u6c7a\u52dd\u9032\u51fa", en:"Reached semi-finals" },
      next:{ ja:"\u30bf\u30a4\u30d6\u30ec\u30fc\u30af\u3067\u306e\u51b7\u9759\u3055", en:"Stay calm in tiebreaks" }
    }
  ],
  "2026-01-22": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30d0\u30bf\u30d5\u30e9\u30a4\u306e\u30ad\u30c3\u30af\u5f37\u5316", en:"Strengthen butterfly kick" },
      did:{ ja:"800m\uff08\u30d0\u30bf\u30d5\u30e9\u30a4\u4e2d\u5fc3\uff09", en:"800m (mostly butterfly)" },
      result:{ ja:"\u30ad\u30c3\u30af\u306e\u30ea\u30ba\u30e0\u304c\u6539\u5584", en:"Kick rhythm improved" },
      next:{ ja:"\u8155\u306e\u5165\u6c34\u89d2\u5ea6\u3092\u610f\u8b58", en:"Focus on arm entry angle" }
    }
  ],
  "2026-01-26": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30dc\u30ec\u30fc\u306e\u6df1\u3055\u3068\u30b3\u30f3\u30c8\u30ed\u30fc\u30eb", en:"Volley depth and control" },
      did:{ ja:"\u30dc\u30ec\u30fc\u7df4\u7fd2\u3001\u30c0\u30d6\u30eb\u30b9 3\u30bb\u30c3\u30c8", en:"Volley drills, 3 sets doubles" },
      result:{ ja:"\u30cd\u30c3\u30c8\u30d7\u30ec\u30fc\u306e\u5b89\u5b9a\u611f\u304c\u5411\u4e0a", en:"Net play consistency improved" },
      next:{ ja:"\u30a2\u30d7\u30ed\u30fc\u30c1\u30b7\u30e7\u30c3\u30c8\u304b\u3089\u306e\u5c55\u958b", en:"Work on approach shot transitions" }
    }
  ],
  // February 2026
  "2026-02-01": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u80cc\u6cf3\u304e\u306e\u30d5\u30a9\u30fc\u30e0\u6539\u5584", en:"Backstroke form improvement" },
      did:{ ja:"800m\uff08\u80cc\u6cf3\u304e\u4e2d\u5fc3\uff09", en:"800m (mostly backstroke)" },
      result:{ ja:"\u80a9\u306e\u56de\u8ee2\u304c\u6539\u5584", en:"Shoulder rotation improved" },
      next:{ ja:"\u30ad\u30c3\u30af\u306e\u30ea\u30ba\u30e0\u3092\u5408\u308f\u305b\u308b", en:"Sync kick rhythm" }
    }
  ],
  "2026-02-05": [
    { sport:"running", emoji:"\ud83c\udfc3",
      focus:{ ja:"\u30a4\u30f3\u30bf\u30fc\u30d0\u30eb\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0", en:"Interval training" },
      did:{ ja:"400m \u00d7 8\u672c\uff08rest 90\u79d2\uff09", en:"400m x 8 reps (90s rest)" },
      result:{ ja:"\u5f8c\u534a 4\u672c\u306e\u30bf\u30a4\u30e0\u304c\u843d\u3061\u305f", en:"Times dropped on last 4 reps" },
      next:{ ja:"\u524d\u534a\u3092\u63a7\u3048\u3081\u306b\u5165\u308b", en:"Start conservatively in first half" }
    }
  ],
  "2026-02-08": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30d0\u30c3\u30af\u30cf\u30f3\u30c9\u30b9\u30e9\u30a4\u30b9\u306e\u6df1\u3055", en:"Backhand slice depth" },
      did:{ ja:"\u30e9\u30ea\u30fc\u7df4\u7fd2\u3001\u8a66\u5408\u5f62\u5f0f 2\u30bb\u30c3\u30c8", en:"Rally drills, 2 match-play sets" },
      result:{ ja:"\u30b9\u30e9\u30a4\u30b9\u306e\u6df1\u3055\u304c\u5b89\u5b9a\u3057\u3066\u304d\u305f", en:"Slice depth becoming more consistent" },
      next:{ ja:"\u30a2\u30d7\u30ed\u30fc\u30c1\u304b\u3089\u306e\u30cd\u30c3\u30c8\u30d7\u30ec\u30fc", en:"Net play after approach shots" }
    }
  ],
  "2026-02-11": [
    { sport:"swimming", emoji:"\ud83c\udfca",
      focus:{ ja:"\u30af\u30ed\u30fc\u30eb\u306e\u30bf\u30fc\u30f3\u6280\u8853", en:"Freestyle flip turn technique" },
      did:{ ja:"1000m\uff08\u30bf\u30fc\u30f3\u7df4\u7fd2\u542b\u3080\uff09", en:"1000m (including turn drills)" },
      result:{ ja:"\u30bf\u30fc\u30f3\u5f8c\u306e\u30b9\u30c8\u30ea\u30fc\u30e0\u30e9\u30a4\u30f3\u304c\u6539\u5584", en:"Streamline after turn improved" },
      next:{ ja:"\u58c1\u3092\u8e74\u308b\u529b\u3092\u5f37\u5316", en:"Strengthen wall push-off" }
    }
  ],
  "2026-02-15": [
    { sport:"running", emoji:"\ud83c\udfc3",
      focus:{ ja:"10km\u306e\u9577\u8ddd\u96e2\u8d70", en:"10km long distance run" },
      did:{ ja:"10km 55\u5206", en:"10km in 55 minutes" },
      result:{ ja:"\u5b8c\u8d70\u3002\u30da\u30fc\u30b9\u306f\u307b\u307c\u5747\u4e00", en:"Completed. Pace was fairly even" },
      next:{ ja:"50\u5206\u5207\u308a\u3092\u76ee\u6307\u3059", en:"Aim for sub-50 minutes" }
    }
  ],
  "2026-02-19": [
    { sport:"tennis", emoji:"\ud83c\udfbe",
      focus:{ ja:"\u30ea\u30bf\u30fc\u30f3\u306e\u30b3\u30fc\u30b9\u3068\u6df1\u3055", en:"Return placement and depth" },
      did:{ ja:"\u30ea\u30bf\u30fc\u30f3\u7df4\u7fd2\u3001\u30b7\u30f3\u30b0\u30eb\u30b9 2\u30bb\u30c3\u30c8", en:"Return drills, 2 sets singles" },
      result:{ ja:"\u30d5\u30a9\u30a2\u30ea\u30bf\u30fc\u30f3\u306e\u6df1\u3055\u304c\u5b89\u5b9a", en:"Forehand return depth improved" },
      next:{ ja:"\u30d0\u30c3\u30af\u30cf\u30f3\u30c9\u30ea\u30bf\u30fc\u30f3\u306e\u30b3\u30fc\u30b9", en:"Backhand return placement" }
    }
  ]
};

// ===== Personal Page Translations =====
const PERSONAL_TRANSLATIONS = {
  en: {
    "page.title": "Ryotaro Shimizu",
    "page.greeting": "Welcome to my personal page",
    "page.subtitle": "Sports Activity Log",
    "page.portfolio": "Academic Portfolio",
    "calendar.title": "Sports Activity Calendar",
    "calendar.today": "Today",
    "tooltip.focus": "Focus",
    "tooltip.did": "Activity",
    "tooltip.result": "Result",
    "tooltip.next": "Next time",
    "calendar.legend": "Legend",
    "calendar.sun": "Sun", "calendar.mon": "Mon", "calendar.tue": "Tue",
    "calendar.wed": "Wed", "calendar.thu": "Thu", "calendar.fri": "Fri",
    "calendar.sat": "Sat",
    "calendar.months": ["January","February","March","April","May","June",
                        "July","August","September","October","November","December"]
  },
  ja: {
    "page.title": "\u6e05\u6c34\u826f\u592a\u90ce",
    "page.greeting": "\u500b\u4eba\u30da\u30fc\u30b8\u3078\u3088\u3046\u3053\u305d",
    "page.subtitle": "\u30b9\u30dd\u30fc\u30c4\u6d3b\u52d5\u8a18\u9332",
    "page.portfolio": "\u30a2\u30ab\u30c7\u30df\u30c3\u30af\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa",
    "calendar.title": "\u30b9\u30dd\u30fc\u30c4\u6d3b\u52d5\u30ab\u30ec\u30f3\u30c0\u30fc",
    "calendar.today": "\u4eca\u65e5",
    "tooltip.focus": "\u610f\u8b58\u3057\u305f\u3053\u3068",
    "tooltip.did": "\u3084\u3063\u305f\u3053\u3068",
    "tooltip.result": "\u7d50\u679c",
    "tooltip.next": "\u6b21\u56de",
    "calendar.legend": "\u51e1\u4f8b",
    "calendar.sun": "\u65e5", "calendar.mon": "\u6708", "calendar.tue": "\u706b",
    "calendar.wed": "\u6c34", "calendar.thu": "\u6728", "calendar.fri": "\u91d1",
    "calendar.sat": "\u571f",
    "calendar.months": ["1\u6708","2\u6708","3\u6708","4\u6708","5\u6708","6\u6708",
                        "7\u6708","8\u6708","9\u6708","10\u6708","11\u6708","12\u6708"]
  }
};
