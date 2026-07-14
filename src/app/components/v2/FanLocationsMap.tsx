import { useCallback, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  Sphere,
  ZoomableGroup,
  useZoomPanContext,
} from "react-simple-maps";
import { Globe2, MapPin, Minus, Plus, RotateCcw } from "lucide-react";

const WORLD_GEOGRAPHY = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const DEFAULT_POSITION = {
  coordinates: [4, 10] as [number, number],
  zoom: 1,
};

type FanLocationSample = {
  city: string;
  country: string;
  coordinates: [number, number];
  baseCount: number;
  domestic: boolean;
};

type FanLocation = FanLocationSample & {
  count: number;
  percentage: number;
};

const LOCATION_SAMPLES: FanLocationSample[] = [
  { city: "New York", country: "United States", coordinates: [-74.006, 40.7128], baseCount: 892, domestic: true },
  { city: "New Jersey", country: "United States", coordinates: [-74.55, 40.05], baseCount: 187, domestic: true },
  { city: "Toronto", country: "Canada", coordinates: [-79.3832, 43.6532], baseCount: 94, domestic: false },
  { city: "London", country: "United Kingdom", coordinates: [-0.1276, 51.5072], baseCount: 52, domestic: false },
  { city: "Tokyo", country: "Japan", coordinates: [139.6917, 35.6895], baseCount: 38, domestic: false },
  { city: "Mexico City", country: "Mexico", coordinates: [-99.1332, 19.4326], baseCount: 29, domestic: false },
  { city: "Sydney", country: "Australia", coordinates: [151.2093, -33.8688], baseCount: 21, domestic: false },
  { city: "Berlin", country: "Germany", coordinates: [13.405, 52.52], baseCount: 18, domestic: false },
  { city: "Paris", country: "France", coordinates: [2.3522, 48.8566], baseCount: 15, domestic: false },
];

function buildLocationData(totalSurveys: number): FanLocation[] {
  const baseTotal = LOCATION_SAMPLES.reduce((sum, location) => sum + location.baseCount, 0);
  const counts = LOCATION_SAMPLES.map((location) =>
    Math.round((location.baseCount / baseTotal) * totalSurveys)
  );
  const roundingDifference = totalSurveys - counts.reduce((sum, count) => sum + count, 0);
  counts[0] += roundingDifference;

  return LOCATION_SAMPLES.map((location, index) => ({
    ...location,
    count: counts[index],
    percentage: (location.baseCount / baseTotal) * 100,
  }));
}

function FanLocationMarker({
  location,
  isActive,
  isSelected,
  onHover,
  onLeave,
  onSelect,
}: {
  location: FanLocation;
  isActive: boolean;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const zoomContext = useZoomPanContext() as { k?: number };
  const inverseZoom = 1 / Math.max(MIN_ZOOM, zoomContext?.k ?? MIN_ZOOM);
  const radius = Math.min(11, 4.5 + Math.sqrt(location.percentage) * 0.72);
  const markerColor = isSelected ? "#BC0022" : location.domestic ? "#041e42" : "#3887b9";

  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <Marker
      coordinates={location.coordinates}
      role="button"
      tabIndex={0}
      aria-label={`${location.city}, ${location.country}: ${location.count.toLocaleString()} survey responses`}
      aria-pressed={isSelected}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      style={{
        default: { outline: "none" },
        hover: { outline: "none" },
        pressed: { outline: "none" },
      }}
    >
      <g transform={`scale(${inverseZoom})`} style={{ cursor: "pointer" }}>
        <circle
          r={radius + 5}
          fill={markerColor}
          opacity={isActive ? 0.18 : 0.1}
        />
        <circle
          r={isActive ? radius + 1.5 : radius}
          fill={markerColor}
          stroke="#ffffff"
          strokeWidth={2.5}
          style={{
            filter: "drop-shadow(0 2px 3px rgba(15, 23, 42, 0.28))",
            transition: "r 160ms ease, fill 160ms ease",
          }}
        />
        <circle r={2} fill="#ffffff" opacity={0.95} />

        {isActive && (
          <g transform={`translate(0 ${-(radius + 9)})`} pointerEvents="none">
            <rect
              x={-76}
              y={-48}
              width={152}
              height={42}
              rx={6}
              fill="#111827"
              opacity={0.96}
            />
            <path d="M -5 -7 L 0 0 L 5 -7 Z" fill="#111827" opacity={0.96} />
            <text
              textAnchor="middle"
              y={-31}
              fill="#ffffff"
              style={{ fontSize: 12, fontWeight: 800, fontFamily: "system-ui, sans-serif" }}
            >
              {location.city}
            </text>
            <text
              textAnchor="middle"
              y={-16}
              fill="#cbd5e1"
              style={{ fontSize: 9, fontWeight: 600, fontFamily: "system-ui, sans-serif" }}
            >
              {location.count.toLocaleString()} responses | {location.percentage.toFixed(1)}%
            </text>
          </g>
        )}
      </g>
    </Marker>
  );
}

