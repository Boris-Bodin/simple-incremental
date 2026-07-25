import { useState } from 'react';
import { BuyAmountSelector, type BuyAmount } from './components/BuyAmountSelector';
import { ClickArea } from './components/ClickArea';
import { GeneratorList } from './components/GeneratorList';
import { OfflineNotice } from './components/OfflineNotice';
import { PrestigePanel } from './components/PrestigePanel';
import { ResourceHeader } from './components/ResourceHeader';
import { SettingsPanel } from './components/SettingsPanel';
import { TabNav } from './components/TabNav';
import type { TabId } from './components/TabNav';
import { UpgradeList } from './components/UpgradeList';
import { playBuy, playPrestige } from './game/audio';
import { canPrestige } from './game/engine';
import { useGame } from './hooks/useGame';
import { useSettings } from './hooks/useSettings';
import './App.css';

export function App() {
  const game = useGame();
  const { settings, update, effectiveJuice } = useSettings();
  const [tab, setTab] = useState<TabId>('mining');
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(1);

  const buyGenerator = (generatorId: string, count: number) => {
    game.buyGenerator(generatorId, count);
    if (settings.sound) playBuy();
  };
  const buyUpgrade = (upgradeId: string) => {
    game.buyUpgrade(upgradeId);
    if (settings.sound) playBuy();
  };
  const prestige = () => {
    game.prestige();
    if (settings.sound) playPrestige();
  };

  return (
    <div className="game">
      {game.offline && (
        <OfflineNotice offline={game.offline} onDismiss={game.dismissOffline} />
      )}
      <ResourceHeader state={game.state} notation={settings.notation} juice={effectiveJuice} />
      <TabNav
        active={tab}
        onChange={setTab}
        badges={{ prestige: canPrestige(game.state) }}
      />

      {tab === 'mining' && (
        <>
          <ClickArea
            state={game.state}
            onMine={game.mineOnce}
            juice={effectiveJuice}
            sound={settings.sound}
            notation={settings.notation}
          />
          <BuyAmountSelector value={buyAmount} onChange={setBuyAmount} />
          <div className="columns">
            <GeneratorList
              state={game.state}
              amount={buyAmount}
              notation={settings.notation}
              onBuy={buyGenerator}
            />
            <UpgradeList state={game.state} notation={settings.notation} onBuy={buyUpgrade} />
          </div>
        </>
      )}

      {tab === 'prestige' && (
        <PrestigePanel state={game.state} onPrestige={prestige} />
      )}

      {tab === 'settings' && (
        <SettingsPanel
          settings={settings}
          onUpdate={update}
          exportSave={game.exportSave}
          importSave={game.importSave}
          onReset={game.reset}
        />
      )}
    </div>
  );
}
