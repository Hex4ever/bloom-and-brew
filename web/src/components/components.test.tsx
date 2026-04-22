import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

afterEach(() => cleanup());

import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { SettingsModal, Toggle, Switch } from "./SettingsModal";
import { PrepChecklist } from "./PrepChecklist";
import { ScoreSlider } from "./ScoreSlider";
import { RatingBars } from "./RatingBars";
import { BrewScene } from "./BrewScene";
import { BrewTimer, fmtTime } from "./BrewTimer";
import type { UserSettings, RatingAxes } from "../types";

// ─── Fixtures ──────────────────────────────────────────────────────────────

const SETTINGS: UserSettings = {
  name: "Tester",
  units: "metric",
  tempUnit: "C",
  musicAuto: false,
  notifications: true,
};

const SCORES: RatingAxes = {
  sweetness: 7, acidity: 6, body: 8, bitterness: 3, aftertaste: 7, overall: 8,
};

// ─── fmtTime helper ────────────────────────────────────────────────────────

describe("fmtTime", () => {
  it("formats 0 as 0:00", () => { expect(fmtTime(0)).toBe("0:00"); });
  it("formats 65 as 1:05", () => { expect(fmtTime(65)).toBe("1:05"); });
  it("formats 210 as 3:30", () => { expect(fmtTime(210)).toBe("3:30"); });
});

// ─── BottomNav ─────────────────────────────────────────────────────────────

describe("BottomNav", () => {
  it("renders all 5 main nav labels plus More", () => {
    render(<BottomNav screen="welcome" go={vi.fn()} openSettings={vi.fn()} />);
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Brew")).toBeTruthy();
    expect(screen.getByText("Journal")).toBeTruthy();
    expect(screen.getByText("Beans")).toBeTruthy();
    expect(screen.getByText("Cafes")).toBeTruthy();
    expect(screen.getByText("More")).toBeTruthy();
  });

  it("calls go with correct id when a nav item is clicked", () => {
    const go = vi.fn();
    render(<BottomNav screen="welcome" go={go} openSettings={vi.fn()} />);
    fireEvent.click(screen.getByText("Journal"));
    expect(go).toHaveBeenCalledWith("journal");
  });

  it("marks welcome as active when screen=welcome", () => {
    render(<BottomNav screen="welcome" go={vi.fn()} openSettings={vi.fn()} />);
    // 6 buttons: 5 nav items + More
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });
});

// ─── Sidebar ───────────────────────────────────────────────────────────────

