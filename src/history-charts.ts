import type { CompletedWorkout } from "./types";
import { computeEffortScore, effortScoreClass } from "./effort-score";
import { messages } from "./i18n";
import { formatHistoryDateShort, getLocale, tWeekStreak, tWeeklyAverage } from "./i18n";
import { renderLabelWithTooltip } from "./label-tooltip";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface EffortPoint {
  completedAt: number;
  score: number;
}

export interface WeekActivity {
  weekStart: number;
  count: number;
  label: string;
}

export function buildEffortTimeline(entries: CompletedWorkout[]): EffortPoint[] {
  return [...entries]
    .sort((a, b) => a.completedAt - b.completedAt)
    .map((entry) => ({
      completedAt: entry.completedAt,
      score: computeEffortScore(entry),
    }));
}

export function buildWeeklyActivity(entries: CompletedWorkout[], weekCount = 10): WeekActivity[] {
  const now = Date.now();
  const locale = getLocale();

  return Array.from({ length: weekCount }, (_, index) => {
    const weeksFromEnd = weekCount - 1 - index;
    const weekEnd = now - weeksFromEnd * WEEK_MS;
    const weekStart = weekEnd - WEEK_MS;
    const count = entries.filter(
      (entry) => entry.completedAt >= weekStart && entry.completedAt < weekEnd,
    ).length;

    const label = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
      new Date(weekStart),
    );

    return { weekStart, count, label };
  });
}

export function currentWeekStreak(weeks: WeekActivity[]): number {
  let streak = 0;
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i].count > 0) streak += 1;
    else break;
  }
  return streak;
}

export function weeklyAverage(weeks: WeekActivity[]): number {
  const total = weeks.reduce((sum, week) => sum + week.count, 0);
  return Math.round((total / weeks.length) * 10) / 10;
}

function el(tag: string, attrs: Record<string, string> = {}, children: (HTMLElement | string)[] = []): HTMLElement {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  });
  children.forEach((child) => {
    if (typeof child === "string") node.appendChild(document.createTextNode(child));
    else node.appendChild(child);
  });
  return node;
}

export function renderEffortChart(entries: CompletedWorkout[]): HTMLElement {
  const points = buildEffortTimeline(entries);

  if (points.length < 2) {
    return el("section", { className: "card history-chart-card" }, [
      (() => {
        const title = document.createElement("h3");
        title.className = "history-chart-title";
        title.appendChild(
          renderLabelWithTooltip(
            messages.history.effortChartTitle,
            messages.history.effortTooltip,
            "below",
          ),
        );
        return title;
      })(),
      el("p", { className: "history-chart-empty", text: messages.history.chartNeedsMore }),
    ]);
  }

  const width = 320;
  const height = 112;
  const pad = { top: 10, right: 10, bottom: 22, left: 26 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const minT = points[0].completedAt;
  const maxT = points[points.length - 1].completedAt;
  const timeSpan = Math.max(maxT - minT, 1);

  const coords = points.map((point) => ({
    x: pad.left + ((point.completedAt - minT) / timeSpan) * plotW,
    y: pad.top + (1 - (point.score - 1) / 9) * plotH,
    score: point.score,
  }));

  const linePath = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(pad.top + plotH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(pad.top + plotH).toFixed(1)} Z`;

  const yTicks = [1, 5, 10]
    .map((score) => {
      const y = pad.top + (1 - (score - 1) / 9) * plotH;
      return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" class="chart-grid-line" />
        <text x="${pad.left - 6}" y="${y + 3}" class="chart-axis-label" text-anchor="end">${score}</text>`;
    })
    .join("");

  const dots = coords
    .map(
      (coord) =>
        `<circle cx="${coord.x}" cy="${coord.y}" r="3" class="chart-dot chart-dot-${effortScoreClass(coord.score)}" />`,
    )
    .join("");

  const card = el("section", { className: "card history-chart-card" }, [
    (() => {
      const title = document.createElement("h3");
      title.className = "history-chart-title";
      title.appendChild(
        renderLabelWithTooltip(
          messages.history.effortChartTitle,
          messages.history.effortTooltip,
          "below",
        ),
      );
      return title;
    })(),
  ]);

  const chartWrap = el("div", { className: "history-chart-wrap" });
  chartWrap.innerHTML = `<svg class="effort-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${messages.history.effortChartTitle}">
    ${yTicks}
    <path d="${areaPath}" class="chart-area" />
    <path d="${linePath}" class="chart-line" />
    ${dots}
    <text x="${pad.left}" y="${height - 6}" class="chart-axis-label">${formatHistoryDateShort(minT)}</text>
    <text x="${width - pad.right}" y="${height - 6}" class="chart-axis-label" text-anchor="end">${formatHistoryDateShort(maxT)}</text>
  </svg>`;

  card.appendChild(chartWrap);
  return card;
}

export function renderRegularityChart(entries: CompletedWorkout[]): HTMLElement {
  const weeks = buildWeeklyActivity(entries);
  const streak = currentWeekStreak(weeks);
  const average = weeklyAverage(weeks);
  const maxCount = Math.max(1, ...weeks.map((week) => week.count));

  const card = el("section", { className: "card history-chart-card regularity-card" }, [
    el("h3", { className: "history-chart-title", text: messages.history.regularityTitle }),
    el("div", { className: "regularity-stats" }, [
      el("span", { className: "regularity-stat", text: tWeekStreak(streak) }),
      el("span", { className: "regularity-stat", text: tWeeklyAverage(average) }),
    ]),
    el(
      "div",
      { className: "week-bars", role: "img", ariaLabel: messages.history.regularityTitle },
      weeks.map((week) => {
        const heightPct = Math.round((week.count / maxCount) * 100);
        return el("div", { className: "week-bar-col" }, [
          el("span", { className: "week-bar-count", text: week.count > 0 ? String(week.count) : "" }),
          el("div", { className: "week-bar-track" }, [
            el("div", {
              className: `week-bar-fill ${week.count > 0 ? "active" : ""}`,
              style: `height: ${week.count > 0 ? Math.max(heightPct, 12) : 0}%`,
            }),
          ]),
          el("span", { className: "week-bar-label", text: week.label }),
        ]);
      }),
    ),
  ]);

  return card;
}

export function renderHistoryInsights(entries: CompletedWorkout[]): HTMLElement | null {
  if (entries.length === 0) return null;

  return el("div", { className: "history-insights" }, [
    renderEffortChart(entries),
    renderRegularityChart(entries),
  ]);
}
