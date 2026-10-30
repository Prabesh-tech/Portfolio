document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initNavigation();
  initScrollEffects();
  initScrollAnimations();
  initTyping();
  initContactForm();
  initEmailCopy();
  initCvActions();
  initDraggableBadge();
  initAnimatedBackground();

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Intl.DateTimeFormat("en", { year: "numeric" }).format(new Date());
});

function initCvActions() {
  const toggle = document.getElementById("cvToggle");
  const actions = document.getElementById("cvActions");
  if (!toggle || !actions) return;

  const closeActions = () => {
    toggle.setAttribute("aria-expanded", "false");
    actions.hidden = true;
  };

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    actions.hidden = isExpanded;
  });

  document.addEventListener("click", (event) => {
    if (!toggle.parentElement?.contains(event.target)) closeActions();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeActions();
      toggle.focus();
    }
  });
}

function initPreloader() {
  const preloader = document.getElementById("loadingScreen");
  if (!preloader) return;
  const counter = document.getElementById("loadingPercent");
  const progress = document.getElementById("loadingProgress");
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 700 : 1400;

  if (counter || progress) {
    const startedAt = performance.now();
    const updateCounter = (now) => {
      const percent = Math.min(100, Math.round(((now - startedAt) / duration) * 100));
      if (counter) counter.textContent = `${String(percent).padStart(2, "0")}%`;
      if (progress) progress.style.width = `${percent}%`;
      if (percent < 100) requestAnimationFrame(updateCounter);
    };
    requestAnimationFrame(updateCounter);
  }

  window.setTimeout(() => {
    preloader.classList.add("hidden");
  }, duration);
}

function initNavigation() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (!navbar || !menuToggle || !navLinks) return;

  const links = [...navLinks.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
  const menuItems = [...navLinks.querySelectorAll("a, button")];
  const closeMenu = (returnFocus = false) => {
    navLinks.classList.remove("active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
    if (returnFocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
      return;
    }

    navLinks.classList.add("active");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    }
    menuItems[0]?.focus();
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
      const target = document.querySelector(link.getAttribute("href"));
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
      return;
    }

    if (event.key !== "Tab" || menuToggle.getAttribute("aria-expanded") !== "true") return;
    const first = menuItems[0];
    const last = menuItems[menuItems.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter((section) => section instanceof HTMLElement);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  navbar.classList.remove("hidden");
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle("scrolled", currentScroll > 40);
    navbar.classList.remove("hidden");
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

function initScrollEffects() {
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const progressRing = backToTop?.querySelector(".back-to-top__ring circle");

  const updateScroll = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
    if (progressRing) progressRing.style.strokeDashoffset = String(138.23 * (1 - amount));
    if (backToTop) backToTop.classList.add("visible");
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
}

function initScrollAnimations() {
  const candidates = document.querySelectorAll(
    "#about .section-title, #about .section-subtitle, #about .content-box, .section-kicker, .section-title, .section-subtitle, .skill-group, .timeline-item, .project-card, .service-card, .contact-container"
  );
  candidates.forEach((element) => element.classList.add("animate-on-scroll"));

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    candidates.forEach((element) => element.classList.add("animated"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("animated");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

  candidates.forEach((element) => observer.observe(element));
}

function initTyping() {
  const target = document.getElementById("roleText");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const roles = ["Frontend Developer", "UI/UX Designer", "Computer Science Student"];
  let roleIndex = 0;
  let characterIndex = roles[0].length;
  let deleting = true;

  const tick = () => {
    const role = roles[roleIndex];
    characterIndex += deleting ? -1 : 1;
    target.textContent = role.slice(0, characterIndex);

    let delay = deleting ? 55 : 95;
    if (characterIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    } else if (characterIndex >= roles[roleIndex].length) {
      deleting = true;
      delay = 1700;
    }
    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, 1800);
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitButton = form?.querySelector('button[type="submit"]');
  if (!(form instanceof HTMLFormElement) || !status || !submitButton) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot?.value.trim()) return;

    if (form.action.includes("YOUR_FORMSPREE_ID")) {
      showFormStatus(status, "Add your Formspree form ID before enabling message delivery.", "error");
      return;
    }

    const originalContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
    showFormStatus(status, "Sending your message…", "");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        showFormStatus(status, "Your message could not be sent. Please email me directly instead.", "error");
        return;
      }

      form.reset();
      showFormStatus(status, "Thanks for your message. I'll get back to you soon.", "success");
    } catch (error) {
      console.error("Contact form submission failed.", error);
      showFormStatus(status, "A network error prevented delivery. Please email me directly instead.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalContent;
    }
  });
}