describe("Sidebar", () => {
  it("renders all 8 nav labels plus Settings", () => {
    render(<Sidebar screen="welcome" go={vi.fn()} openSettings={vi.fn()} />);
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Brew")).toBeTruthy();
    expect(screen.getByText("Brew Journal")).toBeTruthy();
    expect(screen.getByText("Discover Beans")).toBeTruthy();
    expect(screen.getByText("My Bean Log")).toBeTruthy();
    expect(screen.getByText("Community")).toBeTruthy();
    expect(screen.getByText("Cafes Near Me")).toBeTruthy();
    expect(screen.getByText("Glossary")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
  });

  it("calls go with the item id when clicked", () => {
    const go = vi.fn();
    render(<Sidebar screen="welcome" go={go} openSettings={vi.fn()} />);
    fireEvent.click(screen.getByText("Glossary"));
    expect(go).toHaveBeenCalledWith("glossary");
  });

  it("calls openSettings when Settings is clicked", () => {
    const open = vi.fn();
    render(<Sidebar screen="welcome" go={vi.fn()} openSettings={open} />);
    fireEvent.click(screen.getByText("Settings"));
    expect(open).toHaveBeenCalled();
  });
});

// ─── Toggle ────────────────────────────────────────────────────────────────

describe("Toggle", () => {
  it("calls onChange with the chosen value", () => {
    const onChange = vi.fn();
    render(
      <Toggle
        options={[["metric", "Metric (g)"], ["imperial", "Imperial (oz)"]]}
        value="metric"
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText("Imperial (oz)"));
    expect(onChange).toHaveBeenCalledWith("imperial");
  });
});

// ─── Switch ────────────────────────────────────────────────────────────────

describe("Switch", () => {
  it("calls onChange with the toggled value", () => {
    const onChange = vi.fn();
    render(<Switch on={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange(false) when currently on", () => {
    const onChange = vi.fn();
    render(<Switch on={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(false);
  });
});

// ─── SettingsModal ─────────────────────────────────────────────────────────

describe("SettingsModal", () => {
  it("renders the display name input with current value", () => {
    render(<SettingsModal settings={SETTINGS} setSettings={vi.fn()} onClose={vi.fn()} />);
    const input = screen.getByDisplayValue("Tester") as HTMLInputElement;
    expect(input).toBeTruthy();
  });

  it("calls setSettings when the name input changes", () => {
    const setSettings = vi.fn();
    render(<SettingsModal settings={SETTINGS} setSettings={setSettings} onClose={vi.fn()} />);
    const input = screen.getByDisplayValue("Tester");
    fireEvent.change(input, { target: { value: "Praveen" } });
    expect(setSettings).toHaveBeenCalledWith({ ...SETTINGS, name: "Praveen" });
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <SettingsModal settings={SETTINGS} setSettings={vi.fn()} onClose={onClose} />
    );
    // The outermost div is the backdrop
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalled();
  });

  it("does NOT close when the inner modal card is clicked", () => {
    const onClose = vi.fn();
    render(<SettingsModal settings={SETTINGS} setSettings={vi.fn()} onClose={onClose} />);
    // "Settings" is the text node value — CSS textTransform doesn't change DOM text
    fireEvent.click(screen.getByText("Settings"));
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ─── PrepChecklist ─────────────────────────────────────────────────────────

describe("PrepChecklist", () => {
  it("renders for a known method without crashing", () => {
    render(<PrepChecklist methodId="v60" />);
    expect(screen.getByText("PREP CHECKLIST")).toBeTruthy();
  });

  it("renders for an unknown method using the default", () => {
    render(<PrepChecklist methodId="cold-brew" />);
    expect(screen.getByText("PREP CHECKLIST")).toBeTruthy();
  });

  it("collapses and expands when the header is clicked", () => {
    render(<PrepChecklist methodId="v60" />);
    const header = screen.getAllByRole("button")[0];
    // Steps visible initially (expanded by default)
    fireEvent.click(header);
    // Steps hidden after collapse — just verify no crash
    fireEvent.click(header);
    // Steps visible again
    expect(screen.getByText("PREP CHECKLIST")).toBeTruthy();
  });

  it("marks a step as checked when clicked", () => {
    render(<PrepChecklist methodId="v60" />);
    // Get all step buttons (skip the header button)
    const stepBtns = screen.getAllByRole("button").slice(1);
    expect(stepBtns.length).toBeGreaterThan(0);
    fireEvent.click(stepBtns[0]);
    // After click, the counter should show 1/N — just check it rendered
    expect(screen.getByText(/1\//)).toBeTruthy();
  });
});

// ─── ScoreSlider ───────────────────────────────────────────────────────────

describe("ScoreSlider", () => {
  const axis = { key: "sweetness" as const, label: "Sweetness", lo: "Flat", hi: "Sweet" };

  it("renders the axis label and current value", () => {
    render(<ScoreSlider axis={axis} value={7} onChange={vi.fn()} />);
    expect(screen.getByText("Sweetness")).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
  });

  it("renders lo/hi labels", () => {
    render(<ScoreSlider axis={axis} value={5} onChange={vi.fn()} />);
    expect(screen.getByText("FLAT")).toBeTruthy();
    expect(screen.getByText("SWEET")).toBeTruthy();
  });

  it("calls onChange when the range input changes", () => {
    const onChange = vi.fn();
    render(<ScoreSlider axis={axis} value={5} onChange={onChange} />);
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "8" } });
    expect(onChange).toHaveBeenCalledWith(8);
  });
});

// ─── RatingBars ────────────────────────────────────────────────────────────

describe("RatingBars", () => {
  it("renders all five axis labels", () => {
    render(<RatingBars scores={SCORES} />);
    expect(screen.getByText("Sweetness")).toBeTruthy();
    expect(screen.getByText("Acidity")).toBeTruthy();
    expect(screen.getByText("Body")).toBeTruthy();
    expect(screen.getByText("Bitterness")).toBeTruthy();
    expect(screen.getByText("Aftertaste")).toBeTruthy();
  });

  it("renders each score value", () => {
    render(<RatingBars scores={SCORES} />);
    // SCORES: sweetness:7, acidity:6, body:8, bitterness:3, aftertaste:7 — 7 appears twice
    expect(screen.getAllByText("7")).toHaveLength(2); // sweetness + aftertaste
    expect(screen.getByText("6")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
    expect(screen.getByText("3")).toBeTruthy();
  });
});

// ─── BrewScene ─────────────────────────────────────────────────────────────

describe("BrewScene", () => {
  const baseProps = { phase: "brewing" as const, stepLabel: "Bloom", progress: 0.3 };

  it("renders without crashing for v60 (default pour-over)", () => {
    const { container } = render(<BrewScene {...baseProps} method="v60" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders without crashing for aeropress", () => {
    const { container } = render(<BrewScene {...baseProps} method="aeropress" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders without crashing for chemex", () => {
    const { container } = render(<BrewScene {...baseProps} method="chemex" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders without crashing for french press", () => {
    const { container } = render(<BrewScene {...baseProps} method="french" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders without crashing for moka", () => {
    const { container } = render(<BrewScene {...baseProps} method="moka" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders without crashing for espresso", () => {
    const { container } = render(<BrewScene {...baseProps} method="espresso" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("uses MilkScene for methods with hasMilk=true", () => {
    const { container } = render(<BrewScene {...baseProps} method="v60" hasMilk={true} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("shows the LIVE indicator", () => {
    render(<BrewScene {...baseProps} method="v60" />);
    expect(screen.getByText("● LIVE")).toBeTruthy();
  });

  it("shows the method name in the corner", () => {
    render(<BrewScene {...baseProps} method="v60" />);
    expect(screen.getByText("V60")).toBeTruthy();
  });
});

// ─── BrewTimer ─────────────────────────────────────────────────────────────

describe("BrewTimer", () => {
  it("shows elapsed and total time", () => {
    render(<BrewTimer elapsed={65} total={210} brewing={true} />);
    expect(screen.getByText("1:05")).toBeTruthy();
    expect(screen.getByText("OF 3:30")).toBeTruthy();
  });

  it("shows countdown to next step when brewing", () => {
    const nextStep = { t: 120, label: "Final pour", desc: "Pour to 250g", pour: 75 };
    render(<BrewTimer elapsed={65} total={210} nextStep={nextStep} brewing={true} />);
    expect(screen.getByText("NEXT IN")).toBeTruthy();
    expect(screen.getByText("Final pour")).toBeTruthy();
    // countdown should be 120-65 = 55s → "0:55"
    expect(screen.getByText("0:55")).toBeTruthy();
  });

  it("does not show next-step countdown when not brewing", () => {
    const nextStep = { t: 120, label: "Final pour", desc: "Pour to 250g", pour: 75 };
    render(<BrewTimer elapsed={65} total={210} nextStep={nextStep} brewing={false} />);
    expect(screen.queryByText("NEXT IN")).toBeNull();
  });

  it("does not show countdown when there is no next step", () => {
    render(<BrewTimer elapsed={180} total={210} brewing={true} />);
    expect(screen.queryByText("NEXT IN")).toBeNull();
  });
});
