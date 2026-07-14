export function createHelpIcon(): HTMLSpanElement {
  const icon = document.createElement("span");
  icon.className = "help-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "i";
  return icon;
}
