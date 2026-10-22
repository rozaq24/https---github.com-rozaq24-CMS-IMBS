"use client";

import { useState } from "react";
import { Field } from "@/components/echo/field";
import { BuilderFlatChoice } from "./BuilderControls";
import "./builder.css";

type RGB = { r: number; g: number; b: number };
type CMYK = { c: number; m: number; y: number; k: number };

function hexToRgb(value: string): RGB {
  const match = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) return { r: 48, g: 72, b: 63 };
  const hex = match[1].length === 3 ? match[1].split("").map((part) => part + part).join("") : match[1];
  return { r: Number.parseInt(hex.slice(0, 2), 16), g: Number.parseInt(hex.slice(2, 4), 16), b: Number.parseInt(hex.slice(4, 6), 16) };
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b].map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const k = 1 - Math.max(red, green, blue);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return { c: Math.round((1 - red - k) / (1 - k) * 100), m: Math.round((1 - green - k) / (1 - k) * 100), y: Math.round((1 - blue - k) / (1 - k) * 100), k: Math.round(k * 100) };
}

function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  const [cyan, magenta, yellow, black] = [c, m, y, k].map((value) => Math.max(0, Math.min(100, value)) / 100);
  return { r: 255 * (1 - cyan) * (1 - black), g: 255 * (1 - magenta) * (1 - black), b: 255 * (1 - yellow) * (1 - black) };
}

export function BuilderColorControls({ label, value, allowGradient, onColorChange, onGradientChange }: {
  label: string;
  value: string;
  allowGradient?: boolean;
  onColorChange: (value: string) => void;
  onGradientChange?: (value: string) => void;
}) {
  const [mode, setMode] = useState(0);
  const [angle, setAngle] = useState(120);
  const [start, setStart] = useState("#dfeee7");
  const [end, setEnd] = useState("#f7f0df");
  const rgb = hexToRgb(value);
  const cmyk = rgbToCmyk(rgb);
  const modes = allowGradient ? ["RGB", "CMYK", "Gradasi"] : ["RGB", "CMYK"];

  function updateCmyk(key: keyof CMYK, next: string) {
    const values = { ...cmyk, [key]: Number(next) || 0 };
    onColorChange(rgbToHex(cmykToRgb(values)));
  }

  function updateGradient(nextAngle = angle, nextStart = start, nextEnd = end) {
    setAngle(nextAngle);
    setStart(nextStart);
    setEnd(nextEnd);
    onGradientChange?.(`linear-gradient(${nextAngle}deg, ${nextStart}, ${nextEnd})`);
  }

  return <div className="builder-color-controls">
    <span className="builder-color-label">{label}</span>
    <BuilderFlatChoice options={modes} value={mode} onValueChange={setMode} ariaLabel={`Mode warna ${label}`} />
    {mode === 0 ? <>
      <label className="builder-color-swatch"><span>Pilih warna</span><input type="color" value={rgbToHex(rgb)} onChange={(event) => onColorChange(event.target.value)} aria-label={`Pilih warna ${label}`} /></label>
      <div className="builder-inspector-grid">{(["r", "g", "b"] as const).map((key) => <Field key={key} label={key.toUpperCase()} type="number" value={String(rgb[key])} onValueChange={(next) => onColorChange(rgbToHex({ ...rgb, [key]: Number(next) || 0 }))} />)}</div>
    </> : mode === 1 ? <>
      <label className="builder-color-swatch"><span>Pratinjau warna</span><input type="color" value={rgbToHex(rgb)} onChange={(event) => onColorChange(event.target.value)} aria-label={`Pratinjau warna ${label}`} /></label>
      <div className="builder-inspector-grid">{(["c", "m", "y", "k"] as const).map((key) => <Field key={key} label={key.toUpperCase()} type="number" value={String(cmyk[key])} onValueChange={(next) => updateCmyk(key, next)} />)}</div>
      <small>CMYK dikonversi ke RGB untuk tampilan layar.</small>
    </> : <>
      <Field label="Sudut (derajat)" type="number" value={String(angle)} onValueChange={(next) => updateGradient(Math.max(0, Math.min(360, Number(next) || 0)))} />
      <div className="builder-inspector-grid">
        <label className="builder-color-swatch"><span>Warna awal</span><input type="color" value={start} onChange={(event) => updateGradient(angle, event.target.value, end)} aria-label="Warna awal gradasi" /></label>
        <label className="builder-color-swatch"><span>Warna akhir</span><input type="color" value={end} onChange={(event) => updateGradient(angle, start, event.target.value)} aria-label="Warna akhir gradasi" /></label>
      </div>
    </>}
  </div>;
}