function showFormStatus(status, message, type) {
  status.textContent = message;
  status.className = type;
}

function initEmailCopy() {
  const button = document.getElementById("copyEmail");
  const emailLink = document.getElementById("emailText");
  if (!button || !emailLink) return;

  button.addEventListener("click", async () => {
    const email = emailLink.textContent.trim();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = email;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.append(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand("copy");
        temporaryInput.remove();
        if (!copied) throw new Error("Clipboard access is unavailable.");
      }
      button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied';
      showToast("Copied!", "success");
      window.setTimeout(() => {
        button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i> Copy email';
      }, 1800);
    } catch (error) {
      console.error("Could not copy the email address.", error);
      button.textContent = "Copy failed — use the email link";
      showToast("Copy failed. Use the email link instead.", "error");
    }
  });
}

function showToast(message, type) {
  const container = document.getElementById("notificationContainer");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  const icon = document.createElement("i");
  icon.className = type === "success" ? "fas fa-circle-check" : "fas fa-circle-exclamation";
  icon.setAttribute("aria-hidden", "true");
  const text = document.createElement("span");
  text.textContent = message;
  notification.append(icon, text);
  container.append(notification);
  window.setTimeout(() => notification.remove(), 5000);
}

function initDraggableBadge() {
  const stage = document.querySelector(".lanyard-stage");
  const badge = stage?.querySelector(".profile-badge");
  const rope = stage?.querySelector(".lanyard-rope");
  const strands = rope ? [...rope.querySelectorAll("path")] : [];
  if (!stage || !badge || strands.length !== 3) return;

  const navbar = document.querySelector(".navbar");
  const footer = document.querySelector(".footer");
  const socialLinks = stage.closest(".home-content")?.querySelector(".home-text .social-icons");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let baseX = stage.clientWidth / 2;
  let anchorX = baseX;
  let baseY = badge.offsetTop;
  let anchorY = 0;
  let x = 0;
  let y = 0;
  let velocityX = 0;
  let velocityY = 0;
  let angle = -4;
  let targetX = 0;
  let targetY = 0;
  let pointerId = null;
  let returning = false;
  let pointerClientX = 0;
  let pointerClientY = 0;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;
  let animationFrame = 0;
  let lastFrameTime = 0;

  const draw = () => {
    const startX = anchorX;
    const startY = anchorY;
    const endX = baseX + x;
    const endY = baseY + y - 18;
    const left = Math.min(startX, endX) - 12;
    const top = Math.min(startY, endY) - 12;
    const ropeWidth = Math.max(1, Math.max(startX, endX) - left + 12);
    const ropeHeight = Math.max(1, Math.max(startY, endY) - top + 12);
    const ropeStartX = startX - left;
    const ropeStartY = startY - top;
    const ropeEndX = endX - left;
    const ropeEndY = endY - top;
    const deltaX = ropeEndX - ropeStartX;
    const controlOneX = ropeStartX + deltaX * 0.42;
    const controlTwoX = ropeEndX - deltaX * 0.2;
    const path = `M ${ropeStartX} ${ropeStartY} C ${controlOneX} ${ropeStartY + (ropeEndY - ropeStartY) * 0.42}, ${controlTwoX} ${ropeStartY + (ropeEndY - ropeStartY) * 0.78}, ${ropeEndX} ${ropeEndY}`;

    rope.style.left = `${left}px`;
    rope.style.top = `${top}px`;
    rope.style.right = "auto";
    rope.style.bottom = "auto";
    rope.style.width = `${ropeWidth}px`;
    rope.style.height = `${ropeHeight}px`;
    rope.setAttribute("viewBox", `0 0 ${ropeWidth} ${ropeHeight}`);
    for (const strand of strands) strand.setAttribute("d", path);
    badge.style.transform = `translate3d(calc(-50% + ${x}px), ${y}px, 0) rotate(${angle}deg)`;
    document.body.classList.toggle("badge-displaced", pointerId !== null || returning || Math.abs(x) > 14 || Math.abs(y) > 14);
  };

  const movementBounds = () => {
    const stageRect = stage.getBoundingClientRect();
    const centerOnPage = stageRect.left + baseX;
    const stageDocumentTop = stageRect.top + window.scrollY;
    const halfBadge = badge.offsetWidth / 2;
    const pageBottom = footer
      ? footer.getBoundingClientRect().bottom + window.scrollY
      : document.documentElement.scrollHeight;
    return {
      minX: halfBadge + 12 - centerOnPage,
      maxX: window.innerWidth - halfBadge - 12 - centerOnPage,
      minY: 12 - (stageDocumentTop + baseY),
      maxY: pageBottom - 12 - (stageDocumentTop + baseY + badge.offsetHeight)
    };
  };
  let currentBounds = movementBounds();

  const requestAnimation = () => {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
  };

  const updateDragTarget = () => {
    const stageRect = stage.getBoundingClientRect();
    const bounds = currentBounds;
    targetX = Math.max(bounds.minX, Math.min(bounds.maxX, pointerClientX - stageRect.left - baseX - pointerOffsetX));
    targetY = Math.max(bounds.minY, Math.min(bounds.maxY, pointerClientY - stageRect.top - baseY - pointerOffsetY));
  };

  function animate(timestamp) {
    animationFrame = 0;
    const deltaTime = lastFrameTime ? Math.min((timestamp - lastFrameTime) / 1000, 0.032) : 0;
    lastFrameTime = timestamp;
    const floating = pointerId === null && !returning && !reducedMotion;

    if (floating) {
      const time = timestamp / 1000;
      targetX = Math.max(currentBounds.minX, Math.min(currentBounds.maxX, Math.sin(time * 0.55) * 8 + Math.sin(time * 0.9 + 1.4) * 3));
      targetY = Math.max(currentBounds.minY, Math.min(currentBounds.maxY, Math.sin(time * 0.7 + 0.8) * 8 + Math.sin(time * 0.48) * 3));
    }

    if (pointerId !== null) {
      const edgeSize = 80;
      if (pointerClientY < edgeSize) {
        window.scrollBy(0, -Math.min(16, Math.ceil((edgeSize - pointerClientY) * 0.2)));
      } else if (pointerClientY > window.innerHeight - edgeSize) {
        window.scrollBy(0, Math.min(16, Math.ceil((pointerClientY - window.innerHeight + edgeSize) * 0.2)));
      }
      updateDragTarget();
    }

    if (reducedMotion) {
      x = targetX;
      y = targetY;
      velocityX = 0;
      velocityY = 0;
    } else if (deltaTime > 0) {
      const stiffness = pointerId === null ? 64 : 320;
      const damping = pointerId === null ? 14 : 38;
      velocityX += (stiffness * (targetX - x) - damping * velocityX) * deltaTime;
      velocityY += (stiffness * (targetY - y) - damping * velocityY) * deltaTime;
      x += velocityX * deltaTime;
      y += velocityY * deltaTime;

      const bounds = currentBounds;
      if (x < bounds.minX || x > bounds.maxX) {
        x = Math.max(bounds.minX, Math.min(bounds.maxX, x));
        velocityX *= -0.4;
      }
      if (y < bounds.minY || y > bounds.maxY) {
        y = Math.max(bounds.minY, Math.min(bounds.maxY, y));
        velocityY *= -0.4;
      }

      const targetAngle = Math.max(-42, Math.min(42, -4 + x * 0.075 + velocityX * 0.16 + velocityY * 0.04));
      angle += (targetAngle - angle) * Math.min(1, deltaTime * 12);
    }

    draw();

    if (floating || pointerId !== null || Math.abs(x - targetX) > 0.1 || Math.abs(y - targetY) > 0.1 ||
        Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1 || Math.abs(angle + 4) > 0.05) {
      requestAnimation();
    } else {
      x = targetX;
      y = targetY;
      angle = -4;
      returning = false;
      lastFrameTime = 0;
      badge.style.willChange = "";
      draw();
      if (!reducedMotion) requestAnimation();
    }
  }

  const updatePositionLimits = () => {
    baseX = stage.clientWidth / 2;
    anchorX = baseX;
    baseY = badge.offsetTop;
    currentBounds = movementBounds();
    const stageRect = stage.getBoundingClientRect();
    let anchorScreenY;
    if (window.innerWidth <= 560 && socialLinks) {
      const icons = [...socialLinks.querySelectorAll(".social-icon")];
      const iconRects = icons.map((icon) => icon.getBoundingClientRect());
      if (iconRects.length) {
        const left = Math.min(...iconRects.map((rect) => rect.left));
        const right = Math.max(...iconRects.map((rect) => rect.right));
        anchorX = (left + right) / 2 - stageRect.left;
      }
      anchorScreenY = socialLinks.getBoundingClientRect().bottom;
      anchorY = anchorScreenY - stageRect.top;
    } else {
      anchorScreenY = navbar?.getBoundingClientRect().bottom ?? 0;
      anchorY = anchorScreenY - stageRect.top;
    }
    const stageIsVisible = stageRect.bottom > 0 && stageRect.top < window.innerHeight;
    rope.style.visibility = pointerId !== null || returning || Math.abs(x) > 14 || Math.abs(y) > 14 ||
      window.innerWidth > 560 || stageIsVisible ? "visible" : "hidden";
    if (pointerId === null) {
      const bounds = currentBounds;
      x = Math.max(bounds.minX, Math.min(bounds.maxX, x));
      y = Math.max(bounds.minY, Math.min(bounds.maxY, y));
      targetX = returning ? Math.max(bounds.minX, Math.min(bounds.maxX, 0)) : x;
      targetY = returning ? Math.max(bounds.minY, Math.min(bounds.maxY, 0)) : y;
    }
    draw();
  };

  badge.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || pointerId !== null) return;
    event.preventDefault();
    pointerId = event.pointerId;
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    const stageRect = stage.getBoundingClientRect();
    pointerOffsetX = event.clientX - (stageRect.left + baseX + x);
    pointerOffsetY = event.clientY - (stageRect.top + baseY + y);
    badge.setPointerCapture(pointerId);
    badge.classList.add("is-dragging");
    document.body.classList.add("badge-dragging");
    badge.style.willChange = "transform";
    requestAnimation();
  });

  badge.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    pointerClientX = event.clientX;
    pointerClientY = event.clientY;
    updateDragTarget();
    requestAnimation();
  });

  const releaseBadge = (event) => {
    if (pointerId === null || (event?.pointerId !== undefined && event.pointerId !== pointerId)) return;
    const releasedPointerId = pointerId;
    pointerId = null;
    returning = true;
    targetX = 0;
    targetY = 0;
    velocityX = 0;
    velocityY = 0;
    badge.classList.remove("is-dragging");
    document.body.classList.remove("badge-dragging");
    if (badge.hasPointerCapture(releasedPointerId)) badge.releasePointerCapture(releasedPointerId);
    requestAnimation();
  };

  badge.addEventListener("pointerup", releaseBadge);
  badge.addEventListener("pointercancel", releaseBadge);
  badge.addEventListener("lostpointercapture", releaseBadge);
  window.addEventListener("pointerup", releaseBadge);
  window.addEventListener("pointercancel", releaseBadge);
  window.addEventListener("blur", releaseBadge);
  window.addEventListener("resize", updatePositionLimits, { passive: true });
  window.addEventListener("scroll", updatePositionLimits, { passive: true });
  window.addEventListener("load", updatePositionLimits, { once: true });
  if ("ResizeObserver" in window) {
    const layoutObserver = new ResizeObserver(updatePositionLimits);
    layoutObserver.observe(stage);
    if (stage.parentElement?.parentElement) layoutObserver.observe(stage.parentElement.parentElement);
  }
  updatePositionLimits();
  requestAnimation();
}

