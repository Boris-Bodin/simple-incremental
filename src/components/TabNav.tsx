import type { ComponentType, SVGProps } from 'react';
import { FlaskIcon, GemIcon, PickaxeIcon, SettingsIcon, TrophyIcon } from './icons';

export type TabId = 'mining' | 'prestige' | 'research' | 'stats' | 'settings';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  badges?: Partial<Record<TabId, boolean>>;
}

const TABS: { id: TabId; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  { id: 'mining', label: 'Mining', Icon: PickaxeIcon },
  { id: 'prestige', label: 'Prestige', Icon: GemIcon },
  { id: 'research', label: 'Research', Icon: FlaskIcon },
  { id: 'stats', label: 'Stats', Icon: TrophyIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

export function TabNav({ active, onChange, badges }: Props) {
  return (
    <nav className="tab-nav" role="tablist">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          className={`tab-button${active === id ? ' is-active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon className="tab-icon" />
          <span>{label}</span>
          {badges?.[id] && <span className="tab-badge" aria-hidden="true" />}
        </button>
      ))}
    </nav>
  );
}
