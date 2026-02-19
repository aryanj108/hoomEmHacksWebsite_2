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
    name: "DESIGN TEAM",
    photo: "../assets/team/design_team.jpg",
    leads: "Leads: ###",
    members: "Members: ###",
  },
  {
    name: "TECH TEAM",
    photo: "../assets/team/tech_team.jpg",
    leads: "Leads: ###",
    members: "Members: ###",
  },
  {
    name: "MARKETING TEAM",
    photo: "../assets/team/marketing_team.jpg",
    leads: "Leads: ###",
    members: "Members: ###",
  },
  {
    name: "OPERATIONS TEAM",
    photo: "../assets/team/operations_team.jpg",
    leads: "Leads: ###",
    members: "Members: ###",
  },
  {
    name: "SPONSORSHIP TEAM",
    photo: "../assets/team/sponsorship_team.jpg",
    leads: "Leads: ###",
    members: "Members: ###",
  },
];

// set scrollbar height
document.addEventListener('DOMContentLoaded', () => {
  var ht = document.body.offsetHeight;
  document.querySelector(".custom-scrollbar").style.height = ht + "px";
})
window.addEventListener('resize', () => {
  var ht = document.body.offsetHeight;
  document.querySelector(".custom-scrollbar").style.height = ht + "px";
});

let currentTeamIndex = 0;

// Ocean Bubbles
function createOceanBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  const size = Math.random() * 60 + 20;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.left = Math.random() * 100 + "%";
  bubble.style.bottom = "-100px";
  bubble.style.animationDuration = Math.random() * 10 + 10 + "s";
  bubble.style.animationDelay = Math.random() * 5 + "s";
  bubble.style.position = "fixed";
  document.getElementById("oceanBubbles").appendChild(bubble);

  setTimeout(() => bubble.remove(), 20000);
}

// Initialize bubbles
setInterval(createOceanBubble, 1000);
for (let i = 0; i < 10; i++) createOceanBubble();

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
  const pageScrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const thumbTravelHeight =
    window.innerHeight - thumb.offsetHeight - VISUAL_END_BUFFER;
  const scrollRatio = pageScrollHeight / thumbTravelHeight;

  window.scrollTo({
    top: scrollStartY + deltaY * scrollRatio,
    behavior: "auto",
  });
});

document.addEventListener("mouseup", () => {
  isDraggingThumb = false;
  document.body.style.userSelect = "";
});

// Scroll Event - Update scrollbar thumb position
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollTop / maxScroll;
  const viewportHeight = document.documentElement.offsetHeight;
  const thumbHeight = thumb.offsetHeight;
  const maxY = viewportHeight - thumbHeight - VISUAL_END_BUFFER;
  const y = progress * maxY;
  thumb.style.top = `${y}px`;
});

// Parallax Effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const deepOcean = document.querySelector(".layer-deep-ocean");
  const midOcean = document.querySelector(".layer-mid-ocean");
  const shallowOcean = document.querySelector(".layer-shallow-ocean");
  const oceanBubblesEl = document.querySelector(".ocean-bubbles");

  if (deepOcean) deepOcean.style.transform = `translateY(${scrolled * 0.2}px)`;
  if (midOcean) midOcean.style.transform = `translateY(${scrolled * 0.4}px)`;
  if (shallowOcean)
    shallowOcean.style.transform = `translateY(${scrolled * 0.6}px)`;
  if (oceanBubblesEl)
    oceanBubblesEl.style.transform = `translateY(${scrolled * 0.7}px)`;
});

// Navbar Show/Hide on Scroll
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
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
});

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
}

function updateTeamDisplay() {
  const team = teams[currentTeamIndex];
  document.getElementById("teamPhoto").src = team.photo;
  document.getElementById("teamPhoto").alt = team.name;
  document.getElementById("teamName").textContent = team.name;
  document.getElementById("teamLeads").textContent = team.leads;
  document.getElementById("teamMembers").textContent = team.members;
  updateIndicators();
  buildTeamTabs();
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
buildTeamTabs();
updateIndicators();
updateTeamDisplay();

// Register Button Navigation
document.getElementById("registButton").addEventListener("click", () => {
  window.open("https://google.com/", "_blank");
});