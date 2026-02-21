const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

createApp({
  setup() {
    // ── Reactive State ──
    const lang = ref(localStorage.getItem("lang") || "en");
    const theme = ref(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"));
    const menuOpen = ref(false);
    const pubFilter = ref("all");
    const pubSort = ref("year"); // "year" (newest) or "oldest"
    const showAllPubs = ref(false);
    const showAllTalks = ref(false);
    const showAllAwards = ref(false);
    const showAllMedia = ref(false);
    const showAllNews = ref(false);
    const publications = ref([...PUBLICATIONS]);

    // ── View Routing (hash-based) ──
    const currentView = ref(window.location.hash === '#personal' ? 'personal' : 'portfolio');

    function onHashChange() {
      currentView.value = window.location.hash === '#personal' ? 'personal' : 'portfolio';
      window.scrollTo({ top: 0 });
    }

    // ── Personal Calendar State ──
    const calNow = new Date();
    const calYear = ref(calNow.getFullYear());
    const calMonth = ref(calNow.getMonth());
    const calHoveredDate = ref(null);
    const calTooltipX = ref(0);
    const calTooltipY = ref(0);
    let calHideTimer = null;
    const legendTooltipVisible = ref(false);
    const legendTooltipX = ref(0);
    const legendTooltipY = ref(0);

    // ── Computed ──
    const t = computed(() => TRANSLATIONS[lang.value] || TRANSLATIONS.en);
    const pt = computed(() => PERSONAL_TRANSLATIONS[lang.value] || PERSONAL_TRANSLATIONS.en);
    const langLabel = computed(() => lang.value === "en" ? "JP" : "EN");
    const themeIcon = computed(() => theme.value === "dark" ? "fas fa-sun" : "fas fa-moon");

    // ── Calendar Computed ──
    const calMonthName = computed(() => pt.value["calendar.months"][calMonth.value]);
    const calDisplayDate = computed(() => {
      if (lang.value === "ja") return calYear.value + "\u5E74" + calMonthName.value;
      return calMonthName.value + " " + calYear.value;
    });
    const calDayHeaders = computed(() => [
      pt.value["calendar.sun"], pt.value["calendar.mon"], pt.value["calendar.tue"],
      pt.value["calendar.wed"], pt.value["calendar.thu"], pt.value["calendar.fri"],
      pt.value["calendar.sat"]
    ]);
    const calDays = computed(() => {
      const year = calYear.value;
      const month = calMonth.value;
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
    const calCanGoPrev = computed(() => !(calYear.value === 2026 && calMonth.value === 0));
    const calMaxDate = computed(() => {
      const now = new Date();
      let maxY = now.getFullYear(), maxM = now.getMonth();
      Object.keys(ACTIVITIES).forEach(d => {
        const [y, m] = d.split("-").map(Number);
        if (y * 12 + (m - 1) > maxY * 12 + maxM) { maxY = y; maxM = m - 1; }
      });
      return { year: maxY, month: maxM };
    });
    const calCanGoNext = computed(() => {
      return !(calYear.value === calMaxDate.value.year && calMonth.value === calMaxDate.value.month);
    });
    const calTooltipActivities = computed(() => {
      if (!calHoveredDate.value) return [];
      return ACTIVITIES[calHoveredDate.value] || [];
    });
    const calTooltipStyle = computed(() => ({
      left: calTooltipX.value + "px",
      top: calTooltipY.value + "px"
    }));

    const greeting = computed(() => {
      const hour = new Date().getHours();
      if (lang.value === 'ja') {
        if (hour >= 5 && hour < 12) return 'おはようございます、';
        if (hour >= 12 && hour < 18) return 'こんにちは、';
        return 'こんばんは、';
      }
      if (hour >= 5 && hour < 12) return 'Good Morning,';
      if (hour >= 12 && hour < 18) return 'Good Afternoon,';
      return 'Good Evening,';
    });

    const MONTH_ORDER = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
    function pubSortKey(p) {
      if (p.date) {
        const parts = p.date.split(" ");
        if (parts.length === 2 && MONTH_ORDER[parts[0]] !== undefined) {
          return p.year * 12 + MONTH_ORDER[parts[0]];
        }
      }
      return p.year * 12;
    }

    const filteredPubs = computed(() => {
      let pubs = publications.value;
      if (pubFilter.value !== "all") {
        pubs = pubs.filter(p => p.type === pubFilter.value);
      }
      pubs = [...pubs].sort((a, b) => {
        const ka = pubSortKey(a);
        const kb = pubSortKey(b);
        if (pubSort.value === "oldest") {
          return ka - kb;
        }
        // Default: newest first
        return kb - ka;
      });
      return pubs;
    });

    const displayedPubs = computed(() => {
      if (showAllPubs.value) return filteredPubs.value;
      return filteredPubs.value.slice(0, 5);
    });

    const talks = computed(() => TALKS);
    const displayedTalks = computed(() => showAllTalks.value ? talks.value : talks.value.slice(0, 3));
    const news = computed(() => t.value["news.items"] || []);
    const displayedNews = computed(() => showAllNews.value ? news.value : news.value.slice(0, 4));
    const awards = computed(() => t.value["awards.items"] || []);
    const displayedAwards = computed(() => showAllAwards.value ? awards.value : awards.value.slice(0, 3));
    const media = computed(() => MEDIA);
    const displayedMedia = computed(() => showAllMedia.value ? media.value : media.value.slice(0, 4));

    // ── Methods ──
    function toggleLang() {
      lang.value = lang.value === "en" ? "ja" : "en";
      localStorage.setItem("lang", lang.value);
    }

    function toggleTheme() {
      theme.value = theme.value === "dark" ? "light" : "dark";
      localStorage.setItem("theme", theme.value);
    }

    function toggleMenu() {
      menuOpen.value = !menuOpen.value;
    }

    function closeMenu() {
      menuOpen.value = false;
    }

    function scrollToTop() {
      if (currentView.value === 'personal') {
        currentView.value = 'portfolio';
        history.replaceState(null, '', window.location.pathname);
        window.scrollTo({ top: 0 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', window.location.pathname);
      }
    }

    // ── Calendar Methods ──
    function calPrevMonth() {
      if (!calCanGoPrev.value) return;
      if (calMonth.value === 0) { calMonth.value = 11; calYear.value--; }
      else { calMonth.value--; }
    }
    function calNextMonth() {
      if (!calCanGoNext.value) return;
      if (calMonth.value === 11) { calMonth.value = 0; calYear.value++; }
      else { calMonth.value++; }
    }
    function calShowTooltip(dateStr, event) {
      if (!ACTIVITIES[dateStr]) return;
      if (calHideTimer) { clearTimeout(calHideTimer); calHideTimer = null; }
      calHoveredDate.value = dateStr;
      const cellRect = event.currentTarget.getBoundingClientRect();
      nextTick(() => {
        const tooltip = document.querySelector('.activity-tooltip');
        if (!tooltip) return;
        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 8;
        let x = cellRect.left + cellRect.width / 2 - tw / 2;
        x = Math.max(margin, Math.min(vw - tw - margin, x));
        let y = cellRect.top - th - 8;
        if (y < margin) { y = cellRect.bottom + 8; }
        if (y + th > vh - margin) { y = vh - th - margin; }
        calTooltipX.value = x;
        calTooltipY.value = y;
      });
    }
    function calHideTooltip() {
      calHideTimer = setTimeout(() => { calHoveredDate.value = null; }, 100);
    }
    function calTooltipEnter() {
      if (calHideTimer) { clearTimeout(calHideTimer); calHideTimer = null; }
    }
    function calTooltipLeave() {
      calHoveredDate.value = null;
    }

    function showLegendTooltip(event) {
      legendTooltipVisible.value = true;
      const parentRect = event.currentTarget.getBoundingClientRect();
      nextTick(() => {
        const tooltip = document.querySelector('.legend-restring-tooltip');
        if (!tooltip) return;
        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        const vw = window.innerWidth;
        const margin = 8;
        let x = parentRect.left + parentRect.width / 2 - tw / 2;
        x = Math.max(margin, Math.min(vw - tw - margin, x));
        let y = parentRect.top - th - 10;
        if (y < margin) { y = parentRect.bottom + 10; }
        legendTooltipX.value = x;
        legendTooltipY.value = y;
      });
    }

    const legendTooltipStyle = computed(() => ({
      left: legendTooltipX.value + "px",
      top: legendTooltipY.value + "px"
    }));

    function lastRestringInfo(racketKey) {
      let entry = null;
      for (let i = RESTRING_HISTORY.length - 1; i >= 0; i--) {
        if (RESTRING_HISTORY[i].racket === racketKey) {
          entry = RESTRING_HISTORY[i];
          break;
        }
      }
      if (!entry) return "\u30fc";
      const [y, m, d] = entry.date.split("-");
      let dateStr;
      dateStr = y + "/" + m + "/" + d;
      return dateStr + "\uFF08" + entry.tension + "\uFF09";
    }

    function scrollToSection(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      closeMenu();
    }

    function setFilter(f) {
      pubFilter.value = f;
      showAllPubs.value = false;
    }

    function formatAuthors(authors) {
      return authors.map(a => {
        const isMe = a.includes("Shimizu") || a.includes("清水良太郎");
        return isMe ? `<span class="me">${a}</span>` : a;
      }).join(", ");
    }

    function talkTitle(talk) {
      return lang.value === "ja" && talk.titleJa ? talk.titleJa : talk.title;
    }

    function talkDesc(talk) {
      return lang.value === "ja" && talk.descJa ? talk.descJa : talk.desc;
    }

    function talkType(talk) {
      const types = { invited: t.value["talks.invited"], award: t.value["talks.award"], presentation: t.value["talks.presentation"], conference: t.value["talks.conference"], workshop: t.value["talks.workshop"], domestic: t.value["talks.domestic"] };
      return types[talk.type] || talk.type;
    }

    function mediaTitle(item) {
      return lang.value === "ja" && item.titleJa ? item.titleJa : item.title;
    }

    function talkYear(talk) {
      return lang.value === "ja" && talk.yearJa ? talk.yearJa : talk.year;
    }

    function pubDate(pub) {
      return pub.date || pub.year;
    }

    function pubTypeLabel(type) {
      const labels = { conference: "Conference", journal: "Journal", workshop: "Workshop", preprint: "Preprint", domestic: "Domestic" };
      return labels[type] || type;
    }

    // ── Watchers ──
    watch(theme, (val) => {
      document.documentElement.setAttribute("data-theme", val);
    }, { immediate: true });

    // Re-observe new elements after show-all toggles
    watch([showAllPubs, showAllTalks, showAllAwards, showAllMedia, showAllNews, pubFilter, pubSort], () => {
      nextTick(() => initScrollAnimations());
    });

    function setSort(s) {
      pubSort.value = s;
    }

    // ── Scroll Animations ──
    function initScrollAnimations() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
      document.querySelectorAll(".animate-in").forEach(el => observer.observe(el));
    }

    // ── Active Nav ──
    function initActiveNav() {
      const sections = document.querySelectorAll("section[id]");
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll(".nav-menu a").forEach(a => {
              a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
            });
          }
        });
      }, { rootMargin: "-50% 0px -50% 0px" });
      sections.forEach(s => observer.observe(s));
    }

    // ── Lifecycle ──
    onMounted(() => {
      initScrollAnimations();
      initActiveNav();
      setTimeout(initScrollAnimations, 500);
      window.addEventListener('hashchange', onHashChange);
    });

    return {
      lang, theme, menuOpen, pubFilter, pubSort, showAllPubs, showAllTalks, showAllAwards, showAllMedia, showAllNews,
      publications, greeting, currentView,
      t, pt, langLabel, themeIcon,
      filteredPubs, displayedPubs, talks, displayedTalks, news, displayedNews, awards, displayedAwards, media, displayedMedia,
      toggleLang, toggleTheme, toggleMenu, closeMenu, scrollToTop, scrollToSection, setFilter, setSort,
      formatAuthors, talkTitle, talkDesc, talkType, talkYear, mediaTitle, pubDate, pubTypeLabel,
      calYear, calMonth, calMonthName, calDisplayDate, calDayHeaders, calDays, calCanGoPrev, calCanGoNext,
      calPrevMonth, calNextMonth, calShowTooltip, calHideTooltip,
      calHoveredDate, calTooltipActivities, calTooltipStyle, calTooltipEnter, calTooltipLeave,
      legendTooltipVisible, legendTooltipStyle, showLegendTooltip, lastRestringInfo,
      SPORT_TYPES, RACKETS,
    };
  }
}).mount("#app");
