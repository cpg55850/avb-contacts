// Mobile menu functionality for contacts sidebar

export class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById("mobileMenuToggle");
    this.sidebar = document.getElementById("contactsSidebar");
    this.overlay = document.getElementById("mobileOverlay");
    this.isOpen = false;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Toggle button click
    this.menuToggle?.addEventListener("click", () => this.toggle());

    // Overlay click to close
    this.overlay?.addEventListener("click", () => this.close());

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // Close when selecting a contact on mobile
    this.sidebar?.addEventListener("click", (e) => {
      const contactItem = e.target.closest(".contact-item");
      if (contactItem && window.innerWidth < 1024) {
        // Small delay to allow contact selection to register
        setTimeout(() => this.close(), 100);
      }
    });

    // Handle window resize - ensure proper state on desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.reset();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.sidebar?.classList.remove("-translate-x-full");
    this.overlay?.classList.remove("hidden");
    this.menuToggle?.classList.replace("left-4", "left-[288px]");
    this.menuToggle
      ?.querySelector("i")
      .classList.replace("fa-bars", "fa-times");
    this.isOpen = true;

    // Prevent body scroll on mobile
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    }
  }

  close() {
    this.sidebar?.classList.add("-translate-x-full");
    this.overlay?.classList.add("hidden");
    this.menuToggle?.classList.replace("left-[288px]", "left-4");
    this.menuToggle
      ?.querySelector("i")
      .classList.replace("fa-times", "fa-bars");
    this.isOpen = false;

    // Restore body scroll
    document.body.style.overflow = "";
  }

  reset() {
    // Reset to default state (used on resize to desktop)
    this.overlay?.classList.add("hidden");
    this.menuToggle?.classList.remove("left-[288px]");
    this.menuToggle?.classList.add("left-4");
    this.menuToggle
      ?.querySelector("i")
      ?.classList.replace("fa-times", "fa-bars");
    this.isOpen = false;
    document.body.style.overflow = "";
  }
}

// Initialize mobile menu immediately (ES modules are already deferred)
const mobileMenu = new MobileMenu();

export { mobileMenu };
