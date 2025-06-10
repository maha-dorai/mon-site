// Toggle the main menu
document.getElementById("menu-toggle").addEventListener("click", function () {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("show");
});

// Toggle the skills submenu
document.getElementById("skills-toggle").addEventListener("click", function () {
  const skillsSubMenu = document.querySelector(".skills-sub-menu");
  skillsSubMenu.classList.toggle("show");
});

// Toggle the projects submenu
document.getElementById("projects-toggle").addEventListener("click", function () {
  const projectsSubMenu = document.querySelector(".projects-sub-menu");
  projectsSubMenu.classList.toggle("show");
});

// Navigation tab switching
const navItems = document.querySelectorAll(".nav-links a");
const contentSections = document.querySelectorAll(".content > div");

navItems.forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // Hide all content sections
    contentSections.forEach(section => section.style.display = "none");

    // Remove active class from all nav items
    navItems.forEach(nav => nav.classList.remove("active"));

    // Show the selected section
    const targetId = this.getAttribute("href").substring(1);
    document.getElementById(targetId).style.display = "block";

    // Set active class on the selected item
    this.classList.add("active");

    // Close menu on small screens
    document.querySelector(".nav-links").classList.remove("show");
  });
});

// Initially show home content only
document.addEventListener("DOMContentLoaded", function () {
  contentSections.forEach(section => section.style.display = "none");
  document.getElementById("home").style.display = "block";
});