export function FanLocationsMap({ totalSurveys }: { totalSurveys: number }) {
  const locations = useMemo(() => buildLocationData(totalSurveys), [totalSurveys]);
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [selectedLocation, setSelectedLocation] = useState("New York");
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const domesticPercentage = locations
    .filter((location) => location.domestic)
    .reduce((sum, location) => sum + location.percentage, 0);

  const changeZoom = (direction: 1 | -1) => {
    setPosition((current) => ({
      ...current,
      zoom: Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, current.zoom * (direction === 1 ? 1.5 : 1 / 1.5))
      ),
    }));
  };

  const resetMap = () => {
    setPosition(DEFAULT_POSITION);
    setSelectedLocation("New York");
    setHoveredLocation(null);
  };

  const focusLocation = (location: FanLocation) => {
    setSelectedLocation(location.city);
    setPosition({
      coordinates: location.coordinates,
      zoom: location.domestic ? 4.5 : 3,
    });
  };

  const handleMoveStart = useCallback(() => {
    setIsMoving(true);
  }, []);

  const handleMoveEnd = useCallback(
    ({ coordinates, zoom }: { coordinates: [number, number]; zoom: number }) => {
      setPosition({ coordinates, zoom });
      setIsMoving(false);
    },
    []
  );

  const activeLocation = hoveredLocation ?? selectedLocation;

  return (
    <div>
      <div
        data-testid="fan-location-map"
        data-zoom={position.zoom.toFixed(2)}
        role="region"
        aria-label="Interactive fan origin map"
        className={`relative h-[390px] overflow-hidden border border-slate-300 bg-[#eaf1f6] ${
          isMoving ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ borderRadius: "8px" }}
      >
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 150, center: [0, 6] }}
          width={960}
          height={440}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <Sphere id="fan-location-sphere" fill="#eaf1f6" stroke="#b9c9d6" strokeWidth={0.7} />
          <Graticule stroke="#cdd9e2" strokeWidth={0.45} />
          <ZoomableGroup
            center={position.coordinates}
            zoom={position.zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={WORLD_GEOGRAPHY}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geography) => (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    fill="#f8fafc"
                    stroke="#b7c5d1"
                    strokeWidth={0.55}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#e3ebf1", outline: "none" },
                      pressed: { fill: "#dce7ef", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {locations.map((location) => (
              <FanLocationMarker
                key={location.city}
                location={location}
                isActive={activeLocation === location.city}
                isSelected={selectedLocation === location.city}
                onHover={() => setHoveredLocation(location.city)}
                onLeave={() => setHoveredLocation(null)}
                onSelect={() => focusLocation(location)}
              />
            ))}
          </ZoomableGroup>
        </ComposableMap>

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 bg-[#041e42] px-3 py-2 text-white shadow-lg" style={{ borderRadius: "6px" }}>
          <Globe2 size={16} aria-hidden="true" />
          <div>
            <div className="text-xs font-black">{locations.length} origin markets</div>
            <div className="text-[10px] text-slate-300">{totalSurveys.toLocaleString()} responses mapped</div>
          </div>
        </div>

        <div className="absolute right-3 top-3 flex flex-col overflow-hidden border border-slate-300 bg-white shadow-lg" style={{ borderRadius: "6px" }}>
          <button
            type="button"
            aria-label="Zoom in"
            title="Zoom in"
            onClick={() => changeZoom(1)}
            disabled={position.zoom >= MAX_ZOOM}
            className="flex h-9 w-9 items-center justify-center text-[#041e42] transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <Plus size={17} strokeWidth={2.5} />
          </button>
          <div className="flex h-7 items-center justify-center border-y border-slate-200 text-[10px] font-black text-slate-600" aria-live="polite">
            {position.zoom.toFixed(1)}x
          </div>
          <button
            type="button"
            aria-label="Zoom out"
            title="Zoom out"
            onClick={() => changeZoom(-1)}
            disabled={position.zoom <= MIN_ZOOM}
            className="flex h-9 w-9 items-center justify-center text-[#041e42] transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <Minus size={17} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Reset map"
            title="Reset map"
            onClick={resetMap}
            className="flex h-9 w-9 items-center justify-center border-t border-slate-200 text-[#041e42] transition-colors hover:bg-slate-100"
          >
            <RotateCcw size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-4 border border-slate-300 bg-white/95 px-3 py-2 shadow-sm" style={{ borderRadius: "6px" }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-[#041e42]" />
            U.S.
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3887b9]" />
            International
          </div>
          <div className="border-l border-slate-300 pl-3 text-[10px] font-bold text-slate-600">
            Dot size = response share
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-slate-200 pb-3 text-[11px] font-bold text-slate-600">
        <span><strong className="text-[#111827]">{domesticPercentage.toFixed(1)}%</strong> U.S.</span>
        <span><strong className="text-[#111827]">{(100 - domesticPercentage).toFixed(1)}%</strong> international</span>
        <span><strong className="text-[#111827]">{locations[0].city}</strong> top origin</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {locations.map((location, index) => {
          const isSelected = selectedLocation === location.city;

          return (
            <button
              key={location.city}
              type="button"
              aria-label={`Focus map on ${location.city}`}
              aria-pressed={isSelected}
              onClick={() => focusLocation(location)}
              className={`flex h-[54px] w-full items-center justify-between gap-2 border px-3 text-left transition-colors ${
                isSelected
                  ? "border-[#041e42] bg-slate-100"
                  : "border-white/70 bg-white/70 hover:border-slate-300 hover:bg-white"
              }`}
              style={{ borderRadius: "6px" }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                  isSelected ? "bg-[#041e42] text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  <MapPin size={12} strokeWidth={2.5} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-black text-[#111827]">{location.city}</span>
                  <span className="block truncate text-[10px] font-medium text-slate-500">{location.country}</span>
                </span>
              </div>
              <span className="flex-shrink-0 text-right">
                <span className="block text-xs font-black text-[#111827]">{location.count.toLocaleString()}</span>
                <span className="block text-[9px] font-bold text-slate-500">{location.percentage.toFixed(1)}%</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
