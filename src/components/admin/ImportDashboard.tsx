"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
import type { ImportDataType, ImportResult } from "@/lib/admin-types";
import styles from "./ImportDashboard.module.css";

const DATA_TYPE_OPTIONS: { value: ImportDataType; label: string }[] = [
  { value: "swimmers", label: "Swimmers" },
  { value: "race_results", label: "Race results" },
  { value: "school_records", label: "School records" },
  { value: "coaches", label: "Coaches" },
];

interface CsvPreview {
  headers: string[];
  rows: string[][];
}

function parseCsvPreview(text: string, maxRows = 5): CsvPreview {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((cell) => cell.trim());
  const rows = lines
    .slice(1, maxRows + 1)
    .map((line) => line.split(",").map((cell) => cell.trim()));
  return { headers, rows };
}

export default function ImportDashboard() {
  const [dataType, setDataType] = useState<ImportDataType>("swimmers");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CsvPreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ImportResult[]>([]);

  async function handleFile(selected: File | null) {
    setFile(selected);
    setPreview(null);
    setError(null);
    if (selected && selected.name.toLowerCase().endsWith(".csv")) {
      const text = await selected.text();
      setPreview(parseCsvPreview(text));
    }
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0] ?? null);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function handleImport() {
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dataType", dataType);

      const response = await fetch("/api/admin/import", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Import failed.");
        return;
      }

      setHistory((previous) => [data as ImportResult, ...previous]);
      setFile(null);
      setPreview(null);
    } catch {
      setError("Something went wrong while uploading. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const showCsvUnavailableNote = file !== null && !file.name.toLowerCase().endsWith(".csv");

  return (
    <div className={styles.layout}>
      <div className={styles.panel}>
        <label className={styles.fieldLabel} htmlFor="dataType">
          What are you importing?
        </label>
        <select
          id="dataType"
          value={dataType}
          onChange={(event) => setDataType(event.target.value as ImportDataType)}
          className={styles.select}
        >
          {DATA_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <p className={styles.dropzoneTitle}>
            {file ? file.name : "Drag a CSV, Excel, or PDF file here"}
          </p>
          <p className={styles.dropzoneHint}>or</p>
          <label className={styles.browseButton}>
            Browse files
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={onFileInputChange}
              className={styles.hiddenInput}
            />
          </label>
        </div>

        {preview ? (
          <div className={styles.previewBlock}>
            <p className={styles.previewLabel}>Preview (first {preview.rows.length} rows)</p>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {preview.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : showCsvUnavailableNote ? (
          <p className={styles.previewNote}>
            Preview is only available for CSV files right now — Excel and PDF
            parsing will show a preview here once that&apos;s wired up.
          </p>
        ) : null}

        {error ? <p className={styles.error}>{error}</p> : null}

        <button
          type="button"
          className={styles.submit}
          onClick={handleImport}
          disabled={!file || isSubmitting}
        >
          {isSubmitting ? "Importing…" : "Import file"}
        </button>
      </div>

      <div className={styles.panel}>
        <p className={styles.fieldLabel}>This session&apos;s imports</p>
        {history.length === 0 ? (
          <p className={styles.emptyState}>Nothing imported yet this session.</p>
        ) : (
          <ul className={styles.historyList}>
            {history.map((entry, index) => (
              <li key={index} className={styles.historyItem}>
                <p className={styles.historyFile}>{entry.fileName}</p>
                <p className={styles.historyMeta}>
                  {entry.dataType.replace("_", " ")} · {entry.rowsImported} of{" "}
                  {entry.rowsReceived} rows imported
                </p>
                {entry.warnings.length > 0 ? (
                  <p className={styles.historyWarning}>{entry.warnings[0]}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
