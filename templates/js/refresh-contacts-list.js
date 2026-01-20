import { attachContactClickHandlers } from "./contact-click.js";

// Function to refresh contacts list after add/edit/delete
export async function refreshContactsList() {
  const res = await fetch("/api/contacts");
  if (!res.ok) return;
  let contacts = await res.json();
  // Sort contacts by name ascending
  contacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const ul = document.querySelector("#contactsList");
  if (!ul) return;
  ul.innerHTML = "";
  contacts.forEach((contact) => {
    const li = document.createElement("li");
    li.className =
      "p-2 hover:bg-sidebar-accent rounded cursor-pointer contact-item flex items-center gap-3";
    li.setAttribute("data-contact-id", contact.id);
    li.setAttribute("data-contact-name", contact.name);
    li.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-slate-400 dark:bg-slate-600 flex items-center justify-center text-lg font-bold text-white">
        <span>${contact.name[0]?.toUpperCase() || "?"}</span>
      </div>
      <div>
        <div class="font-medium text-sidebar-foreground">${contact.name}</div>
      </div>
    `;
    ul.appendChild(li);
  });
  attachContactClickHandlers();
}
