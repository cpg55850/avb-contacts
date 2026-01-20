// Reusable contact form builder for creating/editing contacts

export class ContactFormBuilder {
  constructor(containerElement) {
    this.container = containerElement;
  }

  // Create the complete form structure
  createForm({ name = "", phone = "", emails = [""] } = {}) {
    this.container.innerHTML = `
      <div class="space-y-4">
        <div>
          <label for="contactName" class="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            id="contactName"
            required
            value="${name}"
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
      alert("At least one email is required");
    }
  }

  // Get form values
  getFormData() {
    const name = this.container.querySelector("#contactName").value.trim();
    const phone = this.container.querySelector("#contactPhone").value.trim();
    const emails = this.getEmailValues();

    return {
      name,
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
    const { name, emails } = this.getFormData();

    if (!name) {
      alert("Name is required");
      return false;
    }

    if (emails.length === 0) {
      alert("At least one email is required");
      return false;
    }

    return true;
  }
}
