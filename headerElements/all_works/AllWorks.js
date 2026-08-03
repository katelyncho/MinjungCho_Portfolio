// ------- slideshow -------
let slideIndex = [0, 0, 0, 0, 0];
const slideId = ["Slides1", "Slides2", "Slides3", "Slides4", "Slides5"];
const visibleSlides = 3;

function setupSlideshow(no) {
  const container = document.querySelectorAll(".slideshowContainer")[no];
  const track = container.querySelector(".slideshowTrack");
  const slides = Array.from(container.getElementsByClassName(slideId[no]));

  if (!track) {
    const newTrack = document.createElement("div");
    newTrack.className = "slideshowTrack";
    slides.forEach((slide) => newTrack.appendChild(slide));
    container.appendChild(newTrack);
  }

  const prevButton = container.querySelector(".prev");
  const nextButton = container.querySelector(".next");

  prevButton?.addEventListener("click", () => plusSlides(-1, no));
  nextButton?.addEventListener("click", () => plusSlides(1, no));

  updateTrack(no);
}

function updateTrack(no) {
  const container = document.querySelectorAll(".slideshowContainer")[no];
  const track = container.querySelector(".slideshowTrack");
  const slides = track.querySelectorAll(`.${slideId[no]}`);

  if (!slides.length) {
    return;
  }

  const firstSlide = slides[0];
  const trackStyle = window.getComputedStyle(track);
  const gap = parseFloat(trackStyle.gap || trackStyle.columnGap || 0);
  const slideWidth = firstSlide.getBoundingClientRect().width + gap;
  const maxIndex = Math.max(0, slides.length - visibleSlides);

  if (slideIndex[no] < 0) {
    slideIndex[no] = maxIndex;
  }

  if (slideIndex[no] > maxIndex) {
    slideIndex[no] = 0;
  }

  track.style.transform = `translateX(${-slideIndex[no] * slideWidth}px)`;
}

function plusSlides(n, no) {
  const container = document.querySelectorAll(".slideshowContainer")[no];
  const slides = container.querySelectorAll(`.${slideId[no]}`);
  const maxIndex = Math.max(0, slides.length - visibleSlides);

  slideIndex[no] += n;

  if (slideIndex[no] < 0) {
    slideIndex[no] = maxIndex;
  }

  if (slideIndex[no] > maxIndex) {
    slideIndex[no] = 0;
  }

  updateTrack(no);
}

function showSlides(n, no) {
  plusSlides(n, no);
}

window.addEventListener("resize", () => {
  updateTrack(0);
  updateTrack(1);
  updateTrack(2);
  updateTrack(3);
  updateTrack(4);
});

setupSlideshow(0);
setupSlideshow(1);
setupSlideshow(2);
setupSlideshow(3);
setupSlideshow(4);

// ------- slideshow -------
