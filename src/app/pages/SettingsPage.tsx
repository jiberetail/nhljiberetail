import { PodiumManager } from "@/app/components/PodiumManager";

export function SettingsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="px-6 pt-12">
        <div className="max-w-[860px] backdrop-blur-md bg-white/60 border border-white/40 rounded-2xl shadow-2xl p-6">
          <PodiumManager />
        </div>
      </div>
    </div>
  );
}
