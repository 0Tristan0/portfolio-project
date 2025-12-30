const canvas = document.querySelector(".canvas");
const context = canvas.getContext("2d");
const frameCount = 191;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

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
    opacity: 1,
    scrollTrigger: {
      scrub: true,
      start: "0%",
      end: "10%",
    },
    onComplete: () => {
      gsap.to(".hi-text", { opacity: 0 });
    },
  }
);

gsap.to(".navbar", {
  backgroundColor: "#333",
  duration: 1,
  scrollTrigger: {
    trigger: ".navbar",
    start: "200%",
    end: "50%",
    scrub: true,
  },
});

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

navItems.forEach(item => {
  item.addEventListener("click", () => {
    const targetId = item.dataset.target;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const y =
      targetEl.getBoundingClientRect().top +
      window.pageYOffset -
      40;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  });
});

const sections = ["about", "experience", "projects"];

sections.forEach(id => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActive(id),
    onEnterBack: () => setActive(id)
  });
});

function setActive(id) {
  navItems.forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.target === id
    );
  });
}

// ============================================
// VANILLA TILT INITIALIZATION
// ============================================

VanillaTilt.init(document.querySelectorAll(".project-card"), {
  max: 15,              // Maximum tilt rotation (degrees)
  speed: 400,           // Speed of the tilt animation
  glare: true,          // Enable glare effect
  "max-glare": 0.3,     // Maximum glare opacity
  scale: 1.05,          // Scale up slightly on hover
  perspective: 1000,    // Perspective for 3D effect
  transition: true,     // Smooth transition
  easing: "cubic-bezier(.03,.98,.52,.99)"
});

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.querySelector('.cursor');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When element enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('typewriter-animation');
                observer.unobserve(entry.target); // Stop observing after animation starts
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of element is visible
    });
    
    // Start observing
    observer.observe(typewriterElement);
});
