(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

const scrollContainer = document.getElementById('category-scroll');

if (scrollContainer) {
  const leftBtn = document.querySelector('.nav-btn.left');
  const rightBtn = document.querySelector('.nav-btn.right');

  function manageIcons() {
    let scrollValue = Math.ceil(scrollContainer.scrollLeft);
    let maxScrollableWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    leftBtn.style.display = scrollValue > 0 ? "block" : "none";
    rightBtn.style.display = maxScrollableWidth > scrollValue ? "block" : "none";
  }

  // Scroll event
  scrollContainer.addEventListener("scroll", manageIcons);

  // Page load
  window.addEventListener("load", manageIcons);

  function scrollGrid(distance) {
    scrollContainer.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }

  // Restore scroll position
  window.addEventListener("load", () => {
    const savedScroll = localStorage.getItem("scrollPos");

    if (savedScroll) {
      scrollContainer.scrollLeft = savedScroll;
    }

    manageIcons();
  });

  // Save scroll position on filter click
  const filters = document.querySelectorAll(".filter");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      localStorage.setItem("scrollPos", scrollContainer.scrollLeft);
    });
  });
}