import { useState } from 'react';
import type { Settings } from '../game/settings';

interface Props {
  settings: Settings;
  onUpdate: (patch: Partial<Settings>) => void;
  exportSave: () => string;
  importSave: (raw: string) => boolean;
  onReset: () => void;
}

interface Status {
  kind: 'ok' | 'error';
  message: string;
}

export function SettingsPanel({ settings, onUpdate, exportSave, importSave, onReset }: Props) {
  const [exported, setExported] = useState('');
  const [importText, setImportText] = useState('');
  const [status, setStatus] = useState<Status | null>(null);

  const handleExport = () => {
    setExported(exportSave());
    setStatus(null);
  };

  const handleCopy = async () => {
    const code = exportSave();
    setExported(code);
    try {
      await navigator.clipboard.writeText(code);
      setStatus({ kind: 'ok', message: 'Save copied to clipboard.' });
    } catch {
      setStatus({ kind: 'error', message: 'Copy failed — select the text and copy it manually.' });
    }
  };

  const handleImport = () => {
    if (importSave(importText)) {
      setStatus({ kind: 'ok', message: 'Save imported.' });
      setImportText('');
    } else {
      setStatus({ kind: 'error', message: 'Invalid save code.' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Erase your save and start over?')) {
      onReset();
      setExported('');
      setImportText('');
      setStatus({ kind: 'ok', message: 'Progress reset.' });
    }
  };

  return (
    <div className="settings">
      <section className="panel">
        <h2>Preferences</h2>
        <label className="settings-field">
          <span>Effects</span>
          <select
            value={settings.juice}
            onChange={(event) => onUpdate({ juice: event.target.value as Settings['juice'] })}
          >
            <option value="off">Off</option>
            <option value="sober">Subtle</option>
            <option value="max">Max</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Sound</span>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(event) => onUpdate({ sound: event.target.checked })}
          />
        </label>
        <label className="settings-field">
          <span>Number format</span>
          <select
            value={settings.notation}
            onChange={(event) => onUpdate({ notation: event.target.value as Settings['notation'] })}
          >
            <option value="short">Short (K/M/B)</option>
            <option value="scientific">Scientific</option>
          </select>
        </label>
        <label className="settings-field">
          <span>Theme</span>
          <select
            value={settings.theme}
            onChange={(event) => onUpdate({ theme: event.target.value as Settings['theme'] })}
          >
            <option value="auto">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </section>

      <section className="panel">
        <h2>Export</h2>
        <p className="settings-hint">Copy this code to back up or transfer your progress.</p>
        <textarea
          className="settings-textarea"
          readOnly
          rows={4}
          value={exported}
          placeholder="Click Export to generate your save code…"
        />
        <div className="settings-actions">
          <button type="button" className="settings-button" onClick={handleExport}>
            Export
          </button>
          <button type="button" className="settings-button" onClick={handleCopy}>
            Copy
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Import</h2>
        <p className="settings-hint">
          Paste a save code to restore progress. This overwrites your current game.
        </p>
        <textarea
          className="settings-textarea"
          rows={4}
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Paste a save code…"
        />
        <div className="settings-actions">
          <button
            type="button"
            className="settings-button"
            disabled={importText.trim().length === 0}
            onClick={handleImport}
          >
            Import
          </button>
        </div>
      </section>

      <section className="panel settings-danger">
        <h2>Reset</h2>
        <p className="settings-hint">Permanently delete your progress and start fresh.</p>
        <button type="button" className="settings-button settings-button-danger" onClick={handleReset}>
          Reset progress
        </button>
      </section>

      {status && (
        <p className={`settings-status is-${status.kind}`} role="status">
          {status.message}
        </p>
      )}
    </div>
  );
}
