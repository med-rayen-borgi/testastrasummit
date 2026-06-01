const quoteText = `"We always feel that space is out of our reach. Not anymore."`;
const quote = document.getElementById("quote");
const nav = document.querySelector(".nav");
const progress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function typeQuote() {
    if (!quote) {
        return;
    }

    if (prefersReducedMotion) {
        quote.textContent = quoteText;
        quote.classList.add("is-complete");
        return;
    }

    let index = 0;

    function writeNextCharacter() {
        quote.textContent += quoteText.charAt(index);
        index += 1;

        if (index < quoteText.length) {
            window.setTimeout(writeNextCharacter, 34);
        } else {
            quote.classList.add("is-complete");
        }
    }

    writeNextCharacter();
}

function updateChrome() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = scrollable > 0 ? scrollTop / scrollable : 0;

    if (nav) {
        nav.classList.toggle("is-scrolled", scrollTop > 24);
    }

    if (progress) {
        progress.style.transform = `scaleX(${Math.min(Math.max(progressValue, 0), 1)})`;
    }
}

function setupReveals() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    revealItems.forEach((item) => observer.observe(item));
}

window.addEventListener("load", () => {
    setupReveals();
    typeQuote();
    updateChrome();
});

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
