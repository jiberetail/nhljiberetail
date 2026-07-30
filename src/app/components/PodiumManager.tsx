import { useEffect, useState } from 'react';
import { Edit2, Save, X, MapPin, Store } from 'lucide-react';

type Podium = {
  id: string;
  name: string;
  location: string;
};

const initialPodiums: Podium[] = [
  { id: 'JibeKiosk 1', name: 'O-Zone', location: 'Level 1 - Main Entrance' },
  { id: 'JibeKiosk 2', name: 'Left Wing', location: 'Level 1 - West' },
  { id: 'JibeKiosk 3', name: 'Right Wing', location: 'Level 1 - East' },
  { id: 'JibeKiosk 4', name: 'Center Lane', location: 'Level 2 - Top of Stairs' },
  { id: 'JibeKiosk 5', name: 'Blue Line', location: 'Level 2 - West' },
  { id: 'JibeKiosk 6', name: 'Red Line', location: 'Level 2 - East' },
];

const normalizeKioskLocations = (podiums: Podium[]) =>
  podiums.map((podium) => {
    if (
      (podium.name === 'Blue Line' || podium.name === 'Red Line') &&
      podium.location.startsWith('Floor 2')
    ) {
      return { ...podium, location: podium.location.replace('Floor 2', 'Level 2') };
    }

    return podium;
  });

const STORAGE_KEY = 'nhl-jibe-retail-kiosks-v2';

export function PodiumManager() {
  const [podiums, setPodiums] = useState<Podium[]>(() => {
    try {
      const savedPodiums = window.localStorage.getItem(STORAGE_KEY);
      const parsedPodiums = savedPodiums ? JSON.parse(savedPodiums) : null;
      return Array.isArray(parsedPodiums)
        ? normalizeKioskLocations(parsedPodiums)
        : initialPodiums;
    } catch {
      return initialPodiums;
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; location: string } | null>(null);

  useEffect(() => {
    const normalizedPodiums = normalizeKioskLocations(podiums);
    const hasLegacyLocations = normalizedPodiums.some(
      (podium, index) => podium.location !== podiums[index]?.location
    );

    if (hasLegacyLocations) {
      setPodiums(normalizedPodiums);
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(podiums));
    } catch {
      // The demo still works when storage is unavailable.
    }
  }, [podiums]);

  const startEdit = (podium: Podium) => {
    setEditingId(podium.id);
    setEditForm({ name: podium.name, location: podium.location });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      setPodiums((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...editForm } : p))
      );
      setEditingId(null);
      setEditForm(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="pb-8">
      <div className="nhl-panel nhl-primary-panel mb-5 px-5 py-4">
        <h2 className="nhl-panel-title text-2xl font-black flex items-center gap-2">
          <Store size={24} className="text-[#e2c36b]" />
          Kiosk Management
        </h2>
        <p className="nhl-panel-copy text-sm mt-1 font-medium">
          Manage store kiosks and their locations throughout the store
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {podiums.map((podium) => {
          const isEditing = editingId === podium.id;

          return (
            <section
              key={podium.id}
              className="nhl-card nhl-secondary-panel min-h-[154px] p-5 group"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="nhl-panel-copy block text-xs font-bold mb-1.5 uppercase tracking-wide">
                      Kiosk Name
                    </label>
                    <input
                      type="text"
                      value={editForm?.name || ''}
                      onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#aab8c2] bg-[#0b1116] text-white focus:outline-none focus:ring-2 focus:ring-[#e2c36b] font-bold transition-colors"
                      style={{ borderRadius: '6px' }}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="nhl-panel-copy block text-xs font-bold mb-1.5 uppercase tracking-wide">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm?.location || ''}
                      onChange={(e) => setEditForm({ ...editForm!, location: e.target.value })}
                      className="w-full px-3 py-2 border border-[#aab8c2] bg-[#0b1116] text-white focus:outline-none focus:ring-2 focus:ring-[#e2c36b] font-medium transition-colors"
                      style={{ borderRadius: '6px' }}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={saveEdit}
                      className="nhl-action flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white transition-colors font-bold shadow-sm"
                      style={{ borderRadius: '6px' }}
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-[#aab8c2] bg-black/30 text-white hover:bg-white/10 transition-colors font-bold shadow-sm"
                      style={{ borderRadius: '6px' }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="nhl-panel-title text-lg font-black mb-1.5">
                        {podium.name}
                      </h3>
                      <div className="nhl-panel-copy flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-[#e2c36b]" />
                        <span className="font-medium">{podium.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(podium)}
                      className="nhl-action flex items-center gap-1.5 px-3 py-1.5 text-white transition-colors font-bold text-xs"
                      style={{ borderRadius: '6px' }}
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#aab8c2]/25">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="nhl-panel-copy font-medium">Kiosk ID:</span>
                      <span className="nhl-gold-value font-bold">{podium.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
