import { createHelpIcon } from "./help-icon";

export type TooltipPlacement = "above" | "below";

export function renderLabelWithTooltip(
  label: string,
  tooltip: string,
  placement: TooltipPlacement = "above",
): HTMLElement {
  const wrap = document.createElement("span");
  wrap.className =
    placement === "below" ? "label-with-tooltip label-with-tooltip--below" : "label-with-tooltip";

  const labelText = document.createElement("span");
  labelText.className = "label-with-tooltip-text";
  labelText.textContent = label;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "label-tooltip-btn";
  button.setAttribute("aria-label", tooltip);
  button.appendChild(createHelpIcon());

  const bubble = document.createElement("span");
  bubble.className = "label-tooltip-bubble";
  bubble.setAttribute("role", "tooltip");
  bubble.textContent = tooltip;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const isOpen = wrap.classList.contains("open");
    if (isOpen) {
      wrap.classList.remove("open");
      wrap.classList.add("dismissed");
      button.blur();
    } else {
      wrap.classList.remove("dismissed");
      wrap.classList.add("open");
    }
  });

  wrap.addEventListener("mouseleave", () => {
    wrap.classList.remove("dismissed");
  });

  wrap.append(labelText, button, bubble);
  return wrap;
}
