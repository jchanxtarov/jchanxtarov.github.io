const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
  setup() {
    // ── Shared State (synced with portfolio via localStorage) ──
    const lang = ref(localStorage.getItem("lang") || "en");
    const theme = ref(
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light")
    );

    // ── Calendar State ──
    const now = new Date();
    const currentYear = ref(now.getFullYear());
    const currentMonth = ref(now.getMonth());
    const hoveredDate = ref(null);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    // ── Translations ──
    const t = computed(() => PERSONAL_TRANSLATIONS[lang.value] || PERSONAL_TRANSLATIONS.en);
    const langLabel = computed(() => lang.value === "en" ? "JP" : "EN");
    const themeIcon = computed(() => theme.value === "dark" ? "fas fa-sun" : "fas fa-moon");

    // ── Calendar Computed ──
    const monthName = computed(() => t.value["calendar.months"][currentMonth.value]);

    const dayHeaders = computed(() => [
      t.value["calendar.sun"], t.value["calendar.mon"], t.value["calendar.tue"],
      t.value["calendar.wed"], t.value["calendar.thu"], t.value["calendar.fri"],
      t.value["calendar.sat"]
    ]);

    const calendarDays = computed(() => {
      const year = currentYear.value;
      const month = currentMonth.value;
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = [];
      for (let i = 0; i < firstDay; i++) {
        days.push({ date: null, day: null, activities: [] });
      }
      const today = new Date();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
        days.push({
          date: dateStr,
          day: d,
          activities: ACTIVITIES[dateStr] || [],
          isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
        });
      }
      return days;
    });

    // ── Navigation bounds: Jan 2026 to current month ──
    const canGoPrev = computed(() => !(currentYear.value === 2026 && currentMonth.value === 0));
    const canGoNext = computed(() => {
      const n = new Date();
      return !(currentYear.value === n.getFullYear() && currentMonth.value === n.getMonth());
    });

    function prevMonth() {
      if (!canGoPrev.value) return;
      if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value--; }
      else { currentMonth.value--; }
    }

    function nextMonth() {
      if (!canGoNext.value) return;
      if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++; }
      else { currentMonth.value++; }
    }

    // ── Tooltip ──
    function showTooltip(dateStr, event) {
      if (!ACTIVITIES[dateStr]) return;
      hoveredDate.value = dateStr;
      const rect = event.currentTarget.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = rect.left + rect.width / 2;
      let y = rect.top - 8;
      // Prevent right overflow
      if (x + 180 > vw) x = vw - 200;
      // Prevent left overflow
      if (x - 140 < 0) x = 160;
      tooltipX.value = x;
      tooltipY.value = y;
    }

    function hideTooltip() {
      hoveredDate.value = null;
    }

    const tooltipActivities = computed(() => {
      if (!hoveredDate.value) return [];
      return ACTIVITIES[hoveredDate.value] || [];
    });

    const tooltipStyle = computed(() => ({
      left: tooltipX.value + "px",
      bottom: (window.innerHeight - tooltipY.value) + "px",
      transform: "translateX(-50%)"
    }));

    // ── Theme / Lang Toggles ──
    function toggleLang() {
      lang.value = lang.value === "en" ? "ja" : "en";
      localStorage.setItem("lang", lang.value);
    }

    function toggleTheme() {
      theme.value = theme.value === "dark" ? "light" : "dark";
      localStorage.setItem("theme", theme.value);
    }

    // ── Apply theme on load & watch ──
    watch(theme, (val) => {
      document.documentElement.setAttribute("data-theme", val);
    }, { immediate: true });

    return {
      lang, theme, t, langLabel, themeIcon,
      currentYear, currentMonth, monthName, dayHeaders, calendarDays,
      canGoPrev, canGoNext, prevMonth, nextMonth,
      hoveredDate, tooltipActivities, tooltipStyle, showTooltip, hideTooltip,
      toggleLang, toggleTheme,
      SPORT_TYPES
    };
  }
}).mount("#app");
