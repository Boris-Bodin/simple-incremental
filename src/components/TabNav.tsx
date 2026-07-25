export type TabId = 'mining' | 'prestige' | 'settings';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
  badges?: Partial<Record<TabId, boolean>>;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'mining', label: '⛏️ Mining' },
  { id: 'prestige', label: '💎 Prestige' },
  { id: 'settings', label: '⚙️ Settings' },
];

export function TabNav({ active, onChange, badges }: Props) {
  return (
    <nav className="tab-nav" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`tab-button${active === tab.id ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {badges?.[tab.id] && <span className="tab-badge" aria-hidden="true" />}
        </button>
      ))}
    </nav>
  );
}
