import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Typography, Select, message, Tooltip, Modal } from "antd";
import {
  CheckOutlined,
  SaveOutlined,
  UndoOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// ── Types 
type Theme = "light" | "dark" | "system";
type FontTarget = "navbar" | "content" | "footer" | "sidebar";

interface SidebarPreset { label: string; bg: string; accent: string; }
interface FontSetting   { fontFamily: string; fontColor: string; }

interface SettingsState {
  theme:              Theme;
  timezone:           string;
  sidebarColor:       string;
  accentColor:        string;
  customSidebarColor: string;
  fontTarget:         FontTarget;
  fontSettings:       Record<FontTarget, FontSetting>;
}

// ── Constants 
const SIDEBAR_PRESETS: SidebarPreset[] = [
  { label: "Midnight Blue", bg: "#001529", accent: "#1890ff" },
  { label: "Royal Indigo",  bg: "#2e3492", accent: "#6c63ff" },
  { label: "Obsidian",      bg: "#1a1a2e", accent: "#e94560" },
  { label: "Forest",        bg: "#1b3a2d", accent: "#52c41a" },
  { label: "Slate",         bg: "#1e293b", accent: "#38bdf8" },
  { label: "Charcoal",      bg: "#2d2d2d", accent: "#faad14" },
  { label: "Plum",          bg: "#3b0764", accent: "#d946ef" },
  { label: "Crimson",       bg: "#450a0a", accent: "#f87171" },
];

const FONT_PRESETS = [
  { label: "Segoe UI",     value: "'Segoe UI', sans-serif"      },
  { label: "Georgia",      value: "Georgia, serif"              },
  { label: "Courier New",  value: "'Courier New', monospace"    },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif"  },
  { label: "Verdana",      value: "Verdana, sans-serif"         },
  { label: "Tahoma",       value: "Tahoma, sans-serif"          },
];

const FONT_COLOR_PRESETS = [
  { label: "Ink Black",    value: "#111827" },
  { label: "Charcoal",     value: "#374151" },
  { label: "White",        value: "#ffffff" },
  { label: "Light Gray",   value: "#e5e7eb" },
  { label: "Ocean Blue",   value: "#1d4ed8" },
  { label: "Forest Green", value: "#15803d" },
  { label: "Burgundy",     value: "#9f1239" },
  { label: "Violet",       value: "#6d28d9" },
];

const TIMEZONES = [
  { value: "UTC",                 label: "UTC — Coordinated Universal Time" },
  { value: "America/New_York",    label: "America/New York (EST/EDT)" },
  { value: "America/Chicago",     label: "America/Chicago (CST/CDT)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST/PDT)" },
  { value: "Europe/London",       label: "Europe/London (GMT/BST)" },
  { value: "Europe/Paris",        label: "Europe/Paris (CET/CEST)" },
  { value: "Asia/Dubai",          label: "Asia/Dubai (GST +4)" },
  { value: "Asia/Kolkata",        label: "Asia/Kolkata (IST +5:30)" },
  { value: "Asia/Phnom_Penh",     label: "Asia/Phnom Penh (ICT +7)" },
  { value: "Asia/Bangkok",        label: "Asia/Bangkok (ICT +7)" },
  { value: "Asia/Singapore",      label: "Asia/Singapore (SGT +8)" },
  { value: "Asia/Tokyo",          label: "Asia/Tokyo (JST +9)" },
  { value: "Australia/Sydney",    label: "Australia/Sydney (AEDT +11)" },
];

const FONT_TARGETS: { key: FontTarget; label: string; icon: string; desc: string }[] = [
  { key: "navbar",   label: "Navbar",   icon: "🔝", desc: "Top navigation bar"  },
  { key: "sidebar",  label: "Sidebar",  icon: "◀️", desc: "Side menu items"     },
  { key: "content",  label: "Content",  icon: "📄", desc: "Main page body"      },
  { key: "footer",   label: "Footer",   icon: "🔻", desc: "Bottom footer bar"   },
];

const STORAGE_KEY = "app_user_settings";

const DEFAULT_FONT: FontSetting = { fontFamily: "'Segoe UI', sans-serif", fontColor: "#111827" };

export const DEFAULT_SETTINGS: SettingsState = {
  theme:              "light",
  timezone:           "Asia/Phnom_Penh",
  sidebarColor:       "#2e3492",
  accentColor:        "#6c63ff",
  customSidebarColor: "#2e3492",
  fontTarget:         "content",
  fontSettings: {
    navbar:   { fontFamily: "'Segoe UI', sans-serif", fontColor: "#111827" },
    sidebar:  { fontFamily: "'Segoe UI', sans-serif", fontColor: "#ffffff" },
    content:  { ...DEFAULT_FONT },
    footer:   { fontFamily: "'Segoe UI', sans-serif", fontColor: "#6b7280" },
  },
};

// ── CSS selector map — single source of truth for all DOM targeting 
// ⚠️  If your layout uses different class names, only change them HERE.
const SECTION_SELECTORS: Record<FontTarget, {
  // All selectors that should receive font-family
  font:  string[];
  // All selectors that should receive color
  color: string[];
}> = {
  navbar: {
    font: [
      ".ant-layout-header",
      ".ant-layout-header span:not(.anticon)",
      ".ant-layout-header p",
      ".ant-layout-header h1,.ant-layout-header h2,.ant-layout-header h3,.ant-layout-header h4,.ant-layout-header h5",
    ],
    color: [
      ".ant-layout-header",
      ".ant-layout-header span:not(.anticon)",
      ".ant-layout-header p",
      ".ant-layout-header a",
    ],
  },
  sidebar: {
    font: [
      ".ant-layout-sider .ant-menu-item",
      ".ant-layout-sider .ant-menu-submenu-title",
      ".ant-layout-sider .ant-menu-item span:not(.anticon)",
      ".ant-layout-sider .ant-menu-submenu-title span:not(.anticon)",
      ".ant-layout-sider .ant-menu-item-icon + span",
      ".ant-layout-sider .ant-menu-submenu-title .ant-menu-item-icon + span",
    ],
    color: [
      ".ant-layout-sider .ant-menu-item",
      ".ant-layout-sider .ant-menu-submenu-title",
      ".ant-layout-sider .ant-menu-item span:not(.anticon)",
      ".ant-layout-sider .ant-menu-submenu-title span:not(.anticon)",
      ".ant-layout-sider .ant-menu-item-icon + span",
      ".ant-layout-sider .ant-menu-submenu-title .ant-menu-item-icon + span",
    ],
  },
  content: {
    font: [
      ".ant-layout-content",
      ".ant-layout-content .ant-typography",
      ".ant-layout-content p",
      ".ant-layout-content span:not(.anticon)",
      ".ant-layout-content h1,.ant-layout-content h2,.ant-layout-content h3",
      ".ant-layout-content h4,.ant-layout-content h5,.ant-layout-content h6",
      ".ant-table-wrapper .ant-table-thead > tr > th",
      ".ant-table-wrapper .ant-table-tbody > tr > td",
    ],
    color: [
      ".ant-layout-content .ant-typography:not(.ant-typography-secondary)",
      ".ant-layout-content p",
      ".ant-layout-content span:not(.anticon)",
      ".ant-table-wrapper .ant-table-tbody > tr > td",
    ],
  },
  footer: {
    font: [
      ".ant-layout-footer",
      ".ant-layout-footer span:not(.anticon)",
      ".ant-layout-footer p",
      ".ant-layout-footer div",
      ".ant-layout-footer a",
      ".ant-layout-footer h1,.ant-layout-footer h2,.ant-layout-footer h3",
      ".ant-layout-footer h4,.ant-layout-footer h5,.ant-layout-footer h6",
    ],
    color: [
      ".ant-layout-footer",
      ".ant-layout-footer span:not(.anticon)",
      ".ant-layout-footer p",
      ".ant-layout-footer div",
      ".ant-layout-footer a",
    ],
  },
};

// ── Exported apply helpers 

export function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && prefersDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

  const styleId = "theme-override";
  let el = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!el) { el = document.createElement("style"); el.id = styleId; document.head.appendChild(el); }

  if (isDark) {
    el.textContent = `
      /* ── Navbar ── */
      .ant-layout-header {
        background: #1f1f1f !important;
        border-bottom: 1px solid #303030 !important;
      }
      .ant-layout-header .ant-input-affix-wrapper,
      .ant-layout-header input {
        background: #2a2a2a !important; border-color: #424242 !important; color: #d4d4d4 !important;
      }
      .ant-layout-header input::placeholder { color: #6b7280 !important; }

      /* ── Footer ── */
      .ant-layout-footer {
        background: #1f1f1f !important;
        border-top: 1px solid #303030 !important;
        color: #9ca3af !important;
      }
      .ant-layout-footer a { color: #9ca3af !important; }

      /* ── Content ── */
      .ant-layout-content { background: #141414 !important; }
      .ant-layout > .ant-layout { background: #141414 !important; }
      .ant-layout-content .ant-card { background: #1f1f1f !important; border-color: #303030 !important; }

      /* ── Tables ── */
      .ant-table-wrapper .ant-table { background: #1f1f1f !important; }
      .ant-table-wrapper .ant-table-thead > tr > th {
        background: #262626 !important; color: #d4d4d4 !important; border-bottom-color: #303030 !important;
      }
      .ant-table-wrapper .ant-table-tbody > tr > td {
        background: #1f1f1f !important; color: #d4d4d4 !important; border-bottom-color: #303030 !important;
      }
      .ant-table-wrapper .ant-table-tbody > tr:hover > td { background: #2a2a2a !important; }
      .ant-table-wrapper .ant-table-container { border-color: #303030 !important; }

      /* ── Modals ── */
      .ant-modal-content { background: #1f1f1f !important; }
      .ant-modal-header  { background: #1f1f1f !important; border-bottom-color: #303030 !important; }
      .ant-modal-title   { color: #e8eaf0 !important; }
      .ant-modal-close-x { color: #9ca3af !important; }

      /* ── Inputs / Selects ── */
      .ant-input, .ant-input-affix-wrapper, .ant-select-selector, .ant-picker {
        background: #262626 !important; border-color: #424242 !important; color: #d4d4d4 !important;
      }
      .ant-select-dropdown { background: #262626 !important; }
      .ant-select-item { color: #d4d4d4 !important; }
      .ant-select-item-option-active, .ant-select-item-option-selected { background: #363636 !important; }
      .ant-input::placeholder { color: #6b7280 !important; }

      /* ── Pagination ── */
      .ant-pagination-item,
      .ant-pagination-prev .ant-pagination-item-link,
      .ant-pagination-next .ant-pagination-item-link {
        background: #262626 !important; border-color: #424242 !important; color: #d4d4d4 !important;
      }
      .ant-pagination-item a { color: #d4d4d4 !important; }
      .ant-pagination-item-active { border-color: #6c63ff !important; }
      .ant-pagination-item-active a { color: #6c63ff !important; }

      /* ── Stats / Buttons / Tags ── */
      .ant-statistic-title { color: #9ca3af !important; }
      .ant-statistic-content { color: #e8eaf0 !important; }
      .ant-btn-default { background: #262626 !important; border-color: #424242 !important; color: #d4d4d4 !important; }
      .ant-tag { filter: brightness(0.85); }

      /* ── Settings page itself ── */
      .settings-wrapper { background: #141414 !important; }
      .settings-card    { background: #1f1f1f !important; border-color: #303030 !important; box-shadow: 0 1px 4px rgba(0,0,0,0.4) !important; }
      .settings-card .ant-typography { color: #e8eaf0 !important; }
      .settings-card h5.ant-typography { color: #e8eaf0 !important; }
      .theme-btn-inactive  { background: #262626 !important; border-color: #424242 !important; }
      .font-btn-inactive   { background: #262626 !important; border-color: #424242 !important; color: #d4d4d4 !important; }
      .target-btn-inactive { background: #262626 !important; border-color: #424242 !important; color: #d4d4d4 !important; }
      .preview-box { background: #262626 !important; border-color: #424242 !important; }
      .clock-box   { background: #262626 !important; border-color: #424242 !important; }
      .summary-box { background: #262626 !important; border-color: #424242 !important; }
      .summary-item { background: #1f1f1f !important; border-color: #424242 !important; }
    `;
  } else {
    el.textContent = `
      .ant-layout-header  { background: #ffffff !important; border-bottom: 1px solid #f0f0f0 !important; }
      .ant-layout-footer  { background: #f9fafb !important; border-top: 1px solid #e5e7eb !important; }
      .ant-layout-content { background: #f0f4f8 !important; }
      .settings-wrapper   { background: #f0f4f8 !important; }
      .settings-card      { background: #fff !important; border-color: #f0f0f0 !important; }
      .theme-btn-inactive  { background: #fafafa !important; border-color: #e5e7eb !important; }
      .font-btn-inactive   { background: #fafafa !important; border-color: #e5e7eb !important; color: #374151 !important; }
      .target-btn-inactive { background: #fafafa !important; border-color: #e5e7eb !important; color: #374151 !important; }
      .preview-box { background: #fafafa !important; border-color: #e5e7eb !important; }
      .clock-box   { background: #f8fafc !important; border-color: #e5e7eb !important; }
      .summary-box { background: #f8fafc !important; border-color: #e5e7eb !important; }
      .summary-item { background: #fff !important; border-color: #e5e7eb !important; }
    `;
  }
}

