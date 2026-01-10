const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const frameCount = 191;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

let resizeTimeout;
window.addEventListener("resize", () => {
  resizeCanvas();

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});

const currentFrame = (index) =>
  `./Animation-Photos/${(index + 1).toString()}.jpg`;

const images = [];
let ball = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

gsap.to(ball, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: true,
    pin: "canvas",
    end: "500%",
  },
  onUpdate: render,
});

gsap.fromTo(
  ".hi-text",
  { opacity: 1 },
  {
    opacity: 0,
    scrollTrigger: {
      scrub: true,
      start: "0%",
      end: "30%",
    },
  }
);

images[0].onload = render;

function render() {
  const img = images[ball.frame];
  if (!img || !img.complete) return;

  const cw = canvas.width;
  const ch = canvas.height;

  const imgAspect = img.width / img.height;
  const canvasAspect = cw / ch;

  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;

  if (imgAspect > canvasAspect) {
    sw = img.height * canvasAspect;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / canvasAspect;
    sy = (img.height - sh) / 2;
  }

  context.clearRect(0, 0, cw, ch);
  context.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

const light = document.querySelector(".mouse-light");

window.addEventListener("mousemove", (e) => {
  light.style.setProperty("--x", `${e.clientX}px`);
  light.style.setProperty("--y", `${e.clientY}px`);
});

const navItems = document.querySelectorAll(".nav-bar p");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetId = item.dataset.target;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const y = targetEl.getBoundingClientRect().top + window.pageYOffset - 40;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  });
});

const sections = ["about", "experience", "projects"];

sections.forEach((id) => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActive(id),
    onEnterBack: () => setActive(id),
  });
});

function setActive(id) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.target === id);
  });
}

VanillaTilt.init(document.querySelectorAll(".project-card"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.3,
  scale: 1.05,
  perspective: 1000,
  transition: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
});


let tiltEnabled = false;

function shouldEnableTilt() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(max-width: 900px)").matches
  );
}

function enableTilt() {
  if (tiltEnabled) return;
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  VanillaTilt.init(cards, {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.3,
    scale: 1.05,
    perspective: 1000,
    transition: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  });

  tiltEnabled = true;
}

function disableTilt() {
  if (!tiltEnabled) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    if (card.vanillaTilt) card.vanillaTilt.destroy();
  });

  tiltEnabled = false;
}

function updateTilt() {
  shouldEnableTilt() ? enableTilt() : disableTilt();
}

updateTilt();
window.addEventListener("resize", updateTilt, { passive: true });
window.addEventListener("orientationchange", updateTilt);
