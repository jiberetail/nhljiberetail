import { PodiumManager } from "@/app/components/PodiumManager";
import { NhlPageShell } from "@/app/components/NhlPageShell";

export function SettingsPage() {
  return (
    <NhlPageShell>
      <div className="max-w-[1600px] px-6 py-6">
        <PodiumManager />
      </div>
    </NhlPageShell>
  );
}
