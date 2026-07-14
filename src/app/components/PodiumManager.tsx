import { useEffect, useState } from 'react';
import { Edit2, Save, X, MapPin, Store } from 'lucide-react';

type Podium = {
  id: string;
  name: string;
  location: string;
  batteryLevel: number;
};

const initialPodiums: Podium[] = [
  { id: 'JibePod 1', name: 'Main Entrance Podium', location: 'Floor 1 - Main Entrance', batteryLevel: 87 },
  { id: 'JibePod 2', name: 'Rangers Corner', location: 'Floor 1 - East Side', batteryLevel: 92 },
  { id: 'JibePod 3', name: 'Islanders Display', location: 'Floor 1 - West Side', batteryLevel: 64 },
  { id: 'JibePod 4', name: 'Hat Central', location: 'Floor 2 - Center', batteryLevel: 78 },
  { id: 'JibePod 5', name: 'Jersey Wall', location: 'Floor 2 - North Wall', batteryLevel: 45 },
  { id: 'JibePod 6', name: 'Kids Zone Podium', location: 'Floor 2 - South Corner', batteryLevel: 91 },
];

const STORAGE_KEY = 'nhl-jibe-retail-podiums';

function BatteryIcon({ level }: { level: number }) {
  const getColor = () => {
    if (level > 75) return '#16a34a'; // green-600
    if (level > 50) return '#ca8a04'; // yellow-600
    if (level > 25) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  const color = getColor();

  return (
    <div className="relative flex items-center" style={{ width: '22px', height: '11px' }}>
      {/* Battery body */}
      <div
        className="relative"
        style={{
          width: '19px',
          height: '11px',
          border: `1.5px solid ${color}`,
          borderRadius: '1.5px',
          backgroundColor: '#fff'
        }}
      >
        {/* Battery fill */}
        <div
          style={{
            position: 'absolute',
            left: '1px',
            top: '1px',
            bottom: '1px',
            width: `calc(${level}% - 2px)`,
            backgroundColor: color,
            borderRadius: '1px',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      {/* Battery tip */}
      <div
        style={{
          width: '2px',
          height: '5px',
          backgroundColor: color,
          borderRadius: '0 1px 1px 0',
          marginLeft: '0.5px'
        }}
      />
    </div>
  );
}

export function PodiumManager() {
  const [podiums, setPodiums] = useState<Podium[]>(() => {
    try {
      const savedPodiums = window.localStorage.getItem(STORAGE_KEY);
      const parsedPodiums = savedPodiums ? JSON.parse(savedPodiums) : null;
      return Array.isArray(parsedPodiums) ? parsedPodiums : initialPodiums;
    } catch {
      return initialPodiums;
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; location: string } | null>(null);

  useEffect(() => {
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
      <div className="mb-4">
        <h2 className="text-xl font-black text-[#333333] flex items-center gap-2">
          <Store size={24} className="text-[#333333]" />
          Podium Management
        </h2>
        <p className="text-sm text-[#333333] mt-1 font-medium">
          Manage display podiums and their locations throughout the store
        </p>
      </div>

      <div className="bg-gradient-to-r from-[#111827]/30 to-[#6B7280]/30 rounded-xl p-[1px] shadow-sm">
        <div className="bg-white rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {podiums.map((podium) => {
              const isEditing = editingId === podium.id;

              return (
                <div
                  key={podium.id}
                  className="bg-gradient-to-r from-[#111827]/30 to-[#6B7280]/30 rounded-lg p-[1px] shadow-sm"
                >
                  <div className="bg-white rounded-lg p-5 group">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Podium Name
                          </label>
                          <input
                            type="text"
                            value={editForm?.name || ''}
                            onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-[#BC0022] focus:outline-none focus:ring-2 focus:ring-[#BC0022] font-bold transition-colors"
                            style={{ borderRadius: '6px' }}
                            autoFocus
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                            Location
                          </label>
                          <input
                            type="text"
                            value={editForm?.location || ''}
                            onChange={(e) => setEditForm({ ...editForm!, location: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-[#BC0022] focus:outline-none focus:ring-2 focus:ring-[#BC0022] font-medium transition-colors"
                            style={{ borderRadius: '6px' }}
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={saveEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors font-bold shadow-sm"
                            style={{ borderRadius: '6px' }}
                          >
                            <Save size={16} />
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors font-bold shadow-sm"
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
                            <h3 className="text-lg font-black text-[#333333] mb-1.5">
                              {podium.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={14} className="text-[#BC0022]" />
                              <span className="font-medium">{podium.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => startEdit(podium)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#041e42] text-white hover:bg-[#0a2f5f] transition-colors font-bold text-xs opacity-0 group-hover:opacity-100"
                            style={{ borderRadius: '6px' }}
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-500 font-medium">Podium ID:</span>
                            <span className="font-bold text-gray-700">{podium.id}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 font-medium">iPad Battery:</span>
                            <div className="flex items-center gap-1.5">
                              <BatteryIcon level={podium.batteryLevel} />
                              <span className={`font-bold ${
                                podium.batteryLevel > 75 ? 'text-green-700' :
                                podium.batteryLevel > 50 ? 'text-yellow-700' :
                                'text-red-700'
                              }`}>{podium.batteryLevel}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
