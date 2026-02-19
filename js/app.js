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

    // ── Computed ──
    const t = computed(() => TRANSLATIONS[lang.value] || TRANSLATIONS.en);
    const langLabel = computed(() => lang.value === "en" ? "JP" : "EN");
    const themeIcon = computed(() => theme.value === "dark" ? "fas fa-sun" : "fas fa-moon");

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const types = { invited: t.value["talks.invited"], conference: t.value["talks.conference"], workshop: t.value["talks.workshop"], domestic: t.value["talks.domestic"] };
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
      // Re-observe after Vue renders
      setTimeout(initScrollAnimations, 500);
    });

    return {
      lang, theme, menuOpen, pubFilter, pubSort, showAllPubs, showAllTalks, showAllAwards, showAllMedia, showAllNews,
      publications, greeting,
      t, langLabel, themeIcon,
      filteredPubs, displayedPubs, talks, displayedTalks, news, displayedNews, awards, displayedAwards, media, displayedMedia,
      toggleLang, toggleTheme, toggleMenu, closeMenu, scrollToTop, setFilter, setSort,
      formatAuthors, talkTitle, talkDesc, talkType, talkYear, mediaTitle, pubDate, pubTypeLabel,
    };
  }
}).mount("#app");
