"use client";

import { useMemo, useState } from "react";
import type { RelayCandidate, RelayEventKey, RelayLineupResult } from "@/lib/admin-types";
import styles from "./RelayAnalyzer.module.css";

const EVENT_OPTIONS: { value: RelayEventKey; label: string }[] = [
  { value: "200_medley_relay", label: "200 Medley Relay" },
  { value: "200_free_relay", label: "200 Free Relay" },
  { value: "400_free_relay", label: "400 Free Relay" },
];

interface RelayAnalyzerProps {
  candidates: RelayCandidate[];
}

export default function RelayAnalyzer({ candidates }: RelayAnalyzerProps) {
  const [event, setEvent] = useState<RelayEventKey>("200_medley_relay");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<RelayLineupResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCandidates = useMemo(
    () => candidates.filter((candidate) => selectedIds.includes(candidate.id)),
    [candidates, selectedIds]
  );

  function toggleCandidate(id: string) {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]
    );
  }

  async function handleAnalyze() {
    if (selectedCandidates.length < 4) {
      setError("Select at least 4 swimmers to build a relay.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/admin/relay-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, candidates: selectedCandidates }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Couldn't generate a lineup.");
        return;
      }
      setResult(data as RelayLineupResult);
    } catch {
      setError("Something went wrong while analyzing. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.panel}>
        <label className={styles.fieldLabel} htmlFor="event">
          Event
        </label>
        <select
          id="event"
          value={event}
          onChange={(changeEvent) => setEvent(changeEvent.target.value as RelayEventKey)}
          className={styles.select}
        >
          {EVENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <p className={styles.fieldLabel}>Swimmer pool</p>
        <ul className={styles.candidateList}>
          {candidates.map((candidate) => {
            const isSelected = selectedIds.includes(candidate.id);
            return (
              <li key={candidate.id}>
                <button
                  type="button"
                  onClick={() => toggleCandidate(candidate.id)}
                  className={`${styles.candidateChip} ${isSelected ? styles.candidateChipActive : ""}`}
                >
                  {candidate.name}
                  <span className={styles.candidateStrokes}>{candidate.strokes.join(" / ")}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {error ? <p className={styles.error}>{error}</p> : null}

        <button
          type="button"
          className={styles.submit}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing…" : "Generate lineup"}
        </button>
      </div>

      <div className={styles.panel}>
        <p className={styles.fieldLabel}>Suggested lineup</p>
        {!result ? (
          <p className={styles.emptyState}>
            Pick an event and at least 4 swimmers, then generate a lineup.
          </p>
        ) : (
          <>
            <ol className={styles.legList}>
              {result.legs.map((leg) => (
                <li key={leg.order} className={styles.legItem}>
                  <span className={styles.legOrder}>{leg.order}</span>
                  <div>
                    <p className={styles.legSwimmer}>{leg.swimmerName}</p>
                    <p className={styles.legStroke}>
                      {leg.stroke} · {leg.splitSeconds.toFixed(2)}s
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.projectedTotal}>
              Projected total: {result.projectedTotalSeconds.toFixed(2)}s
            </p>
            <p className={styles.reasoning}>{result.reasoning}</p>
          </>
        )}
      </div>
    </div>
  );
}