function initAnimatedBackground() {
    const symbolsContainer = document.getElementById("symbols");
    const canvas = document.getElementById("particles");
    if (!symbolsContainer || !canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const symbols = ["{ }", "</>", "()=>", "const", "[ ]", "&&", "===", "async", "git", "npm", "0x1", "#", "fn()", "=>"];
    const addSymbols = () => {
      symbolsContainer.replaceChildren();
      const count = window.innerWidth < 700 ? 8 : 18;
      for (let index = 0; index < count; index += 1) {
        const symbol = document.createElement("span");
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        symbol.style.left = `${Math.random() * 100}%`;
        symbol.style.animationDuration = `${14 + Math.random() * 22}s`;
        symbol.style.animationDelay = `${-Math.random() * 30}s`;
        symbolsContainer.append(symbol);
      }
    };

    addSymbols();
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(addSymbols, 180);
    }, { passive: true });

    if (reducedMotion || navigator.connection?.saveData || !canvas.getContext) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let points = [];
    let animationFrame = 0;
    let isRunning = !document.hidden;
    const linkRadius = 130;

    const resizeCanvas = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.min(64, Math.floor((width * height) / 18000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.2 + 0.7
      }));

      if (isRunning) startAnimation();
    };

    const drawFrame = () => {
      animationFrame = 0;
      if (!isRunning) return;

      context.clearRect(0, 0, width, height);
      for (let index = 0; index < points.length; index += 1) {
        const point = points[index];
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(40, 166, 209, 0.72)";
        context.fill();

        for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
          const other = points[otherIndex];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance >= linkRadius) continue;

          const opacity = (1 - distance / linkRadius) * 0.28;
          context.strokeStyle = `rgba(0, 123, 167, ${opacity})`;
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }

      }

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    function startAnimation() {
      if (isRunning && !animationFrame) animationFrame = window.requestAnimationFrame(drawFrame);
    }

    const handleVisibility = () => {
      isRunning = !document.hidden;
      if (!isRunning && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        startAnimation();
      }
    };

    window.addEventListener("resize", resizeCanvas, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    resizeCanvas();
}
