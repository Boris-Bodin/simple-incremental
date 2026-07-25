import { useState } from 'react';
import { ClickArea } from './components/ClickArea';
import { GeneratorList } from './components/GeneratorList';
import { OfflineNotice } from './components/OfflineNotice';
import { PrestigePanel } from './components/PrestigePanel';
import { ResourceHeader } from './components/ResourceHeader';
import { TabNav } from './components/TabNav';
import type { TabId } from './components/TabNav';
import { UpgradeList } from './components/UpgradeList';
import { canPrestige } from './game/engine';
import { useGame } from './hooks/useGame';
import './App.css';

export function App() {
  const game = useGame();
  const [tab, setTab] = useState<TabId>('mining');

  const handleReset = () => {
    if (window.confirm('Erase your save and start over?')) {
      game.reset();
    }
  };

  return (
    <div className="game">
      {game.offline && (
        <OfflineNotice offline={game.offline} onDismiss={game.dismissOffline} />
      )}
      <ResourceHeader state={game.state} />
      <TabNav
        active={tab}
        onChange={setTab}
        badges={{ prestige: canPrestige(game.state) }}
      />

      {tab === 'mining' ? (
        <>
          <ClickArea state={game.state} onMine={game.mineOnce} />
          <div className="columns">
            <GeneratorList state={game.state} onBuy={game.buyGenerator} />
            <UpgradeList state={game.state} onBuy={game.buyUpgrade} />
          </div>
        </>
      ) : (
        <PrestigePanel state={game.state} onPrestige={game.prestige} />
      )}

      <footer className="game-footer">
        <button type="button" className="link-button" onClick={handleReset}>
          Reset
        </button>
      </footer>
    </div>
  );
}
