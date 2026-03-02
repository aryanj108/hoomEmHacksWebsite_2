// Reset scroll position on page load
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// Cache DOM elements
const navbar = document.getElementById("navbar");
const oceanBackground = document.getElementById("oceanBackground");
const thumb = document.getElementById("scrollThumb");
const track = document.querySelector(".custom-scrollbar-track");

// Constants
const TOP_PADDING = 30;
const BOTTOM_PADDING = 30;
const VISUAL_END_BUFFER = 30;

// State variables
let lastScrollTop = 0;
let scrollThreshold = window.innerHeight;
let isScrollingFromClick = false;
let isDraggingThumb = false;
let dragStartY = 0;
let scrollStartY = 0;

// Team data
const teams = [
  {
    name: "HOOK EM' HACKS 2026 TEAM",
    photo: "./assets/team/design_team.jpg",
    leads: "Director: Maanya Chugh",
    members: "Anika Srinivasan, Aristoteles Cortes-Loera, Aryan Jalota, Damodar Kamani, Harini Champooranan, Hrishi Kamireddy, Kyra Browning, Lillian Cutrer, Nasser Shaik, Nima Ansari, Noah Fishman, Priscilla Ye, Shrestha Mishra, Sofia Porras, Sophie Liu, Swyam Dubey, Keerti Koya",
  },
  {
    name: "TECH TEAM",
    photo: "./assets/team/tech_team.jpg",
    leads: "Aryan Jalota, Nasser Shaik",
    members: "Hrishi Kamireddy, Shrestha Mishra",
  },
  {
    name: "DESIGN TEAM",
    photo: "./assets/team/design_team.jpg",
    leads: "Nicole Garcia",
    members: "Rujula Padala",
  },
  {
    name: "MARKETING TEAM",
    photo: "./assets/team/marketing_team.jpg",
    leads: "Sofia Porras, Sophie Liu",
    members: "Kyra Browning",
  },
  {
    name: "EXPERIENCE TEAM",
    photo: "./assets/team/operations_team.jpg",
    leads: "Priscilla Ye",
    members: "Damodar Kamani, Swyam Dubey, Keerti Koya",
  },
  {
    name: "SPONSORSHIP TEAM",
    photo: "./assets/team/sponsorship_team.jpg",
    leads: "Aristoteles Cortes-Loera",
    members: "Harini Champooranan",
  },
  {
    name: "LOGISTICS TEAM",
    photo: "./assets/team/operations_team.jpg",
    leads: "Aryan Jalota",
    members: "Lillian Cutrer",
  },
  {
    name: "OUTREACH TEAM",
    photo: "./assets/team/marketing_team.jpg",
    leads: "Noah Fishman, Nima Ansari",
    members: "",
  },
  {
    name: "FINANCE TEAM",
    photo: "./assets/team/sponsorship_team.jpg",
    leads: "Anika Srinivasan",
    members: "",
  },
];

// set scrollbar height
/*
document.addEventListener('DOMContentLoaded', () => {
  var ht = document.body.offsetHeight;
  document.querySelector(".custom-scrollbar").style.height = ht + "px";
})
window.addEventListener('resize', () => {
  var ht = document.body.offsetHeight;
  document.querySelector(".custom-scrollbar").style.height = ht + "px";
});
*/

let currentTeamIndex = 0;

// Ocean Bubbles
const oceanBubblesContainer = document.getElementById("oceanBubbles");
const MAX_BUBBLES = 12;

function createOceanBubble() {
  if (oceanBubblesContainer.childElementCount >= MAX_BUBBLES) return;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const size = Math.random() * 60 + 20;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.left = Math.random() * 100 + "vw";
  bubble.style.bottom = "-100px";
  bubble.style.animationDuration = Math.random() * 10 + 10 + "s";
  bubble.style.animationDelay = Math.random() * 5 + "s";
  bubble.style.position = "fixed";
  bubble.style.cursor = "pointer";

  bubble.addEventListener("click", () => {
    bubble.classList.add("popping");
    setTimeout(() => bubble.remove(), 300);
  });

  oceanBubblesContainer.appendChild(bubble);
  setTimeout(() => bubble.remove(), 20000);
}

setInterval(createOceanBubble, 2000);
for (let i = 0; i < 6; i++) createOceanBubble();

// Custom Scrollbar - Mouse Events
thumb.addEventListener("mousedown", (e) => {
  isDraggingThumb = true;
  dragStartY = e.clientY;
  scrollStartY = window.scrollY;
  document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (e) => {
  if (!isDraggingThumb) return;
  const deltaY = e.clientY - dragStartY;
  const pageScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const thumbMaxY = window.innerHeight - thumb.offsetHeight;
  const scrollRatio = pageScrollHeight / thumbMaxY;
  window.scrollTo({
    top: scrollStartY + deltaY * scrollRatio,
    behavior: "auto",
  });
});

document.addEventListener("mouseup", () => {
  isDraggingThumb = false;
  document.body.style.userSelect = "";
});

// Cache parallax elements once (avoid querying on every scroll)
const deepOcean = document.querySelector(".layer-deep-ocean");
const midOcean = document.querySelector(".layer-mid-ocean");
const shallowOcean = document.querySelector(".layer-shallow-ocean");

let scrollTicking = false;

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight;
  const winHeight = window.innerHeight;
  const maxScroll = docHeight - winHeight;

  // Scrollbar thumb position
  const progress = scrollTop / maxScroll;
  const thumbHeight = thumb.offsetHeight;
  const offset = 40;
  const maxY = winHeight - thumbHeight - offset;
  thumb.style.top = `${progress * maxY + offset}px`;

  // Scrollbar track retraction near bottom
  const distanceFromBottom = docHeight - (scrollTop + winHeight);
  track.style.height = distanceFromBottom <= 200
    ? `${94 + distanceFromBottom / 20}%`
    : "100%";

  // Parallax (only if elements exist)
  if (deepOcean) deepOcean.style.transform = `translateY(${scrollTop * 0.2}px)`;
  if (midOcean) midOcean.style.transform = `translateY(${scrollTop * 0.4}px)`;
  if (shallowOcean) shallowOcean.style.transform = `translateY(${scrollTop * 0.6}px)`;

  // Navbar show/hide
  if (!isScrollingFromClick) {
    if (scrollTop > lastScrollTop) {
      navbar.classList.add("hidden");
      navbar.classList.remove("visible");
    } else if (scrollTop < lastScrollTop) {
      navbar.classList.add("visible");
      navbar.classList.remove("hidden");
    }
  }
  lastScrollTop = scrollTop;

  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(onScroll);
    scrollTicking = true;
  }
}, { passive: true });