/**
 * Apply font settings — driven entirely by SECTION_SELECTORS.
 * Call this both for live preview AND on Save.
 */
export function applyAllFonts(fontSettings: SettingsState["fontSettings"]) {
  const styleId = "font-override";
  let el = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!el) { el = document.createElement("style"); el.id = styleId; document.head.appendChild(el); }

  const rules: string[] = [];

  (Object.keys(SECTION_SELECTORS) as FontTarget[]).forEach((target) => {
    const selectors = SECTION_SELECTORS[target];
    const { fontFamily, fontColor } = fontSettings[target];

    // font-family rule — uses selectors.font[]
    rules.push(`${selectors.font.join(", ")} { font-family: ${fontFamily} !important; }`);

    // color rule — uses selectors.color[]
    rules.push(`${selectors.color.join(", ")} { color: ${fontColor} !important; }`);
  });

  el.textContent = rules.join("\n");
}

export function applySidebarColor(sidebarColor: string) {
  const styleId = "sidebar-color-override";
  let el = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!el) { el = document.createElement("style"); el.id = styleId; document.head.appendChild(el); }
  el.textContent = `
    .ant-layout-sider { background: ${sidebarColor} !important; }
    .ant-menu-dark.ant-menu-submenu-popup { background: ${sidebarColor} !important; }
  `;
}

