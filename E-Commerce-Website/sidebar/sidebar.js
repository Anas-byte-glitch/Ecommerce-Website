/*=============== ASIDE BAR ===============*/
const burger  = document.getElementById("burger");
const sideBar = document.getElementById("side-bar");
const overlay = document.getElementById("overlay");

/* فتح وإغلاق السايد بار */
burger.addEventListener("click", (e) => {
  e.stopPropagation();
  sideBar.classList.add("show-side-bar");
  overlay.classList.add("show");
});
overlay.addEventListener("click", () => {
  sideBar.classList.remove("show-side-bar");
  overlay.classList.remove("show");
});
sideBar.addEventListener("click", (e) => e.stopPropagation());

/*====ASIDE BAR CATEGORIES====*/
const subBtn = document.getElementById("sub-btn");
const subMenu = document.getElementById("sub-menu");
subBtn.addEventListener("click", (e) => {
    e.preventDefault();
    subMenu.classList.toggle("show-sub-menu");
    subBtn.classList.toggle("active");
});