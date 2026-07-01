import { useEffect, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  CircleDot,
  Copy,
  FileCode,
  GitBranch,
  Grid2X2,
  LayoutDashboard,
  PanelsTopLeft,
  Play,
  Route,
  Search,
  Settings,
  Square,
} from "lucide-react";

const trailwisePrototypeStyles = String.raw`:root {
  color-scheme: light;
  --page: #eef2f7;
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --surface-muted: #f1f5f9;
  --ink: #07111f;
  --ink-soft: #31435c;
  --muted: #708198;
  --muted-light: #9aa8ba;
  --line: #d8e1ed;
  --line-soft: #e8edf4;
  --navy: #061225;
  --navy-2: #07182f;
  --blue: #2f75ff;
  --blue-soft: #eaf2ff;
  --red: #ff3b30;
  --green: #12a66a;
  --green-soft: #e9f9f1;
  --amber: #b46b00;
  --amber-soft: #fff4d8;
  --shadow: 0 28px 80px rgba(7, 17, 31, 0.12);
  --shadow-soft: 0 14px 36px rgba(7, 17, 31, 0.08);
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  min-height: 100%;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--surface);
  color: var(--ink);
  font-family:
    Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

button,
input {
  font: inherit;
}

button {
  cursor: default;
}

a {
  color: inherit;
  text-decoration: none;
}

svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.75;
  flex: 0 0 auto;
}

.screen-shell {
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--surface);
}

.console-screen {
  position: relative;
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  grid-template-columns: 80px minmax(248px, 280px) minmax(0, 1fr);
  grid-template-rows: 56px minmax(calc(100vh - 56px), auto);
  grid-template-areas:
    "rail topbar topbar"
    "rail sidebar workspace";
  margin: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: var(--surface);
  box-shadow: none;
}

.mission-rail {
  position: sticky;
  top: 0;
  grid-area: rail;
  align-self: start;
  width: 80px;
  height: 100vh;
  color: #d7e4f5;
  background:
    radial-gradient(circle at 42px 146px, rgba(117, 161, 255, 0.26), transparent 92px),
    linear-gradient(180deg, #071629, #071326 62%, #08203b);
}

.mission-rail::before,
.mission-rail::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.mission-rail::before {
  left: -62px;
  top: 650px;
  width: 222px;
  height: 222px;
  border: 1px solid rgba(170, 199, 236, 0.28);
  border-radius: 999px;
}

.mission-rail::after {
  left: 13px;
  top: 31px;
  width: 54px;
  height: 1px;
  background: rgba(170, 199, 236, 0.22);
}

.account-avatar {
  position: absolute;
  left: 24px;
  top: 16px;
  z-index: 2;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid rgba(190, 210, 236, 0.44);
  border-radius: 999px;
  background: #071225;
  color: #ffffff;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0;
}

.rail-rule {
  position: absolute;
  left: 16px;
  top: 72px;
  width: 48px;
  height: 1px;
  background: rgba(176, 198, 225, 0.18);
}

.orbit {
  position: absolute;
  left: 16px;
  top: 94px;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(196, 215, 239, 0.38);
  border-radius: 999px;
}

.orbit::after {
  content: "";
  position: absolute;
  right: 8px;
  top: 15px;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #d8e7f7;
}

.rail-item {
  position: absolute;
  left: 18px;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 0;
  border-radius: 9px;
  color: #d7e4f5;
  background: transparent;
}

.rail-item.active {
  top: 168px;
  background: rgba(66, 126, 211, 0.32);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(176, 205, 244, 0.18);
}

.rail-item.item-2 {
  top: 224px;
}

.rail-item.item-3 {
  top: 280px;
}

.rail-item.item-4 {
  top: 336px;
}

.rail-item.settings {
  top: 392px;
}

.rail-brand {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 24px;
  display: grid;
  justify-items: center;
  gap: 8px;
}

.rail-brand strong {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 999px;
  background: #020b18;
  color: #ffffff;
  font-size: 12px;
}

.rail-brand span,
.rail-brand small {
  color: #dbe7f6;
  font-size: 11px;
  line-height: 1.2;
}

.rail-brand small {
  color: #91a4ba;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  grid-area: topbar;
  display: grid;
  grid-template-columns: minmax(168px, 232px) minmax(280px, 520px) minmax(0, 1fr) auto auto auto;
  width: 100%;
  height: 56px;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.96);
  padding: 0 24px;
}

.brand-logo {
  display: block;
  width: 168px;
  height: 34px;
  object-fit: contain;
  object-position: left center;
}

.search-box {
  display: flex;
  width: 100%;
  height: 38px;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  padding: 0 14px;
  color: var(--muted);
  font-size: 13px;
}

.search-box svg {
  color: #69809d;
}

.search-box span {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

kbd {
  border: 0;
  background: transparent;
  color: #9aa8ba;
  font-size: 11px;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  justify-content: center;
  margin-left: 0;
  color: #16233a;
  font-size: 13px;
  font-weight: 650;
}

.pill {
  display: inline-flex;
  min-width: 64px;
  min-height: 24px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: var(--surface-muted);
  color: #596b82;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
}

.pill.green {
  background: var(--green-soft);
  color: #0d874f;
}

.pill.amber {
  border-color: #f5d99c;
  background: var(--amber-soft);
  color: var(--amber);
}

.pill.red {
  border-color: #ffd0cc;
  background: #fff0ef;
  color: var(--red);
}

.btn {
  display: inline-flex;
  height: 36px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 750;
  line-height: 1;
  white-space: nowrap;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 1.75;
}

.btn.light {
  background: #ffffff;
  color: #0a1629;
}

.btn.dark {
  border-color: #102846;
  background:
    linear-gradient(180deg, rgba(45, 75, 117, 0.42), transparent 42%),
    var(--navy);
  color: #ffffff;
  box-shadow:
    inset 0 0 0 1px rgba(170, 199, 236, 0.08),
    0 12px 24px rgba(6, 18, 37, 0.18);
}

.btn:hover {
  border-color: #b9c9df;
}

.btn:active {
  transform: translateY(1px);
}

.btn.dark:hover {
  box-shadow:
    inset 0 0 0 1px rgba(170, 199, 236, 0.12),
    0 16px 28px rgba(6, 18, 37, 0.22);
}

.btn:disabled {
  cursor: default;
  opacity: 0.48;
  box-shadow: none;
  transform: none;
}

.btn.loading {
  position: relative;
}

.btn.loading::after {
  content: "";
  width: 12px;
  height: 12px;
  border: 2px solid rgba(88, 107, 132, 0.24);
  border-top-color: currentColor;
  border-radius: 999px;
  animation: spin 720ms linear infinite;
}

.btn.block {
  width: 100%;
}

.context-sidebar {
  position: sticky;
  top: 56px;
  grid-area: sidebar;
  align-self: start;
  width: 100%;
  min-width: 0;
  height: calc(100% - 56px);
  min-height: calc(100vh - 56px);
  max-height: calc(100vh - 56px);
  overflow: auto;
  border-right: 1px solid var(--line);
  background: #fbfcfe;
  padding: 32px 18px 28px;
}

.workspace-title {
  color: #15223a;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0;
}

.workspace-meta {
  margin-top: 6px;
  color: #6a7d94;
  font-size: 12px;
  line-height: 18px;
}

.context-sidebar > .btn {
  margin-top: 20px;
  height: 44px;
}

.section-label {
  margin: 36px 0 14px;
  color: #8998ab;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.recordings-title {
  margin-top: 38px;
}

.project-row,
.recording-row {
  position: relative;
  display: grid;
  min-height: 64px;
  align-content: center;
  gap: 4px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: #ffffff;
  padding: 12px 52px 12px 16px;
  color: var(--ink);
}

.project-row + .project-row,
.recording-row + .recording-row {
  margin-top: 12px;
}

.project-row.active,
.recording-row.active {
  border-color: #b8d2ff;
  background: var(--blue-soft);
  box-shadow: inset 3px 0 0 rgba(47, 117, 255, 0.82);
}

.project-row strong,
.recording-row strong {
  overflow: hidden;
  color: #16233a;
  font-size: 12px;
  font-weight: 760;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-row span,
.recording-row span {
  overflow: hidden;
  color: #6f8096;
  font-size: 11px;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-row em,
.recording-row em {
  position: absolute;
  right: 10px;
  top: 50%;
  display: inline-flex;
  min-width: 32px;
  height: 24px;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: #f8fafc;
  color: #607289;
  font-size: 11px;
  font-style: normal;
  font-weight: 720;
}

.project-row em.green {
  background: var(--green-soft);
  color: #0d874f;
}

.project-row {
  grid-template-columns: 20px minmax(0, 1fr) 40px;
  grid-template-areas:
    "icon title badge"
    ". meta badge";
  column-gap: 10px;
  row-gap: 5px;
  padding: 13px 12px;
}

.project-icon {
  grid-area: icon;
  align-self: start;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  color: #718196;
  stroke-width: 1.75;
}

.project-row strong {
  grid-area: title;
}

.project-row span {
  grid-area: meta;
}

.project-row em {
  grid-area: badge;
  position: static;
  align-self: center;
  justify-self: end;
  min-width: 36px;
  transform: none;
}

.recording-row {
  grid-template-columns: 20px minmax(0, 1fr) 64px;
  grid-template-areas:
    "icon title badge"
    ". path badge";
  column-gap: 10px;
  row-gap: 6px;
  min-height: 82px;
  padding: 14px;
  width: 100%;
  border-style: solid;
  font: inherit;
  text-align: left;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.recording-row:hover {
  border-color: #c9d8eb;
  background: #fbfdff;
}

.recording-row .status-icon {
  grid-area: icon;
  align-self: start;
  width: 18px;
  height: 18px;
  margin: 0;
  stroke-width: 1.75;
}

.recording-row strong {
  grid-area: title;
}

.recording-row span {
  grid-area: path;
}

.recording-row em {
  grid-area: badge;
  position: static;
  align-self: center;
  justify-self: end;
  min-width: 60px;
  transform: none;
}

.status-icon.red {
  color: var(--red);
}

.status-icon.green {
  color: var(--green);
}

.status-icon.amber {
  color: var(--amber);
}

.recording-row em.amber {
  border-color: #f5d99c;
  background: var(--amber-soft);
  color: var(--amber);
}

.recording-row em.green {
  background: var(--green-soft);
  color: #0d874f;
}

.recording-row em.red {
  border-color: #ffd0cc;
  background: #fff0ef;
  color: var(--red);
}

.recording-pulse {
  animation: recordingPulse 1.5s ease-in-out infinite;
}

.sidebar-divider {
  height: 1px;
  margin: 28px 0;
  background: var(--line-soft);
}

.helper-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  padding: 18px;
}

.helper-card div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.helper-card strong {
  color: #15223a;
  font-size: 12px;
  font-weight: 780;
}

.helper-card p {
  margin: 14px 0 14px;
  color: #4c5d73;
  font-size: 12px;
  line-height: 18px;
}

.progress {
  display: block;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #e7ebf1;
}

.progress i {
  display: block;
  width: 82%;
  height: 100%;
  border-radius: inherit;
  background: var(--green);
}

.workspace {
  position: relative;
  grid-area: workspace;
  width: 100%;
  min-width: 0;
  min-height: calc(100% - 56px);
  overflow: hidden;
  padding: 40px clamp(32px, 3vw, 56px) 56px;
  background: #ffffff;
}

.header-surface,
.header-grid {
  position: absolute;
  pointer-events: none;
}

.header-surface {
  left: 0;
  top: 0;
  width: 100%;
  height: 216px;
  background:
    radial-gradient(circle at 930px 130px, rgba(45, 117, 255, 0.08), transparent 250px),
    linear-gradient(180deg, rgba(248, 250, 252, 0.95), rgba(255, 255, 255, 0.92));
}

.header-grid {
  right: -48px;
  top: 0;
  width: 560px;
  height: 180px;
  opacity: 0.42;
  background:
    linear-gradient(rgba(216, 225, 237, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(216, 225, 237, 0.7) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(circle at 50% 50%, black 0, transparent 76%);
}

.breadcrumb,
.title-icon,
.title-row,
.header-actions,
.tabs,
.content-grid {
  position: relative;
  z-index: 1;
}

.breadcrumb {
  margin: 4px 0 24px;
  color: #73859c;
  font-size: 12px;
  line-height: 16px;
}

.title-icon {
  position: absolute;
  left: 40px;
  top: 84px;
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  color: var(--navy);
}

.title-row {
  display: flex;
  min-height: 56px;
  align-items: center;
  gap: 12px;
  padding-left: 56px;
  padding-right: 400px;
}

.title-row h1 {
  margin: 0 28px 0 0;
  color: var(--ink);
  font-size: 31px;
  font-weight: 820;
  letter-spacing: 0;
  line-height: 40px;
}

.header-actions {
  position: absolute;
  right: 48px;
  top: 82px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-actions .btn {
  height: 40px;
}

.tabs {
  display: flex;
  height: 52px;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  border-bottom: 1px solid rgba(216, 225, 237, 0.72);
}

.tabs button {
  display: inline-flex;
  min-width: 118px;
  height: 32px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #586b84;
  font-size: 13px;
  font-weight: 720;
}

.tabs button svg {
  width: 18px;
  height: 18px;
  color: #6f8096;
  stroke-width: 1.75;
}

.tabs button span {
  line-height: 16px;
}

.tabs button.active {
  background: var(--navy);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(6, 18, 37, 0.16);
}

.tabs button.active svg {
  color: #ffffff;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(400px, 464px);
  align-items: start;
  gap: 32px;
  margin-top: 32px;
}

.primary-column {
  display: grid;
  min-width: 0;
  gap: 28px;
  align-content: start;
}

.summary-card,
.timeline-card,
.runbook-card,
.inspector {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #ffffff;
}

.summary-card {
  min-height: 238px;
  padding: 32px;
  border-color: #bfd4f4;
  box-shadow: 0 18px 54px rgba(7, 17, 31, 0.08);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.summary-card.is-live {
  border-color: #ffb8b3;
  box-shadow:
    0 18px 54px rgba(7, 17, 31, 0.08),
    0 0 0 4px rgba(255, 59, 48, 0.05);
}

.summary-card h2,
.timeline-card h2,
.runbook-card h2,
.inspector h2 {
  margin: 0;
  color: var(--ink);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 28px;
}

.summary-card p,
.timeline-card p,
.runbook-card p,
.inspector p {
  margin: 8px 0 0;
  color: #66788f;
  font-size: 13px;
  line-height: 19px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 96px;
  gap: 16px;
  margin-top: 28px;
  align-items: end;
}

.metrics div {
  display: grid;
  min-height: 72px;
  align-content: center;
  gap: 6px;
  border: 1px solid #b8d2ff;
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff, #f9fbff);
  padding: 14px 16px;
}

.metrics span {
  color: #7d8ca1;
  font-size: 11px;
  line-height: 14px;
}

.metrics strong {
  color: var(--ink);
  font-size: 18px;
  font-weight: 760;
  line-height: 22px;
}

.metrics strong.green-text {
  color: #0c8f5b;
}

.metrics strong.red-text {
  color: var(--red);
}

.metrics .btn {
  height: 48px;
}

.recording-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.recording-controls .btn {
  height: 38px;
}

.trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 32px;
  margin-top: 18px;
  overflow: hidden;
  border: 1px solid #b8d2ff;
  border-radius: 6px;
  background: #f8fbff;
}

.trust-strip span {
  display: grid;
  place-items: center;
  color: #677890;
  font-size: 11px;
  font-weight: 720;
}

.timeline-card {
  padding: 28px 30px 30px;
}

.timeline-layout {
  display: grid;
  grid-template-columns: 1fr 96px;
  gap: 20px;
  margin-top: 22px;
}

.table {
  overflow: hidden;
  border: 1px solid rgba(216, 225, 237, 0.78);
  border-radius: 8px;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 64px 1fr 132px 116px;
  align-items: center;
  column-gap: 12px;
  min-height: 52px;
  border-bottom: 1px solid rgba(216, 225, 237, 0.58);
  padding: 0 20px;
}

.table-row {
  width: 100%;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  background: #ffffff;
  font: inherit;
  text-align: left;
  transition:
    background 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
}

.table-head {
  min-height: 44px;
  background: #fbfcfe;
  color: #5d6f86;
  font-size: 11px;
  font-weight: 780;
}

.table-row:last-child {
  border-bottom: 0;
}

.table-row span,
.table-row strong {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-row span {
  color: #33445b;
  font-size: 12px;
}

.table-row strong {
  color: #172338;
  font-size: 12px;
  font-weight: 620;
}

.table-row em {
  display: inline-flex;
  justify-content: center;
  width: 76px;
  height: 22px;
  align-items: center;
  border: 1px solid #b8d2ff;
  border-radius: 6px;
  background: var(--blue-soft);
  color: #1a61d6;
  font-size: 11px;
  font-style: normal;
  font-weight: 750;
}

.table-row em.done {
  border-color: #caeedc;
  background: var(--green-soft);
  color: #0d874f;
}

.table-row em.pending {
  border-color: #f5d99c;
  background: var(--amber-soft);
  color: var(--amber);
}

.table-row.selected {
  border-color: rgba(75, 132, 255, 0.72);
  background: #f3f7ff;
  box-shadow: inset 3px 0 0 rgba(47, 117, 255, 0.84);
}

.table-row:hover {
  background: #f8fbff;
}

.table-row:focus-visible {
  outline: 2px solid rgba(47, 117, 255, 0.38);
  outline-offset: -2px;
}

.flow-map {
  display: grid;
  align-content: start;
  gap: 12px;
  min-height: 248px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: #ffffff;
  padding: 14px;
}

.flow-map span {
  color: #728298;
  font-size: 11px;
  font-weight: 780;
}

.flow-map em {
  display: grid;
  height: 24px;
  place-items: center;
  border-radius: 6px;
  background: var(--green-soft);
  color: #0c7c50;
  font-size: 11px;
  font-style: normal;
  font-weight: 720;
}

.flow-map em.active {
  background: var(--blue-soft);
  color: #1a61d6;
}

.runbook-card {
  padding: 24px 30px 30px;
}

.card-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.card-head .btn {
  height: 36px;
}

.code-panel {
  overflow: hidden;
  border: 1px solid #183459;
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(64, 108, 169, 0.16), transparent 92px),
    #061225;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 38px rgba(6, 18, 37, 0.14);
  margin-bottom: 0;
}

.code-tabs {
  display: flex;
  height: 40px;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(176, 198, 225, 0.16);
  padding: 8px 12px;
}

.code-tabs span {
  display: inline-flex;
  height: 24px;
  min-width: 126px;
  align-items: center;
  border: 1px solid #2b67ad;
  border-radius: 5px;
  background: #0d2746;
  color: #e8f1ff;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 650;
}

.code-tabs span + span {
  min-width: 86px;
  border-color: #28405f;
  background: #08172b;
  color: #91a7c4;
}

.code-tabs button {
  display: grid;
  width: 28px;
  height: 28px;
  margin-left: auto;
  place-items: center;
  border: 1px solid rgba(176, 198, 225, 0.2);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.03);
  color: #c4d6ee;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;
}

.code-tabs button.copied {
  border-color: rgba(18, 166, 106, 0.64);
  background: rgba(18, 166, 106, 0.16);
  color: #8bf0bd;
}

.code-tabs svg {
  width: 18px;
  height: 18px;
}

pre {
  min-height: 152px;
  margin: 0;
  padding: 16px 24px 28px;
  overflow: auto;
  color: #e8f1ff;
  font-family: "Geist Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 12px;
  line-height: 20px;
  white-space: pre-wrap;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

.artifacts-section {
  border-top: 0;
  margin-top: 40px;
  padding-top: 0;
}

.artifacts-section .section-head {
  min-height: 36px;
}

.artifacts-section .section-head h3 {
  font-size: 15px;
  line-height: 20px;
}

.inspector {
  position: sticky;
  top: 96px;
  min-height: 752px;
  padding: 34px 34px 38px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: none;
}

.eyebrow {
  color: #8796aa;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.02em;
}

.inspector-title,
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.inspector-title {
  margin-top: 14px;
}

.inspector-content {
  animation: inspectorFade 180ms ease both;
}

.inspector-section {
  border-top: 1px solid rgba(216, 225, 237, 0.72);
  margin-top: 30px;
  padding-top: 28px;
}

.inspector h3 {
  margin: 0;
  color: #172338;
  font-size: 13px;
  font-weight: 800;
  line-height: 18px;
}

dl {
  display: grid;
  grid-template-columns: 132px 1fr;
  gap: 18px 24px;
  margin: 22px 0 0;
}

dt,
dd {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
}

dt {
  color: #73849a;
  font-weight: 680;
}

dd {
  min-width: 0;
  overflow: hidden;
  color: #102039;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inspector > .btn.block {
  height: 48px;
  margin-top: 32px;
}

.artifact-row {
  display: flex;
  min-height: 60px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--line-soft);
}

.artifact-row:last-child {
  border-bottom: 0;
}

.artifact-row strong {
  display: grid;
  gap: 4px;
  color: #172338;
  font-size: 13px;
  line-height: 18px;
}

.artifact-row span {
  color: #73849a;
  font-size: 11px;
  font-weight: 520;
  line-height: 15px;
}

.artifact-row em {
  display: grid;
  min-width: 44px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: #f8fafc;
  color: #65768d;
  font-size: 11px;
  font-style: normal;
  font-weight: 720;
}

.toast-stack {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  display: grid;
  gap: 10px;
  pointer-events: none;
}

.toast {
  min-width: 260px;
  border: 1px solid rgba(184, 210, 255, 0.58);
  border-radius: 9px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(248, 251, 255, 0.9)),
    #ffffff;
  box-shadow: 0 18px 48px rgba(7, 17, 31, 0.16);
  color: #102039;
  padding: 13px 16px;
  font-size: 13px;
  font-weight: 720;
  line-height: 18px;
  animation: toastIn 180ms ease both;
}

@keyframes recordingPulse {
  0%,
  100% {
    opacity: 1;
    filter: drop-shadow(0 0 0 rgba(255, 59, 48, 0));
  }

  50% {
    opacity: 0.72;
    filter: drop-shadow(0 0 8px rgba(255, 59, 48, 0.38));
  }
}

@keyframes inspectorFade {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1399px) {
  .console-screen {
    min-width: 0;
    grid-template-columns: 80px 256px minmax(0, 1fr);
  }

  .topbar {
    grid-template-columns: 196px minmax(220px, 1fr) auto auto auto;
    gap: 12px;
  }

  .top-nav {
    display: none;
  }

  .workspace {
    padding: 32px 32px 48px;
  }

  .header-surface {
    height: 236px;
  }

  .title-icon {
    left: 32px;
    top: 76px;
  }

  .title-row {
    min-height: 56px;
    align-items: flex-start;
    flex-wrap: wrap;
    padding-right: 0;
  }

  .title-row h1 {
    width: 100%;
    margin-right: 0;
  }

  .header-actions {
    position: relative;
    right: auto;
    top: auto;
    margin-top: 18px;
    justify-content: flex-start;
  }

  .tabs {
    margin-top: 24px;
  }

  .content-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    margin-top: 28px;
  }

  .inspector {
    position: relative;
    top: auto;
    min-height: 0;
  }
}

@media (max-width: 980px) {
  .console-screen {
    grid-template-columns: 72px minmax(0, 1fr);
    grid-template-areas:
      "rail topbar"
      "rail workspace";
  }

  .mission-rail {
    width: 72px;
  }

  .rail-item {
    left: 14px;
  }

  .account-avatar {
    left: 20px;
  }

  .rail-brand {
    left: 12px;
    right: 12px;
  }

  .context-sidebar {
    display: none;
  }

  .workspace {
    padding: 28px clamp(18px, 4vw, 32px) 44px;
  }

  .topbar {
    grid-template-columns: minmax(136px, 160px) minmax(0, 1fr) auto;
    padding: 0 18px;
  }

  .topbar > .pill,
  .topbar > .btn.light {
    display: none;
  }

  .brand-logo {
    width: 150px;
  }

  .search-box {
    height: 36px;
  }

  .summary-card {
    padding: 28px;
  }

  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .metrics .btn {
    grid-column: 1 / -1;
  }

  .recording-controls .btn {
    flex: 1 1 180px;
  }

  .timeline-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .flow-map {
    min-height: 0;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: center;
  }

  .flow-map span {
    grid-column: 1 / -1;
  }

  .table-head,
  .table-row {
    grid-template-columns: 44px minmax(0, 1fr) 90px 72px;
    column-gap: 8px;
    padding: 0 14px;
  }
}

@media (max-width: 720px) {
  .console-screen {
    grid-template-columns: 64px minmax(0, 1fr);
  }

  .mission-rail {
    width: 64px;
  }

  .topbar {
    grid-template-columns: minmax(120px, 1fr) auto;
    gap: 10px;
    padding: 0 14px;
  }

  .search-box {
    display: none;
  }

  .workspace {
    padding: 24px 16px 40px;
  }

  .title-icon {
    position: relative;
    left: auto;
    top: auto;
    margin-bottom: 14px;
  }

  .title-row {
    padding-left: 0;
  }

  .title-row h1 {
    font-size: 28px;
    line-height: 34px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
  }

  .tabs {
    overflow-x: auto;
  }

  .summary-card,
  .timeline-card,
  .runbook-card,
  .inspector {
    padding-right: 20px;
    padding-left: 20px;
  }

  .metrics,
  .trust-strip {
    grid-template-columns: minmax(0, 1fr);
    height: auto;
  }

  .recording-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }

  .toast-stack {
    right: 16px;
    bottom: 16px;
    left: 80px;
  }

  .toast {
    min-width: 0;
  }

  .trust-strip span {
    min-height: 32px;
    border-bottom: 1px solid rgba(184, 210, 255, 0.6);
  }

  .trust-strip span:last-child {
    border-bottom: 0;
  }

  .table {
    overflow-x: auto;
  }

  .table-head,
  .table-row {
    min-width: 560px;
  }

  dl {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }
}
`;

