export function createModal({ title, content, buttons, className = "" }) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "modal-wrapper fixed inset-0 z-50 flex items-center justify-center";

  wrapper.innerHTML = `
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="modal-content bg-background text-foreground rounded-lg border border-border shadow-xl p-6 relative w-full max-w-lg mx-auto ${className}">
      <button
        class="close-btn absolute top-3 right-3 text-xl text-gray-400 hover:text-gray-700 transition hover:cursor-pointer"
        title="Close"
      >
        <i class="fa fa-times"></i>
      </button>
      <h3 class="text-xl font-semibold mb-4">${title}</h3>
      <div class="modal-body">${content}</div>
      <div class="flex gap-2 mt-4 justify-end">${buttons}</div>
    </div>
  `;

  // Auto-attach close button handler
  wrapper.querySelector(".close-btn").addEventListener("click", () => {
    window.app.pop();
  });

  return wrapper;
}