// Smooth Scroll for Navigation Links
document.querySelectorAll(".navbar-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href.startsWith("#")) return; 
    e.preventDefault();
    const targetSection = document.querySelector(href);
    isScrollingFromClick = true;
    navbar.classList.remove("hidden");
    navbar.classList.add("visible");
    targetSection.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      isScrollingFromClick = false;
    }, 1000);
  });
});

// FAQ Accordion
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
    });
    if (!isActive) {
      faqItem.classList.add("active");
    }
  });
});

// Team Carousel Functions
/*
function buildTeamTabs() {
  const tabsContainer = document.getElementById("teamTabs");
  tabsContainer.innerHTML = "";
  teams.forEach((team, index) => {
    const tab = document.createElement("button");
    tab.className = "team-tab" + (index === currentTeamIndex ? " active" : "");
    tab.textContent = team.name;
    tab.onclick = () => goToTeam(index);
    tabsContainer.appendChild(tab);
  });
}*/

function updateTeamDisplay() {
  const team = teams[currentTeamIndex];
  document.getElementById("teamPhoto").src = team.photo;
  document.getElementById("teamPhoto").alt = team.name;
  document.getElementById("teamName").textContent = team.name;
  document.getElementById("teamLeads").textContent = team.leads.startsWith("Director:")
  ? team.leads.replace("Director: ", "")
  : team.leads;

  const leadsLabel = document.querySelector("#teamCard .team-detail:first-of-type .team-label");
  if (leadsLabel) {
    if (team.leads.startsWith("Director:")) {
      leadsLabel.textContent = "Director";
    } else {
      const leadCount = team.leads.split(",").length;
      leadsLabel.textContent = leadCount === 1 ? "Lead" : "Leads";
    }
  }

  const membersEl = document.getElementById("teamMembers");
  const membersDetail = membersEl.closest(".team-detail");
  if (team.members) {
    membersEl.textContent = team.members;
    membersDetail.style.display = "";
  } else {
    membersDetail.style.display = "none";
  }
  updateIndicators();
}

function changeTeam(direction) {
  const card = document.getElementById("teamCard");
  card.classList.add("fade-out");
  setTimeout(() => {
    currentTeamIndex += direction;
    if (currentTeamIndex < 0) {
      currentTeamIndex = teams.length - 1;
    } else if (currentTeamIndex >= teams.length) {
      currentTeamIndex = 0;
    }
    updateTeamDisplay();
    card.classList.remove("fade-out");
    card.classList.add("fade-in");
    setTimeout(() => card.classList.remove("fade-in"), 400);
  }, 300);
}

function goToTeam(index) {
  if (index === currentTeamIndex) return;
  const card = document.getElementById("teamCard");
  card.classList.add("fade-out");
  setTimeout(() => {
    currentTeamIndex = index;
    updateTeamDisplay();
    card.classList.remove("fade-out");
    card.classList.add("fade-in");
    setTimeout(() => card.classList.remove("fade-in"), 400);
  }, 300);
}

function updateIndicators() {
  const indicatorsContainer = document.getElementById("teamIndicators");
  indicatorsContainer.innerHTML = "";
  teams.forEach((team, index) => {
    const dot = document.createElement("div");
    dot.className =
      "indicator-dot" + (index === currentTeamIndex ? " active" : "");
    dot.onclick = () => goToTeam(index);
    indicatorsContainer.appendChild(dot);
  });
}

// Logo Click - Scroll to Top
document.getElementById("logoLink").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initialize Team Display
//buildTeamTabs();
updateIndicators();
updateTeamDisplay();

// Register Button Navigation
document.getElementById("registButton").addEventListener("click", (e) => {
  e.stopPropagation();
  window.open("https://forms.gle/RaPX1hgw51VMnHM28", "_blank");
});

// Hamburger Menu
const hamburger = document.getElementById("hamburger");
const navbarLinks = document.getElementById("navbarLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navbarLinks.classList.toggle("open");
});

navbarLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navbarLinks.classList.remove("open");
  });
});

// Countdown Timer
function updateCountdown() {
  const target = new Date("April 18, 2026 09:00:00").getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById("cd-days").textContent = "0";
    document.getElementById("cd-hours").textContent = "0";
    document.getElementById("cd-mins").textContent = "0";
    document.getElementById("cd-secs").textContent = "0";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("cd-days").textContent = days;
  document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Section Reveal on Scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".section, .team-section").forEach((section) => {
  revealObserver.observe(section);
});

// ── Schedule Filter Pills ──
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    document.querySelectorAll('.sched-event').forEach(ev => {
      if (filter === 'all' || ev.dataset.category === filter) {
        ev.classList.remove('dimmed');
      } else {
        ev.classList.add('dimmed');
      }
    });
  });
});