function TrailwisePrototypeStyles() {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const styleId = "trailwise-recording-prototype-styles";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = trailwisePrototypeStyles;
    return undefined;
  }, []);

  return null;
}

const icon18 = { size: 18, strokeWidth: 1.75 };
const icon20 = { size: 20, strokeWidth: 1.75 };

const runbookText = `1  # Expense approval runbook
2  1. Open expenses list
3  2. Click Create request
4  3. Enter amount and approver
5  4. Submit approval request
6  5. Wait for success confirmation
7  6. Capture result state`;

const traceEvents = [
  {
    step: 1,
    action: "Open http://localhost:5173/expenses",
    state: "Done",
    stateClass: "done",
    time: "10:24:12",
    selector: "location.href",
    result: "expenses page loaded",
  },
  {
    step: 2,
    action: "Click Create request",
    state: "Done",
    stateClass: "done",
    time: "10:24:18",
    selector: "button[data-action=create]",
    result: "request form opened",
  },
  {
    step: 3,
    action: "Enter amount and approver",
    state: "Done",
    stateClass: "done",
    time: "10:24:25",
    selector: "input[name=approval]",
    result: "approval fields populated",
  },
  {
    step: 4,
    action: "Submit approval request",
    state: "Done",
    stateClass: "done",
    time: "10:24:38",
    selector: "button[type=submit]",
    result: "waiting for success state",
  },
  {
    step: 5,
    action: "Wait for success confirmation",
    state: "Pending",
    stateClass: "pending",
    time: "--:--",
    selector: "[data-state=success]",
    result: "success confirmation pending",
  },
  {
    step: 6,
    action: "Capture result state",
    state: "Pending",
    stateClass: "pending",
    time: "--:--",
    selector: "[data-capture=result]",
    result: "result state not captured",
  },
];