export function clearAllOverrides() {
  ["theme-override", "font-override", "sidebar-color-override"].forEach((id) => {
    document.getElementById(id)?.remove();
  });
  document.documentElement.removeAttribute("data-theme");
}

// ── Shared card style 
const labelStyle: React.CSSProperties = {
  fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 6, fontWeight: 500,
};

// ── Sub-components 

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div style={{ marginBottom: 20 }}>
    <Title level={5} style={{ margin: 0, fontWeight: 700 }}>{title}</Title>
    {subtitle && <Text style={{ color: "#9ca3af", fontSize: 12 }}>{subtitle}</Text>}
  </div>
);

const ThemeCard: React.FC<{
  value: Theme; label: string; active: boolean; onClick: () => void;
}> = ({ value, label, active, onClick }) => {
  const previews: Record<Theme, React.ReactNode> = {
    light: (
      <div style={{ height: 68, background: "#f5f6fa", display: "flex", overflow: "hidden" }}>
        <div style={{ width: 26, background: "#e2e5ef", padding: "8px 4px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ height: 4, background: "#b0b8cc", borderRadius: 2 }} />
          {[80,65,70].map((w,i) => <div key={i} style={{ height: 3, background: "#c8cfe0", borderRadius: 2, width: `${w}%` }} />)}
        </div>
        <div style={{ flex: 1, padding: "8px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ height: 5, background: "#d1d5db", borderRadius: 3, width: "60%" }} />
          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 3, width: "45%" }} />
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            <div style={{ flex: 1, height: 18, background: "#fff", borderRadius: 4, border: "1px solid #e5e7eb" }} />
            <div style={{ flex: 1, height: 18, background: "#fff", borderRadius: 4, border: "1px solid #e5e7eb" }} />
          </div>
        </div>
      </div>
    ),
    dark: (
      <div style={{ height: 68, background: "#141414", display: "flex", overflow: "hidden" }}>
        <div style={{ width: 26, background: "#1f1f1f", padding: "8px 4px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ height: 4, background: "#6c63ff", borderRadius: 2 }} />
          {[80,65,70].map((w,i) => <div key={i} style={{ height: 3, background: "#2a2a2a", borderRadius: 2, width: `${w}%` }} />)}
        </div>
        <div style={{ flex: 1, padding: "8px", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ height: 5, background: "#3a3a3a", borderRadius: 3, width: "60%" }} />
          <div style={{ height: 4, background: "#2a2a2a", borderRadius: 3, width: "45%" }} />
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            <div style={{ flex: 1, height: 18, background: "#1f1f1f", borderRadius: 4, border: "1px solid #303030" }} />
            <div style={{ flex: 1, height: 18, background: "#1f1f1f", borderRadius: 4, border: "1px solid #303030" }} />
          </div>
        </div>
      </div>
    ),
    system: (
      <div style={{ height: 68, display: "flex", overflow: "hidden", position: "relative" }}>
        <div style={{ flex: 1, background: "#f5f6fa" }}>
          <div style={{ width: 13, height: "100%", background: "#e2e5ef", float: "left" }} />
        </div>
        <div style={{ width: 1, background: "#ccc" }} />
        <div style={{ flex: 1, background: "#141414" }}>
          <div style={{ width: 13, height: "100%", background: "#1f1f1f", float: "right" }} />
        </div>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          fontSize: 18, background: "rgba(255,255,255,0.9)", borderRadius: "50%",
          width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }}>💻</div>
      </div>
    ),
  };
  return (
    <button onClick={onClick} className={active ? "" : "theme-btn-inactive"} style={{
      flex: 1, border: `2px solid ${active ? "#2e3492" : "#e5e7eb"}`,
      borderRadius: 12, background: active ? "#f0f1ff" : "#fafafa",
      cursor: "pointer", transition: "all 0.18s", fontFamily: "inherit", outline: "none", padding: 0, overflow: "hidden",
    }}>
      <div style={{ borderBottom: `1px solid ${active ? "#c7c9e8" : "#e5e7eb"}` }}>{previews[value]}</div>
      <div style={{ padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#2e3492" : "#6b7280" }}>{label}</Text>
        {active && <CheckOutlined style={{ fontSize: 11, color: "#2e3492" }} />}
      </div>
    </button>
  );
};

const ColorSwatch: React.FC<{
  color: string; label: string; accent?: string; active: boolean; onClick: () => void;
}> = ({ color, label, accent, active, onClick }) => (
  <Tooltip title={label}>
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: 10, background: color,
      border: "2px solid transparent", cursor: "pointer", position: "relative",
      outline: active ? `3px solid ${accent ?? color}` : "none", outlineOffset: 2,
      boxShadow: active ? `0 0 0 2px #fff, 0 0 0 5px ${accent ?? color}` : "0 1px 3px rgba(0,0,0,0.2)",
      transition: "all 0.15s", flexShrink: 0,
    }}>
      {accent && <span style={{ position: "absolute", bottom: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: accent, border: "1.5px solid rgba(255,255,255,0.7)" }} />}
      {active && <CheckOutlined style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#fff", fontSize: 12, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }} />}
    </button>
  </Tooltip>
);

const SidebarPreview: React.FC<{ bg: string; accent: string }> = ({ bg, accent }) => (
  <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb", height: 90, width: 160, flexShrink: 0 }}>
    <div style={{ width: 44, background: bg, display: "flex", flexDirection: "column", padding: "8px 6px", gap: 5 }}>
      <div style={{ height: 8, borderRadius: 3, background: accent, marginBottom: 4 }} />
      {[1,0.5,0.5,0.5].map((op,i) => <div key={i} style={{ height: 5, borderRadius: 2, background: `rgba(255,255,255,${op})`, width: i===0?"80%":"65%" }} />)}
    </div>
    <div style={{ flex: 1, background: "#f9fafb", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ height: 6, width: "70%", background: "#e5e7eb", borderRadius: 3 }} />
      <div style={{ height: 5, width: "50%", background: "#e5e7eb", borderRadius: 3 }} />
      <div style={{ height: 18, background: "#fff", borderRadius: 4, border: "1px solid #e5e7eb", marginTop: 4 }} />
      <div style={{ height: 18, background: "#fff", borderRadius: 4, border: "1px solid #e5e7eb" }} />
    </div>
  </div>
);

const CustomColorInput: React.FC<{
  value: string; label: string; onChange: (hex: string) => void;
}> = ({ value, label, onChange }) => {
  const nativeRef = useRef<HTMLInputElement>(null);
  const [hex, setHex] = useState(value);
  useEffect(() => { setHex(value); }, [value]);
  const isValid = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
      <div onClick={() => nativeRef.current?.click()} title="Click to open color picker"
        style={{ width: 40, height: 40, borderRadius: 10, background: isValid(hex) ? hex : "#ccc", cursor: "pointer", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <input ref={nativeRef} type="color" value={isValid(hex) ? hex : "#000000"}
          onChange={(e) => { setHex(e.target.value); onChange(e.target.value); }}
          style={{ opacity: 0, position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "pointer" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fafafa" }}>
        <span style={{ padding: "0 10px", color: "#9ca3af", fontSize: 13, borderRight: "1px solid #e5e7eb", height: 36, display: "flex", alignItems: "center" }}>#</span>
        <input type="text" value={hex.replace("#", "")} maxLength={6} placeholder="111827"
          onChange={(e) => { const v = `#${e.target.value}`; setHex(v); if (isValid(v)) onChange(v); }}
          style={{ border: "none", outline: "none", background: "transparent", padding: "0 10px", fontSize: 13, width: 90, height: 36, fontFamily: "'Courier New', monospace", color: "#374151" }} />
      </div>
      <Text style={{ fontSize: 12, color: "#9ca3af" }}>{label}</Text>
    </div>
  );
};

// ── Main Component 
const UserSettings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...p, fontSettings: { ...DEFAULT_SETTINGS.fontSettings, ...(p.fontSettings ?? {}) } };
      }
    } catch { /* ignore */ }
    return DEFAULT_SETTINGS;
  });

  const [saved, setSaved]         = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const isFirstRender = useRef(true);

  // ─ Theme & sidebar: live on change, skip mount 
  useEffect(() => { if (isFirstRender.current) return; applyTheme(settings.theme); },        [settings.theme]);
  useEffect(() => { if (isFirstRender.current) return; applySidebarColor(settings.sidebarColor); }, [settings.sidebarColor]);

  // ─ Font: LIVE preview on every fontSettings change (skip mount) 
  // This makes the actual page update instantly as user picks font/color.
  // On Save it also persists to localStorage.
  useEffect(() => {
    if (isFirstRender.current) return;
    applyAllFonts(settings.fontSettings);
  }, [settings.fontSettings]);

  useEffect(() => { isFirstRender.current = false; }, []);

  // System theme OS listener
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  const update = useCallback(
    <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
      setSettings((prev) => ({ ...prev, [key]: value })),
    []
  );

  // - updateFont: updates ONLY the specific field for the specific target 
  // fontFamily and fontColor are stored independently per target —
  // changing color NEVER resets fontFamily, and vice versa.
  const updateFont = useCallback((target: FontTarget, field: keyof FontSetting, value: string) => {
    setSettings((prev) => ({
      ...prev,
      fontSettings: {
        ...prev.fontSettings,
        [target]: {
          ...prev.fontSettings[target], // keep the other field untouched
          [field]: value,               // only update the one being changed
        },
      },
    }));
  }, []);

  const handleSave = () => {
    // Font is already live via useEffect; Save just persists to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    messageApi.success("Settings saved!");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    Modal.confirm({
      title: "Reset to Default",
      icon: <ExclamationCircleOutlined />,
      content: "This will restore all settings to their original defaults.",
      okText: "Reset", okButtonProps: { danger: true }, cancelText: "Cancel",
      onOk: () => {
        localStorage.removeItem(STORAGE_KEY);
        clearAllOverrides();
        setSettings(DEFAULT_SETTINGS);
        messageApi.success("Settings reset to default!");
      },
    });
  };

  const selectedSidebar  = SIDEBAR_PRESETS.find((p) => p.bg === settings.sidebarColor);
  const sidebarAccent    = selectedSidebar?.accent ?? "#1890ff";
  const activeTarget     = settings.fontTarget;
  // Read directly from fontSettings[activeTarget] — NEVER derived from something that could reset
  const activeFontFamily = settings.fontSettings[activeTarget].fontFamily;
  const activeFontColor  = settings.fontSettings[activeTarget].fontColor;

  const currentTime = new Intl.DateTimeFormat("en-US", {
    timeZone: settings.timezone, hour: "2-digit", minute: "2-digit",
    second: "2-digit", hour12: false, weekday: "short", month: "short", day: "numeric",
  }).format(new Date());

  const cardStyle: React.CSSProperties = {
    background: "#fff", borderRadius: 12, padding: "20px 24px",
    marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
  };

  return (
    <>
      {contextHolder}
      <style>{`
        .settings-wrapper { background: #f0f4f8; min-height: 100vh; padding: 32px 24px; font-family: 'Segoe UI', sans-serif; }
        .theme-row   { display: flex; gap: 10px; }
        .swatch-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .color-row   { display: flex; align-items: flex-start; gap: 28px; flex-wrap: wrap; margin-top: 4px; }
        .action-row  { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
        .target-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
      `}</style>

      <div className="settings-wrapper">
        <Title level={4} style={{ marginBottom: 20, fontWeight: 700 }}>Settings</Title>

        {/* ── Appearance  */}
        <div style={cardStyle} className="settings-card">
          <SectionHeader title="Appearance" subtitle="Customize how the interface looks and feels" />
          <div style={{ marginBottom: 24 }}>
            <Text style={labelStyle}>Theme</Text>
            <div className="theme-row">
              {(["light", "dark", "system"] as Theme[]).map((t) => (
                <ThemeCard key={t} value={t}
                  label={t.charAt(0).toUpperCase() + t.slice(1)}
                  active={settings.theme === t}
                  onClick={() => update("theme", t)}
                />
              ))}
            </div>
            {settings.theme === "system" && (
              <Text style={{ fontSize: 11, color: "#9ca3af", marginTop: 8, display: "block" }}>
                ℹ️ Follows your OS dark/light preference automatically
              </Text>
            )}
          </div>

          <div>
            <Text style={labelStyle}>Sidebar Color</Text>
            <div className="color-row">
              <div>
                <div className="swatch-grid">
                  {SIDEBAR_PRESETS.map((p) => (
                    <ColorSwatch key={p.bg} color={p.bg} label={p.label} accent={p.accent}
                      active={settings.sidebarColor === p.bg}
                      onClick={() => { update("sidebarColor", p.bg); update("accentColor", p.accent); update("customSidebarColor", p.bg); }}
                    />
                  ))}
                </div>
                <CustomColorInput value={settings.customSidebarColor} label="Custom color"
                  onChange={(hex) => { update("customSidebarColor", hex); update("sidebarColor", hex); update("accentColor", hex); }}
                />
                <Text style={{ ...labelStyle, marginTop: 8 }}>
                  Selected: <strong style={{ color: "#374151" }}>{selectedSidebar?.label ?? "Custom"}</strong>
                </Text>
              </div>
              <div>
                <Text style={{ ...labelStyle, marginBottom: 6 }}>Preview</Text>
                <SidebarPreview bg={settings.sidebarColor} accent={sidebarAccent} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Font  */}
        <div style={cardStyle} className="settings-card">
          <SectionHeader
            title="Font"
            subtitle="Pick a section, change font & color — previews live on the page instantly"
          />

          {/* Section selector tabs */}
          <Text style={labelStyle}>Apply To</Text>
          <div className="target-tabs">
            {FONT_TARGETS.map(({ key, label, icon, desc }) => {
              const isActive = activeTarget === key;
              return (
                <button key={key} onClick={() => update("fontTarget", key)}
                  className={isActive ? "" : "target-btn-inactive"}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                    borderRadius: 10, cursor: "pointer",
                    border: `2px solid ${isActive ? "#2e3492" : "#e5e7eb"}`,
                    background: isActive ? "#f0f1ff" : "#fafafa",
                    fontFamily: "inherit", outline: "none", transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#2e3492" : "#374151" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{desc}</div>
                  </div>
                  {isActive && <CheckOutlined style={{ fontSize: 11, color: "#2e3492", marginLeft: 4 }} />}
                </button>
              );
            })}
          </div>

          {/* Font family */}
          <div style={{ marginBottom: 20 }}>
            <Text style={labelStyle}>
              Font Style —{" "}
              <span style={{ color: "#2e3492", fontWeight: 600 }}>
                {FONT_TARGETS.find((t) => t.key === activeTarget)?.label}
              </span>
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FONT_PRESETS.map((f) => {
                // Active check uses activeFontFamily directly — never affected by color changes
                const isActive = activeFontFamily === f.value;
                return (
                  <button key={f.value}
                    onClick={() => updateFont(activeTarget, "fontFamily", f.value)}
                    className={isActive ? "" : "font-btn-inactive"}
                    style={{
                      padding: "7px 16px", borderRadius: 8, cursor: "pointer",
                      border: `2px solid ${isActive ? "#2e3492" : "#e5e7eb"}`,
                      background: isActive ? "#f0f1ff" : undefined,
                      // Each button renders in its own font so user can see what it looks like
                      fontFamily: f.value,
                      fontSize: 13,
                      color: isActive ? "#2e3492" : undefined,
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.15s", outline: "none",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Isolated preview box — shows font + color combo before save */}
            <div className="preview-box" style={{
              padding: "12px 16px", border: "1px solid #e5e7eb",
              borderRadius: 8, marginTop: 12, background: "#fafafa",
            }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
                Live preview for{" "}
                <strong>{FONT_TARGETS.find((t) => t.key === activeTarget)?.label}</strong>
                {" "}— changes are applied on the page in real time
              </div>
              <span style={{
                fontSize: 15,
                fontFamily: activeFontFamily,  // isolated — no global injection
                color: activeFontColor,        // isolated — no global injection
                lineHeight: 1.7,
              }}>
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          </div>

          {/* Font color */}
          <div>
            <Text style={labelStyle}>
              Text Color —{" "}
              <span style={{ color: "#2e3492", fontWeight: 600 }}>
                {FONT_TARGETS.find((t) => t.key === activeTarget)?.label}
              </span>
            </Text>
            <div className="swatch-grid">
              {FONT_COLOR_PRESETS.map((c) => (
                <ColorSwatch key={c.value} color={c.value} label={c.label}
                  active={activeFontColor === c.value}
                  onClick={() => updateFont(activeTarget, "fontColor", c.value)}
                />
              ))}
            </div>
            <CustomColorInput
              value={activeFontColor}
              label={`Custom — ${FONT_TARGETS.find((t) => t.key === activeTarget)?.label}`}
              onChange={(hex) => updateFont(activeTarget, "fontColor", hex)}
            />
          </div>

          {/* All-sections summary */}
          <div className="summary-box" style={{ marginTop: 20, padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb" }}>
            <Text style={{ fontSize: 12, color: "#9ca3af", display: "block", marginBottom: 8, fontWeight: 500 }}>
              All sections at a glance — click to switch
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FONT_TARGETS.map(({ key, label, icon }) => {
                const fs         = settings.fontSettings[key];
                const fontShort  = fs.fontFamily.split(",")[0].replace(/'/g, "").trim();
                const isActive   = key === activeTarget;
                return (
                  <div key={key} className={`summary-item${isActive ? "" : ""}`}
                    onClick={() => update("fontTarget", key)}
                    style={{ padding: "6px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${isActive ? "#2e3492" : "#e5e7eb"}`, background: isActive ? "#f0f1ff" : "#fff" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{icon}</span>
                      <Text style={{ fontSize: 12, fontWeight: 600, color: isActive ? "#2e3492" : "#374151" }}>{label}</Text>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: fs.fontColor, border: "1px solid #e5e7eb", display: "inline-block", flexShrink: 0 }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, fontFamily: fs.fontFamily }}>{fontShort}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Timezone  */}
        <div style={cardStyle} className="settings-card">
          <SectionHeader title="Timezone" subtitle="Used for accurate timestamps in reports, logs, and alerts" />
          <div style={{ maxWidth: 420, marginBottom: 14 }}>
            <Text style={labelStyle}>Select Timezone</Text>
            <Select value={settings.timezone} onChange={(val) => update("timezone", val)}
              style={{ width: "100%" }} size="middle" showSearch optionFilterProp="label"
              options={TIMEZONES.map((tz) => ({ value: tz.value, label: tz.label }))}
            />
          </div>
          <div className="clock-box" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px" }}>
            <span style={{ fontSize: 18 }}>🕐</span>
            <div>
              <Text style={{ fontSize: 11, color: "#9ca3af", display: "block" }}>
                Current time · {settings.timezone.replace(/_/g, " ")}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: 600 }}>{currentTime}</Text>
            </div>
          </div>
        </div>

        {/* ─ Actions  */}
        <div className="action-row">
          <Button icon={<UndoOutlined />} onClick={handleReset}
            style={{ borderRadius: 8, fontWeight: 600, height: 38, paddingInline: 20, borderColor: "#d1d5db", color: "#6b7280" }}>
            Reset to Default
          </Button>
          <Button type="primary" icon={saved ? <CheckOutlined /> : <SaveOutlined />} onClick={handleSave}
            style={{
              background: saved ? "#52c41a" : "#2e3492", borderColor: saved ? "#52c41a" : "#2e3492",
              borderRadius: 8, fontWeight: 600, height: 38, paddingInline: 24,
              transition: "background 0.25s, border-color 0.25s",
            }}>
            {saved ? "Saved!" : "Save Settings"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserSettings;