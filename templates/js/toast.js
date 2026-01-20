// Toast notification system

export class Toast {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById("toastContainer")) {
      this.container = document.createElement("div");
      this.container.id = "toastContainer";
      this.container.className =
        "fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none";
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById("toastContainer");
    }
  }

  show(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} pointer-events-auto`;

    // Icon based on type
    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };

    const icon = icons[type] || icons.info;

    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <i class="fa ${icon} text-lg"></i>
        <span>${message}</span>
        <button class="toast-close ml-2" aria-label="Close">
          <i class="fa fa-times text-sm"></i>
        </button>
      </div>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("toast-show");
    });

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => this.hide(toast));

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => this.hide(toast), duration);
    }

    return toast;
  }

  hide(toast) {
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");

    // Remove from DOM after animation
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  success(message, duration = 3000) {
    return this.show(message, "success", duration);
  }

  error(message, duration = 4000) {
    return this.show(message, "error", duration);
  }

  warning(message, duration = 3500) {
    return this.show(message, "warning", duration);
  }

  info(message, duration = 3000) {
    return this.show(message, "info", duration);
  }
}

// Create singleton instance
const toast = new Toast();

export default toast;
