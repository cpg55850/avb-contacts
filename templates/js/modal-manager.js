class ModalManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stack = []; // Stores the actual DOM elements
  }

  push(templateId, dataId) {
    // 1. Hide the current top modal (if any)
    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].style.display = "none";
    }

    // 2. Create new modal from template
    const template = document.getElementById(`tpl-${templateId}`);
    const clone = template.content.cloneNode(true);

    // Wrap in a div so we can reference it easily
    const modalWrapper = document.createElement("div");
    modalWrapper.className =
      "modal-wrapper fixed inset-0 z-50 flex items-center justify-center";
    modalWrapper.innerHTML =
      '<div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>';
    modalWrapper.appendChild(clone);

    // 3. Inject data (e.g., the #123)
    const placeholder = modalWrapper.querySelector(".id-placeholder");
    if (placeholder) placeholder.textContent = dataId;

    // 4. Add to DOM and Stack
    this.container.appendChild(modalWrapper);
    this.stack.push(modalWrapper);

    // (No per-modal background click handler; handled by event delegation below)
    // 6. Add close on Escape
    const escHandler = (e) => {
      if (e.key === "Escape") {
        this.pop();
      }
    };
    document.addEventListener("keydown", escHandler);
    modalWrapper._escHandler = escHandler;
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
    if (target.matches('[data-action="pop"]')) {
      window.app.pop();
      return;
    }
    if (target.matches('[data-action="confirm-delete"]')) {
      // Custom event for delete confirmation

      return;
    }
  });
