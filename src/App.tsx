import { useState } from 'react';
import { AscensionPanel } from './components/AscensionPanel';
import { AutomationPanel } from './components/AutomationPanel';
import { BoostBar } from './components/BoostBar';
import { BuyAmountSelector, type BuyAmount } from './components/BuyAmountSelector';
import { ChallengePanel } from './components/ChallengePanel';
import { ClickArea } from './components/ClickArea';
import { DailyChallengesPanel } from './components/DailyChallengesPanel';
import { DailyPanel } from './components/DailyPanel';
import { EventBanner } from './components/EventBanner';
import { GeneratorList } from './components/GeneratorList';
import { GoldenOre } from './components/GoldenOre';
import { OfflineNotice } from './components/OfflineNotice';
import { PrestigePanel } from './components/PrestigePanel';
import { RefineryPanel } from './components/RefineryPanel';
import { ResearchPanel } from './components/ResearchPanel';
import { ResourceHeader } from './components/ResourceHeader';
import { SettingsPanel } from './components/SettingsPanel';
import { StatsPanel } from './components/StatsPanel';
import { TalentTree } from './components/TalentTree';
import { TabNav } from './components/TabNav';
import type { TabId } from './components/TabNav';
import { ToastHost } from './components/ToastHost';
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
      <ToastHost toasts={game.toasts} onDismiss={game.dismissToast} />
      {game.goldenOre && <GoldenOre ore={game.goldenOre} onCatch={game.catchGoldenOre} />}
      {game.offline && (
        <OfflineNotice offline={game.offline} onDismiss={game.dismissOffline} />
      )}
      {game.event && <EventBanner event={game.event} onResolve={game.resolveEvent} />}
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
          <DailyPanel
            meteo={game.meteo}
            streak={game.state.loginStreak}
            canClaim={game.canClaimDaily}
            onClaim={game.claimDailyReward}
          />
          <BoostBar
            boosts={game.state.activeBoosts.filter((boost) => boost.id !== 'meteo')}
            frenzyReadyAt={game.frenzyReadyAt}
            onFrenzy={game.triggerFrenzy}
          />
          <BuyAmountSelector value={buyAmount} onChange={setBuyAmount} />
          <RefineryPanel
            state={game.state}
            notation={settings.notation}
            onRefine={game.refine}
            onForge={game.forgeAlloy}
          />
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
        <div className="columns">
          <div className="stack">
            <PrestigePanel state={game.state} onPrestige={prestige} />
            <AscensionPanel state={game.state} onAscend={game.ascend} />
            <AutomationPanel
              state={game.state}
              onUnlock={game.unlockAutomation}
              onToggle={game.toggleAutomation}
            />
            <ChallengePanel
              state={game.state}
              notation={settings.notation}
              onStart={game.startChallenge}
              onComplete={game.completeChallenge}
              onAbandon={game.abandonChallenge}
            />
          </div>
          <TalentTree
            state={game.state}
            onBuy={game.buyTalent}
            onRespec={game.respecTalents}
          />
        </div>
      )}

      {tab === 'research' && (
        <ResearchPanel
          state={game.state}
          notation={settings.notation}
          onResearch={game.research}
        />
      )}

      {tab === 'stats' && (
        <div className="stack">
          <DailyChallengesPanel
            state={game.state}
            notation={settings.notation}
            onClaim={game.claimChallenge}
          />
          <StatsPanel state={game.state} notation={settings.notation} />
        </div>
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
