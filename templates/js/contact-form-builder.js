// Reusable contact form builder for creating/editing contacts
import toast from "./toast.js";

export class ContactFormBuilder {
  constructor(containerElement) {
    this.container = containerElement;
  }

  // Validation helpers
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    if (!phone) return true; // Phone is optional
    // Allow various phone formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890, etc.
    const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
    const digitsOnly = phone.replace(/\D/g, "");
    return (
      phoneRegex.test(phone) &&
      digitsOnly.length >= 10 &&
      digitsOnly.length <= 15
    );
  }

  static normalizePhone(phone) {
    if (!phone) return null;
    return phone.trim();
  }

  // Create the complete form structure
  createForm({
    firstName = "",
    lastName = "",
    phone = "",
    emails = [""],
  } = {}) {
    this.container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label for="contactFirstName" class="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            id="contactFirstName"
            required
            value="${firstName}"
            class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label for="contactLastName" class="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            id="contactLastName"
            required
            value="${lastName}"
            class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label for="contactPhone" class="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            id="contactPhone"
            value="${phone}"
            class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Emails</label>
          <div id="contactEmails" class="space-y-2"></div>
        </div>
      </div>
    `;

    this.emailsContainer = this.container.querySelector("#contactEmails");
    this.renderEmailInputs(emails.length > 0 ? emails : [""]);
  }

  renderEmailInputs(emails) {
    this.emailsContainer.innerHTML = "";

    emails.forEach((email) => {
      this.emailsContainer.appendChild(this.createEmailInput(email));
    });

    this.emailsContainer.appendChild(this.createAddEmailButton());
  }

  createEmailInput(emailValue = "") {
    const wrapper = document.createElement("div");
    wrapper.className = "relative group";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.className =
      "w-full px-3 py-2 pr-10 border border-border rounded-md bg-background text-foreground";
    emailInput.value = emailValue;
    emailInput.placeholder = "Email address";
    emailInput.required = true;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
      "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 w-6 h-6 flex items-center justify-center hover:cursor-pointer";
    deleteBtn.innerHTML = '<i class="fa fa-trash text-sm"></i>';
    deleteBtn.onclick = () => this.removeEmailInput(wrapper);

    wrapper.appendChild(emailInput);
    wrapper.appendChild(deleteBtn);
    return wrapper;
  }

  createAddEmailButton() {
    const addEmailBtn = document.createElement("button");
    addEmailBtn.type = "button";
    addEmailBtn.className =
      "mt-2 text-sm text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer";
    addEmailBtn.innerHTML = '<i class="fa fa-plus"></i> Add another email';
    addEmailBtn.onclick = () => {
      const newEmailWrapper = this.createEmailInput();
      this.emailsContainer.insertBefore(newEmailWrapper, addEmailBtn);
    };
    return addEmailBtn;
  }

  removeEmailInput(wrapper) {
    const emailInputs = this.emailsContainer.querySelectorAll(
      "input[type='email']",
    );
    if (emailInputs.length > 1) {
      wrapper.remove();
    } else {
      toast.warning("At least one email is required");
    }
  }

  // Get form values
  getFormData() {
    const firstName = this.container
      .querySelector("#contactFirstName")
      .value.trim();
    const lastName = this.container
      .querySelector("#contactLastName")
      .value.trim();
    const phone = this.container.querySelector("#contactPhone").value.trim();
    const emails = this.getEmailValues();

    return {
      firstName,
      lastName,
      phone: phone || null,
      emails,
    };
  }

  getEmailValues() {
    const emailInputs = this.emailsContainer.querySelectorAll(
      "input[type='email']",
    );
    return Array.from(emailInputs)
      .map((input) => input.value.trim())
      .filter((email) => email !== "");
  }

  // Validate form
  validate() {
    const { firstName, lastName, phone, emails } = this.getFormData();

    // Validate first name
    if (!firstName) {
      toast.error("First name is required");
      this.container.querySelector("#contactFirstName")?.focus();
      return false;
    }

    if (firstName.length > 60) {
      toast.error("First name must be 60 characters or less");
      this.container.querySelector("#contactFirstName")?.focus();
      return false;
    }

    // Validate last name
    if (!lastName) {
      toast.error("Last name is required");
      this.container.querySelector("#contactLastName")?.focus();
      return false;
    }

    if (lastName.length > 60) {
      toast.error("Last name must be 60 characters or less");
      this.container.querySelector("#contactLastName")?.focus();
      return false;
    }

    // Validate phone
    if (phone && !ContactFormBuilder.isValidPhone(phone)) {
      toast.error("Please enter a valid phone number (10-15 digits)");
      this.container.querySelector("#contactPhone")?.focus();
      return false;
    }

    // Validate emails
    if (emails.length === 0) {
      toast.error("At least one email is required");
      return false;
    }

    // Check for valid email format
    for (const email of emails) {
      if (!ContactFormBuilder.isValidEmail(email)) {
        toast.error(`Invalid email format: ${email}`);
        return false;
      }
    }

    // Check for duplicate emails
    const emailSet = new Set();
    for (const email of emails) {
      const lowerEmail = email.toLowerCase();
      if (emailSet.has(lowerEmail)) {
        toast.error(`Duplicate email found: ${email}`);
        return false;
      }
      emailSet.add(lowerEmail);
    }

    return true;
  }
}
