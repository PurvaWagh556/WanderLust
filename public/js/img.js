const img = document.querySelector(".listing-img");
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("fullImg");
const closeBtn = document.querySelector(".close");

// Open modal
img.addEventListener("click", () => {
  modal.style.display = "block";
  modalImg.src = img.src;
  document.body.style.overflow = "hidden"; // stop background scroll
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

// Close when clicking outside image
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
});