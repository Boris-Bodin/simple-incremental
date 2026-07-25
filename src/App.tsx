import { ClickArea } from './components/ClickArea';
import { GeneratorList } from './components/GeneratorList';
import { OfflineNotice } from './components/OfflineNotice';
import { PrestigePanel } from './components/PrestigePanel';
import { ResourceHeader } from './components/ResourceHeader';
import { UpgradeList } from './components/UpgradeList';
import { useGame } from './hooks/useGame';
import './App.css';

export function App() {
  const game = useGame();

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
      <ClickArea state={game.state} onMine={game.mineOnce} />
      <div className="columns">
        <GeneratorList state={game.state} onBuy={game.buyGenerator} />
        <div className="side">
          <UpgradeList state={game.state} onBuy={game.buyUpgrade} />
          <PrestigePanel state={game.state} onPrestige={game.prestige} />
        </div>
      </div>
      <footer className="game-footer">
        <button type="button" className="link-button" onClick={handleReset}>
          Reset
        </button>
      </footer>
    </div>
  );
}
