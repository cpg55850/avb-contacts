// Generic Modal logic
const genericModal = document.getElementById("genericModal");
const genericModalTitle = document.getElementById("genericModalTitle");
const genericModalDesc = document.getElementById("genericModalDesc");
const genericModalContent = document.getElementById("genericModalContent");
const closeGenericModal = document.getElementById("closeGenericModal");

export function showGenericModal({
  title = "",
  description = "",
  content = "",
  onOpen,
  onClose,
}) {
  genericModalTitle.textContent = title;
  genericModalDesc.textContent = description;
  if (typeof content === "string") {
    genericModalContent.innerHTML = content;
  } else if (content instanceof Node) {
    genericModalContent.innerHTML = "";
    genericModalContent.appendChild(content);
  }
  genericModal.classList.remove("hidden");
  genericModal.classList.add("flex");
  document.body.classList.add("overflow-hidden");
  if (onOpen) onOpen();
  // Attach close handler
  genericModal._onClose = onClose;
}

export function hideGenericModal() {
  genericModal.classList.add("hidden");
  genericModal.classList.remove("flex");
  document.body.classList.remove("overflow-hidden");
  if (typeof genericModal._onClose === "function") {
    genericModal._onClose();
  }
  genericModal._onClose = null;
}

closeGenericModal.addEventListener("click", hideGenericModal);
genericModal.addEventListener("click", (e) => {
  if (e.target === genericModal || e.target.classList.contains("bg-black/50")) {
    hideGenericModal();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !genericModal.classList.contains("hidden")) {
    hideGenericModal();
  }
});
