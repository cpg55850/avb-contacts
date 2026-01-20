class ModalManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stack = []; // Stores the actual DOM elements
  }

  // Push a DOM element
  push(modalWrapper) {
    // Hide the current top modal (if any)
    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].style.display = "none";
    }

    // Add to DOM and stack
    this.container.appendChild(modalWrapper);
    this.stack.push(modalWrapper);

    // Add close on Escape
    const escHandler = (e) => {
      if (e.key === "Escape") {
        this.pop();
      }
    };
    document.addEventListener("keydown", escHandler);
    modalWrapper._escHandler = escHandler;

    // Show the modal
    modalWrapper.style.display = "flex";
  }

  pop() {
    if (this.stack.length === 0) return;

    // 1. Remove the current top modal from DOM and Stack
    const topModal = this.stack.pop();
    document.removeEventListener("keydown", topModal._escHandler);
    this.container.removeChild(topModal);

    // 2. Show the previous modal (resuming state)
    if (this.stack.length > 0) {
      const previousModal = this.stack[this.stack.length - 1];
      previousModal.style.display = "flex";
    }
  }

  clear() {
    while (this.stack.length > 0) {
      const topModal = this.stack.pop();
      document.removeEventListener("keydown", topModal._escHandler);
      this.container.removeChild(topModal);
    }
  }

  peek() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }
}

window.app = new ModalManager("modal-container");

// Event Delegation for modal actions
document
  .getElementById("modal-container")
  .addEventListener("click", function (e) {
    const target = e.target;
    // Close modal on background click
    if (
      target.classList.contains("bg-black/50") ||
      target.classList.contains("modal-wrapper")
    ) {
      window.app.pop();
      return;
    }
    // Handle data-action buttons
    if (target.closest('[data-action="pop"]')) {
      window.app.pop();
      return;
    }
    if (target.matches('[data-action="confirm-delete"]')) {
      // Custom event for delete confirmation

      return;
    }
  });