const recordingSeed = [
  {
    id: "expense",
    title: "Expense approval",
    path: "localhost:5173/expenses",
    badge: "Awaiting",
    tone: "amber",
    actions: 14,
    duration: 138,
  },
  {
    id: "manager",
    title: "Manager review",
    path: "localhost:5173/review",
    badge: "Parsed",
    tone: "green",
    actions: 8,
    duration: 93,
  },
  {
    id: "invoice",
    title: "Invoice review",
    path: "localhost:5173/invoice...",
    badge: "Runbook",
    tone: "green",
    actions: 11,
    duration: 126,
  },
  {
    id: "policy",
    title: "Policy update",
    path: "localhost:5173/settings",
    badge: "Draft",
    tone: "amber",
    actions: 6,
    duration: 74,
  },
];

type Panel = "overview" | "trace" | "runbook";
type RecordingPhase = "ready" | "recording" | "completed";
type LoadingAction = "test" | "runbook" | null;
type Toast = { id: number; message: string };

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function TrailwiseRecordingPrototype({
  logoSrc = "/assets/trailwise-logo-exact.svg",
}: {
  logoSrc?: string;
}) {
  const [activePanel, setActivePanel] = useState<Panel>("trace");
  const [selectedRecordingId, setSelectedRecordingId] = useState("expense");
  const [selectedStep, setSelectedStep] = useState(4);
  const [recordingPhase, setRecordingPhase] = useState<RecordingPhase>("ready");
  const [durationSeconds, setDurationSeconds] = useState(recordingSeed[0].duration);
  const [actionsCaptured, setActionsCaptured] = useState(recordingSeed[0].actions);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const runbookRef = useRef<HTMLElement>(null);

  const selectedRecording =
    recordingSeed.find((recording) => recording.id === selectedRecordingId) ?? recordingSeed[0];
  const selectedEvent = traceEvents.find((event) => event.step === selectedStep) ?? traceEvents[3];
  const isRecording = recordingPhase === "recording";
  const isCompleted = recordingPhase === "completed";
  const statusLabel =
    recordingPhase === "recording" ? "Recording" : recordingPhase === "completed" ? "Completed" : "Ready";

  useEffect(() => {
    if (!isRecording) return undefined;

    const intervalId = window.setInterval(() => {
      setDurationSeconds((current) => current + 1);
      setActionsCaptured((current) => Math.min(current + 1, 99));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRecording]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 1800);
  };

  const jumpTo = (panel: Panel) => {
    const target = {
      overview: summaryRef,
      trace: timelineRef,
      runbook: runbookRef,
    }[panel];

    setActivePanel(panel);
    target.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectRecording = (recordingId: string) => {
    const recording = recordingSeed.find((item) => item.id === recordingId) ?? recordingSeed[0];
    setSelectedRecordingId(recording.id);
    setSelectedStep(4);
    setRecordingPhase(recording.tone === "green" ? "completed" : "ready");
    setDurationSeconds(recording.duration);
    setActionsCaptured(recording.actions);
    showToast(`${recording.title} selected`);
  };

  const beginRecording = () => {
    if (isRecording) return;
    setRecordingPhase("recording");
    setDurationSeconds(0);
    setActionsCaptured(0);
    setSelectedStep(1);
    jumpTo("overview");
    showToast("Recording started");
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setRecordingPhase("completed");
    setSelectedStep(4);
    jumpTo("trace");
    showToast("Recording completed");
  };

  const checkStatus = () => {
    showToast(`${statusLabel}: ${formatDuration(durationSeconds)} / ${actionsCaptured} actions captured`);
  };

  const generateArtifact = (kind: Exclude<LoadingAction, null>) => {
    if (!isCompleted || loadingAction) return;

    setLoadingAction(kind);
    window.setTimeout(() => {
      setLoadingAction(null);
      showToast(kind === "test" ? "Test Case generated successfully" : "Runbook generated successfully");
      if (kind === "runbook") jumpTo("runbook");
    }, 900);
  };

  const copyRunbook = async () => {
    try {
      await navigator.clipboard.writeText(runbookText);
    } catch {
      // The visual acknowledgement still helps when clipboard access is blocked.
    }

    setCopied(true);
    showToast("Runbook copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  const visibleEventState = (event: (typeof traceEvents)[number]) => {
    if (selectedStep === event.step) return "Selected";
    if (isRecording && event.step > Math.max(1, Math.min(actionsCaptured, 6))) return "Pending";
    if (isCompleted && event.step <= 6) return "Done";
    return event.state;
  };

  const visibleEventClass = (event: (typeof traceEvents)[number]) => {
    if (selectedStep === event.step) return "";
    if (visibleEventState(event) === "Done") return "done";
    if (visibleEventState(event) === "Pending") return "pending";
    return event.stateClass;
  };

  return (
    <>
      <TrailwisePrototypeStyles />
      <main className="screen-shell" aria-label="Trailwise 09 console preview">
      <section className="console-screen">
        <aside className="mission-rail" aria-label="Primary navigation">
          <div className="account-avatar">AK</div>
          <div className="rail-rule" />
          <div className="orbit" />

          <button className="rail-item active" aria-label="Workspace">
            <LayoutDashboard {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item item-2" aria-label="Dashboard">
            <Grid2X2 {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item item-3" aria-label="Trace" onClick={() => jumpTo("trace")}>
            <Route {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item item-4" aria-label="Runbook" onClick={() => jumpTo("runbook")}>
            <BookOpen {...icon20} aria-hidden="true" />
          </button>
          <button className="rail-item settings" aria-label="Settings">
            <Settings {...icon20} aria-hidden="true" />
          </button>

          <div className="rail-brand">
            <strong>TW</strong>
            <span>Trailwise</span>
            <small>v1.0.0</small>
          </div>
        </aside>

        <header className="topbar">
          <img className="brand-logo" src={logoSrc} alt="Trailwise" />
          <label className="search-box">
            <Search {...icon18} aria-hidden="true" />
            <span>Search recordings, runbooks, actions...</span>
            <kbd>Cmd K</kbd>
          </label>
          <nav className="top-nav" aria-label="Top navigation">
            <a href="#">Product</a>
            <a href="#">Runs</a>
            <a href="#">Data</a>
            <a href="#">Docs</a>
          </nav>
          <span className="pill">Helper ready</span>
          <button className="btn light" onClick={() => jumpTo("overview")}>
            New run <Route {...icon18} aria-hidden="true" />
          </button>
          <button className="btn dark" disabled={isRecording} onClick={beginRecording}>
            Start <Play {...icon18} aria-hidden="true" />
          </button>
        </header>

        <aside className="context-sidebar">
          <div className="workspace-title">ACME WORKSPACE</div>
          <div className="workspace-meta">4 projects / local helper on</div>
          <button className="btn dark block" disabled={isRecording} onClick={beginRecording}>
            New recording <Play {...icon18} aria-hidden="true" />
          </button>

          <div className="section-label">Projects</div>
          <div className="project-row active">
            <FileCode className="project-icon" {...icon18} aria-hidden="true" />
            <strong>Expense Approval</strong>
            <span>Project detail</span>
            <em>{actionsCaptured}</em>
          </div>
          <div className="project-row">
            <PanelsTopLeft className="project-icon" {...icon18} aria-hidden="true" />
            <strong>Onboarding Flow</strong>
            <span>2 recordings</span>
            <em>2</em>
          </div>
          <div className="project-row">
            <BookOpen className="project-icon" {...icon18} aria-hidden="true" />
            <strong>Checkout QA</strong>
            <span>Runbook ready</span>
            <em className="green">1</em>
          </div>

          <div className="section-label recordings-title">Recent recordings</div>
          {recordingSeed.map((recording) => {
            const isSelected = recording.id === selectedRecordingId;
            const badge =
              isSelected && isRecording ? "Recording" : isSelected && isCompleted ? "Completed" : recording.badge;

            return (
              <button
                className={isSelected ? "recording-row active" : "recording-row"}
                key={recording.id}
                onClick={() => selectRecording(recording.id)}
              >
                <CircleDot
                  className={
                    isSelected
                      ? `status-icon red ${isRecording ? "recording-pulse" : ""}`
                      : `status-icon ${recording.tone}`
                  }
                  {...icon18}
                  aria-hidden="true"
                />
                <strong>{recording.title}</strong>
                <span>{recording.path}</span>
                <em className={isSelected && isRecording ? "red" : recording.tone}>{badge}</em>
              </button>
            );
          })}

          <div className="sidebar-divider" />
          <div className="helper-card">
            <div>
              <strong>Local helper</strong>
              <span className="pill green">Ready</span>
            </div>
            <p>Mac confirmation is required before the browser recording starts.</p>
            <span className="progress">
              <i />
            </span>
          </div>
        </aside>

        <section className="workspace">
          <div className="header-surface" />
          <div className="header-grid" />
          <div className="breadcrumb">Trailwise / Projects / Expense Approval / Trace detail</div>
          <div className="title-icon">
            <GitBranch {...icon20} aria-hidden="true" />
          </div>
          <div className="title-row">
            <h1>{selectedRecording.title} workflow</h1>
            <span className={isRecording ? "pill red" : isCompleted ? "pill green" : "pill amber"}>
              {statusLabel}
            </span>
            <span className="pill">{actionsCaptured} events</span>
            <span className={isCompleted ? "pill green" : "pill amber"}>
              {isCompleted ? "Artifacts ready" : "Runbook draft"}
            </span>
          </div>
          <div className="header-actions">
            <button className="btn light" disabled={!isRecording} onClick={stopRecording}>
              Stop <Square {...icon18} aria-hidden="true" />
            </button>
            <button className="btn dark" disabled={isRecording} onClick={beginRecording}>
              Start <Play {...icon18} aria-hidden="true" />
            </button>
          </div>
          <div className="tabs">
            <button className={activePanel === "overview" ? "active" : ""} onClick={() => jumpTo("overview")}>
              <LayoutDashboard {...icon18} aria-hidden="true" />
              <span>Overview</span>
            </button>
            <button className={activePanel === "trace" ? "active" : ""} onClick={() => jumpTo("trace")}>
              <Route {...icon18} aria-hidden="true" />
              <span>Trace</span>
            </button>
            <button className={activePanel === "runbook" ? "active" : ""} onClick={() => jumpTo("runbook")}>
              <BookOpen {...icon18} aria-hidden="true" />
              <span>Runbook</span>
            </button>
          </div>

          <div className="content-grid">
            <div className="primary-column">
              <article className={isRecording ? "summary-card is-live" : "summary-card"} ref={summaryRef}>
                <h2>{isRecording ? "Recording Chrome workflow." : "Ready to record Chrome workflow."}</h2>
                <p>
                  Local helper has prepared the recording handoff. The browser will start only
                  after local confirmation.
                </p>
                <div className="metrics">
                  <div>
                    <span>Status</span>
                    <strong className={isRecording ? "red-text" : isCompleted ? "green-text" : ""}>
                      {statusLabel}
                    </strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{formatDuration(durationSeconds)}</strong>
                  </div>
                  <div>
                    <span>Actions captured</span>
                    <strong>{actionsCaptured}</strong>
                  </div>
                  <div>
                    <span>Session</span>
                    <strong>Active</strong>
                  </div>
                  <button className="btn dark" disabled={isRecording} onClick={beginRecording}>
                    Start <Play {...icon18} aria-hidden="true" />
                  </button>
                </div>
                <div className="recording-controls">
                  <button className="btn light" disabled={!isRecording} onClick={stopRecording}>
                    Stop <Square {...icon18} aria-hidden="true" />
                  </button>
                  <button className="btn light" onClick={checkStatus}>
                    Status <Activity {...icon18} aria-hidden="true" />
                  </button>
                  <button
                    className={loadingAction === "test" ? "btn light loading" : "btn light"}
                    disabled={!isCompleted || loadingAction !== null}
                    onClick={() => generateArtifact("test")}
                  >
                    Generate Test <FileCode {...icon18} aria-hidden="true" />
                  </button>
                  <button
                    className={loadingAction === "runbook" ? "btn light loading" : "btn light"}
                    disabled={!isCompleted || loadingAction !== null}
                    onClick={() => generateArtifact("runbook")}
                  >
                    Generate Runbook <BookOpen {...icon18} aria-hidden="true" />
                  </button>
                </div>
                <div className="trust-strip">
                  <span>Signed trace</span>
                  <span>Secrets redacted</span>
                  <span>Localhost target</span>
                </div>
              </article>

              <article className="timeline-card" ref={timelineRef}>
                <h2>Trace timeline</h2>
                <p>List-detail flow: selecting an event updates the inspector.</p>
                <div className="timeline-layout">
                  <div className="table">
                    <div className="table-head">
                      <span>Step</span>
                      <span>Action</span>
                      <span>State</span>
                      <span>Time</span>
                    </div>
                    {traceEvents.map((event) => (
                      <button
                        className={selectedStep === event.step ? "table-row selected" : "table-row"}
                        key={event.step}
                        onClick={() => setSelectedStep(event.step)}
                      >
                        <span>{event.step}</span>
                        <strong>{event.action}</strong>
                        <em className={visibleEventClass(event)}>{visibleEventState(event)}</em>
                        <span>{event.time}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flow-map">
                    <span>Flow map</span>
                    <em className={selectedStep === 1 ? "active" : ""}>Nav</em>
                    <em className={selectedStep === 3 ? "active" : ""}>Input</em>
                    <em className={selectedStep === 4 ? "active" : ""}>Submit</em>
                    <em className={selectedStep >= 5 ? "active" : ""}>Verify</em>
                  </div>
                </div>
              </article>

              <article className="runbook-card" ref={runbookRef}>
                <div className="card-head">
                  <div>
                    <h2>Generated Runbook</h2>
                    <p>Structured output remains attached to this recording.</p>
                  </div>
                  <button className="btn light" disabled={!isCompleted} onClick={() => jumpTo("runbook")}>
                    Open draft <BookOpen {...icon18} aria-hidden="true" />
                  </button>
                </div>
                <div className="code-panel">
                  <div className="code-tabs">
                    <span>expense_runbook.md</span>
                    <span>trace.json</span>
                    <button aria-label="Copy" className={copied ? "copied" : ""} onClick={copyRunbook}>
                      <Copy {...icon18} aria-hidden="true" />
                    </button>
                  </div>
                  <pre>{runbookText}</pre>
                </div>
              </article>
            </div>

            <aside className="inspector">
              <div className="eyebrow">TRACE INSPECTOR</div>
              <div className="inspector-content" key={`${selectedRecordingId}-${selectedStep}`}>
                <div className="inspector-title">
                  <h2>{selectedEvent.action}</h2>
                  <span className="pill">Selected</span>
                </div>
                <p>Event {selectedEvent.step} from the selected {selectedRecording.title} recording.</p>

                <div className="inspector-section">
                  <h3>Event properties</h3>
                  <dl>
                    <dt>Selector</dt>
                    <dd>{selectedEvent.selector}</dd>
                    <dt>Action</dt>
                    <dd>click</dd>
                    <dt>Result</dt>
                    <dd>{selectedEvent.result}</dd>
                    <dt>Timestamp</dt>
                    <dd>{selectedEvent.time}</dd>
                  </dl>
                </div>

                <div className="inspector-section">
                  <div className="section-head">
                    <h3>Local handoff</h3>
                    <span className={isRecording ? "pill red" : "pill amber"}>
                      {isRecording ? "Recording" : "Awaiting"}
                    </span>
                  </div>
                  <dl>
                    <dt>Device</dt>
                    <dd>Sun Junxiao MacBook Pro</dd>
                    <dt>Target</dt>
                    <dd>localhost:5173</dd>
                    <dt>Session</dt>
                    <dd>sess_mr0re8sa_8u0xr4</dd>
                  </dl>
                </div>
              </div>

              <button className="btn dark block" disabled={isRecording} onClick={beginRecording}>
                Confirm locally on the Mac <Play {...icon18} aria-hidden="true" />
              </button>

              <div className="inspector-section artifacts-section">
                <div className="section-head">
                  <h3>Artifacts</h3>
                  <span className={isCompleted ? "pill green" : "pill"}>{isCompleted ? "Ready" : "Draft"}</span>
                </div>
                <div className="artifact-row">
                  <strong>
                    Structured trace<span>{actionsCaptured} parsed events</span>
                  </strong>
                  <em>{isCompleted ? "OK" : "--"}</em>
                </div>
                <div className="artifact-row">
                  <strong>
                    Runbook<span>{isCompleted ? "draft available" : "waiting for completed trace"}</span>
                  </strong>
                  <em>{isCompleted ? "1" : "--"}</em>
                </div>
                <div className="artifact-row">
                  <strong>
                    Trace bundle<span>{isCompleted ? "signed and redacted" : "capture pending"}</span>
                  </strong>
                  <em>{isCompleted ? "OK" : "--"}</em>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </section>

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>
      </main>
    </>
  );
}
