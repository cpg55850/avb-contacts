// Inline editing for contact details
import { pushDeleteConfirmModal } from "./delete-contact-modal.js";
import { ContactFormBuilder } from "./contact-form-builder.js";
import toast from "./toast.js";

class ContactEditor {
  constructor() {
    this.isEditMode = false;
    this.detailsSection = document.getElementById("contactDetails");
    this.formBuilder = null;
    this.elements = {
      // Display container
      displayFields: document.getElementById("displayFields"),

      // Individual display elements (for updating values)
      detailName: document.getElementById("detailName"),
      detailPhone: document.getElementById("detailPhone"),
      detailEmails: document.getElementById("detailEmails"),

      // Edit container
      editContainer: document.getElementById("editEmails"),

      // Buttons
      editButtons: document.getElementById("editButtons"),
      saveButtons: document.getElementById("saveButtons"),
      deleteSection: document.getElementById("deleteContactSection"),
    };

    this.attachEventListeners();
  }

  get contactData() {
    return JSON.parse(this.detailsSection.dataset.contactData || "{}");
  }

  get contactId() {
    return this.detailsSection.dataset.contactId;
  }

  attachEventListeners() {
    document
      .getElementById("editContactBtn")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.enterEditMode();
      });

    document
      .getElementById("saveContactBtn")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.saveChanges();
      });

    document.getElementById("cancelEditBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.exitEditMode();
    });

    document
      .getElementById("deleteContactBtn")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteContact();
      });
  }

  setMode(mode) {
    this.isEditMode = mode === "edit";

    const isEdit = this.isEditMode;

    this.elements.displayFields.classList.toggle("hidden", isEdit);
    this.elements.editContainer.classList.toggle("hidden", !isEdit);
    this.elements.deleteSection.classList.toggle("hidden", !isEdit);
    this.elements.editButtons.classList.toggle("hidden", isEdit);
    this.elements.saveButtons.classList.toggle("hidden", !isEdit);
  }

  enterEditMode() {
    if (this.isEditMode) return;

    const contactData = this.contactData;

    // Initialize form builder with contact data
    this.formBuilder = new ContactFormBuilder(this.elements.editContainer);
    this.formBuilder.createForm({
      firstName: contactData.firstName || "",
      lastName: contactData.lastName || "",
      phone: contactData.phone || "",
      emails: contactData.emails || [],
    });

    // Add Enter key handler for quick save
    this.handleEnterKey = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.saveChanges();
      }
    };
    this.elements.editContainer.addEventListener(
      "keydown",
      this.handleEnterKey,
    );

    this.setMode("edit");
  }

  exitEditMode() {
    if (!this.isEditMode) return;

    // Remove Enter key handler
    if (this.handleEnterKey) {
      this.elements.editContainer.removeEventListener(
        "keydown",
        this.handleEnterKey,
      );
      this.handleEnterKey = null;
    }

    this.formBuilder = null;
    this.setMode("display");
  }

  async saveChanges() {
    if (!this.contactId) {
      console.error("No contact ID found");
      return;
    }

    if (!this.formBuilder.validate()) {
      return;
    }

    const updateData = this.formBuilder.getFormData();

    try {
      const response = await fetch(`/api/contacts/${this.contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update contact");
        return;
      }

      const updatedContact = await response.json();
      this.updateDisplay(updatedContact);
      this.updateListItem(updatedContact);
      this.detailsSection.dataset.contactData = JSON.stringify(updatedContact);
      this.exitEditMode();
      toast.success("Contact updated successfully!");
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Failed to update contact. Please try again.");
    }
  }

  updateDisplay(contact) {
    this.elements.detailName.textContent = contact.name;
    this.elements.detailPhone.textContent = contact.phone || "N/A";

    this.elements.detailEmails.innerHTML = "";
    contact.emails.forEach((email) => {
      const emailEl = document.createElement("p");
      emailEl.className = "text-foreground";
      emailEl.textContent = email;
      this.elements.detailEmails.appendChild(emailEl);
    });
  }

  updateListItem(contact) {
    const listItem = document.querySelector(
      `.contact-item[data-contact-id="${this.contactId}"]`,
    );
    if (!listItem) return;

    listItem.dataset.contactName = contact.name;

    const nameDiv = listItem.querySelector(".font-medium");
    if (nameDiv) nameDiv.textContent = contact.name;

    const avatarSpan = listItem.querySelector(".rounded-full span");
    if (avatarSpan) {
      avatarSpan.textContent = contact.name[0]?.toUpperCase() || "?";
    }
  }

  deleteContact() {
    const contactData = this.contactData;

    if (!this.contactId) {
      console.error("No contact ID found");
      return;
    }

    pushDeleteConfirmModal({
      contactId: this.contactId,
      contactName: contactData.name,
      onDelete: async () => {
        try {
          const response = await fetch(`/api/contacts/${this.contactId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.error || "Failed to delete contact");
            return;
          }

          this.detailsSection.classList.add("hidden");
          document.getElementById("welcomeSection").classList.remove("hidden");

          const listItem = document.querySelector(
            `.contact-item[data-contact-id="${this.contactId}"]`,
          );
          listItem?.remove();

          this.exitEditMode();
          toast.success("Contact deleted successfully!");
        } catch (error) {
          console.error("Error deleting contact:", error);
          toast.error("Failed to delete contact. Please try again.");
        }
      },
    });
  }
}

// Initialize and expose globally
let contactEditor;

document.addEventListener("DOMContentLoaded", () => {
  contactEditor = new ContactEditor();
  window.exitEditMode = () => contactEditor.exitEditMode();
});

export { contactEditor };
