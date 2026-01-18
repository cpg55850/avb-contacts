// delete-contact-modal.js
import { appModalManager } from "./modal-manager.js";

// Export a function to create and push a delete confirmation modal to the stack
export function pushDeleteConfirmModal({ contactId = "", onDelete }) {
  const delTemplate = document.getElementById("tpl-DeleteConfirm");
  const delClone = delTemplate.content.cloneNode(true);
  const delWrapper = document.createElement("div");
  delWrapper.className = "modal-wrapper fixed inset-0 z-50 flex items-center justify-center";
  delWrapper.appendChild(delClone);
  // Set id
  const delIdPlaceholder = delWrapper.querySelector(".id-placeholder");
  if (delIdPlaceholder) delIdPlaceholder.textContent = contactId;
  // Cancel in delete modal
  delWrapper.querySelector(".cancel-btn").addEventListener("click", () => {
    appModalManager.pop();
  });
  // Confirm delete
  delWrapper.querySelector(".confirm-btn").addEventListener("click", () => {
    if (typeof onDelete === "function") onDelete();
    appModalManager.clear();
  });
  appModalManager.push(delWrapper);
}
