import { T } from "../styles/theme";
import type { MethodId } from "../types";

// ─── Types ─────────────────────────────────────────────────────────────────

interface SceneProps {
  phase: "pre" | "brewing" | "done";
  stepLabel?: string;
  progress: number;  // 0-1
}

export interface BrewSceneProps extends SceneProps {
  method: MethodId | string;
  hasMilk?: boolean;
}

// ─── Method scenes ─────────────────────────────────────────────────────────

function PourOverScene({ phase, stepLabel, progress }: SceneProps) {
  const isBlooming = !!stepLabel?.toLowerCase().includes("bloom");
  const isPouring = !!stepLabel?.toLowerCase().includes("pour") || isBlooming;
  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {/* Kettle */}
      <g transform="translate(70, 80)" opacity={isPouring ? 1 : 0.4}>
        <path d="M 0 30 L 0 60 Q 0 80 20 80 L 60 80 Q 80 80 80 60 L 80 30 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <path d="M 30 30 L 30 15 Q 30 8 38 8 L 50 8 Q 58 8 58 15 L 58 30" fill="none" stroke={T.cream} strokeWidth="1.5" />
        <path d="M 80 40 Q 110 40 115 60" fill="none" stroke={T.cream} strokeWidth="1.5" />
        {isPouring && (
          <line x1="118" y1="62" x2="135" y2="105" stroke={T.accent} strokeWidth="2" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />
          </line>
        )}
      </g>
      {/* Dripper + server */}
      <g transform="translate(170, 110)">
        <path d="M 0 0 L 80 0 L 55 50 L 25 50 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <ellipse cx="40" cy="0" rx="40" ry="6" fill={T.espresso} />
        {isBlooming && (
          <>
            <ellipse cx="40" cy="-2" rx="36" ry="5" fill={T.brown} opacity="0.7">
              <animate attributeName="ry" values="5;8;5" dur="2s" repeatCount="indefinite" />
            </ellipse>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={20 + i * 10} cy="-4" r="2" fill={T.brown} opacity="0.6">
                <animate attributeName="cy" values="-4;-10;-4" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </>
        )}
        {isPouring && (
          <line x1="40" y1="50" x2="40" y2="80" stroke={T.brown} strokeWidth="1.5" opacity="0.7">
            <animate attributeName="y2" values="55;90;55" dur="0.6s" repeatCount="indefinite" />
          </line>
        )}
        <path d="M 5 80 L 75 80 L 70 130 Q 70 140 60 140 L 20 140 Q 10 140 10 130 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <rect x="11" y={140 - 60 * progress} width="58" height={60 * progress} fill={T.brownDeep} opacity="0.9" />
      </g>
      {/* Steam */}
      {phase === "brewing" && [0, 1, 2].map((i) => (
        <circle key={i} cx={210 + i * 18} cy="100" r="3" fill={T.cream} opacity="0">
          <animate attributeName="opacity" values="0;0.4;0" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values="100;60;40" dur="2s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

function ChemexScene({ stepLabel, progress }: SceneProps) {
  const isPouring = !!stepLabel?.toLowerCase().includes("pour") || !!stepLabel?.toLowerCase().includes("bloom");
  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g transform="translate(150, 60)">
        <path d="M 10 0 L 90 0 L 60 60 L 40 60 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <rect x="35" y="62" width="30" height="14" fill={T.brown} opacity="0.7" />
        <rect x="35" y="62" width="30" height="14" fill="none" stroke={T.cream} strokeWidth="1" />
        <path d="M 40 76 L 60 76 L 90 160 Q 90 180 75 180 L 25 180 Q 10 180 10 160 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <path d={`M 12 ${180 - 90 * progress} Q 12 180 25 180 L 75 180 Q 88 180 88 ${180 - 90 * progress} Z`} fill={T.brownDeep} opacity="0.9" />
        <ellipse cx="50" cy="6" rx="38" ry="4" fill={T.espresso} />
        {isPouring && (
          <>
            <line x1="50" y1="0" x2="50" y2="-30" stroke={T.accent} strokeWidth="2" opacity="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="0.8s" repeatCount="indefinite" />
            </line>
            <line x1="50" y1="60" x2="50" y2="76" stroke={T.brown} strokeWidth="1.5" opacity="0.7">
              <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite" />
            </line>
          </>
        )}
      </g>
      <g transform="translate(60, 30)" opacity={isPouring ? 1 : 0.4}>
        <path d="M 0 20 L 0 40 Q 0 50 10 50 L 50 50 Q 60 50 60 40 L 60 20 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.2" />
        <path d="M 60 25 Q 90 25 95 40" fill="none" stroke={T.cream} strokeWidth="1.2" />
      </g>
    </svg>
  );
}

function AeropressScene({ stepLabel, progress }: SceneProps) {
  const isPressing = !!stepLabel?.toLowerCase().includes("press");
  const isPouring = !!stepLabel?.toLowerCase().includes("pour");
  const isSteeping = !!stepLabel?.toLowerCase().includes("steep");
  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g transform="translate(160, 60)">
        <g style={{ transform: isPressing ? `translateY(${progress * 50}px)` : "none", transition: "transform 1s linear" }}>
          <rect x="20" y="-20" width="40" height="20" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
          <rect x="35" y="-50" width="10" height="30" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
          <rect x="22" y="0" width="36" height="8" fill={T.brown} opacity="0.8" />
        </g>
        <rect x="20" y="10" width="40" height="120" fill="none" stroke={T.cream} strokeWidth="1.5" />
        <rect x="22" y={isSteeping || isPressing ? 12 : 60} width="36"
              height={isSteeping || isPressing ? 116 : (60 + progress * 60)} fill={T.brownDeep} opacity="0.85" />
        {isSteeping && [0, 1, 2, 3].map((i) => (
          <circle key={i} cx={28 + i * 8} cy="100" r="2" fill={T.cream} opacity="0.4">
            <animate attributeName="cy" values="120;30;120" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.5;0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <rect x="18" y="130" width="44" height="8" fill={T.bg3} stroke={T.cream} strokeWidth="1.2" />
        {isPressing && (
          <line x1="40" y1="138" x2="40" y2="160" stroke={T.brown} strokeWidth="2" opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.4s" repeatCount="indefinite" />
          </line>
        )}
      </g>
      <g transform="translate(165, 220)">
        <path d="M 0 0 L 70 0 L 65 30 Q 65 38 57 38 L 13 38 Q 5 38 5 30 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <rect x="3" y="2" width="64" height={26 * progress} fill={T.brownDeep} opacity="0.9" />
        <path d="M 70 8 Q 82 8 82 18 Q 82 28 70 28" fill="none" stroke={T.cream} strokeWidth="1.5" />
      </g>
      {isPouring && (
        <line x1="200" y1="40" x2="200" y2="70" stroke={T.accent} strokeWidth="2">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
        </line>
      )}
    </svg>
  );
}

function FrenchPressScene({ stepLabel, progress }: SceneProps) {
  const isPressing = !!stepLabel?.toLowerCase().includes("press") || progress > 0.7;
  const isSteeping = !!stepLabel?.toLowerCase().includes("steep") || (progress > 0.1 && progress < 0.7);
  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g transform="translate(140, 50)">
        <rect x="0" y="20" width="120" height="180" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" rx="4" />
        <path d="M 120 60 Q 145 60 145 100 Q 145 140 120 140" fill="none" stroke={T.cream} strokeWidth="2" />
        <rect x="3" y="30" width="114" height="167" fill={T.brownDeep} opacity="0.85" />
        <line x1="60" y1={isPressing ? 60 + progress * 40 : 0} x2="60" y2="-40" stroke={T.cream} strokeWidth="2" />
        <circle cx="60" cy="-44" r="8" fill={T.cream} />
        <g style={{ transform: `translateY(${isPressing ? progress * 100 : 30}px)`, transition: "transform 1.5s ease" }}>
          <rect x="6" y="0" width="108" height="6" fill={T.brown} opacity="0.7" />
          <rect x="6" y="0" width="108" height="6" fill="none" stroke={T.cream} strokeWidth="1" />
        </g>
        {isSteeping && [0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={20 + i * 16} cy={50 + (i % 2) * 20} r="2" fill={T.espresso} opacity="0.7">
            <animate attributeName="cy"
              values={`${50 + (i % 2) * 20};${30 + (i % 2) * 20};${50 + (i % 2) * 20}`}
              dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
    </svg>
  );
}

function MokaScene({ progress }: SceneProps) {
  const isErupting = progress > 0.6;
  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g transform="translate(150, 50)">
        <path d="M 20 60 L 80 60 L 90 80 L 90 130 L 75 145 L 25 145 L 10 130 L 10 80 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        {isErupting && (
          <path d={`M 12 ${145 - 60 * (progress - 0.6) / 0.4} L 88 ${145 - 60 * (progress - 0.6) / 0.4} L 88 144 L 12 144 Z`} fill={T.brownDeep} opacity="0.9" />
        )}
        <path d="M 50 60 L 45 50 L 55 50 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.2" />
        {isErupting && [0, 1, 2].map((i) => (
          <circle key={i} cx={50 + i * 4 - 4} cy="40" r="3" fill={T.cream} opacity="0">
            <animate attributeName="opacity" values="0;0.5;0" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values="40;15;0" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <path d="M 90 90 Q 120 90 120 110 Q 120 130 90 130" fill="none" stroke={T.cream} strokeWidth="2" />
        <rect x="35" y="145" width="30" height="6" fill={T.bg3} stroke={T.cream} strokeWidth="1.2" />
        <path d="M 15 151 L 85 151 L 90 215 L 10 215 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <rect x="13" y={155 + 55 * progress} width="74" height={55 * (1 - progress)} fill={T.brown} opacity="0.6" />
        <g transform="translate(35, 220)">
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M ${i * 8} 0 Q ${i * 8 + 4} -10 ${i * 8 + 8} 0`} fill={T.accent} opacity="0.7">
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur={`${0.5 + i * 0.1}s`} repeatCount="indefinite" />
            </path>
          ))}
        </g>
      </g>
    </svg>
  );
}

function EspressoScene({ progress }: SceneProps) {
  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <g transform="translate(160, 40)">
        <rect x="20" y="0" width="60" height="40" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" rx="4" />
        <rect x="30" y="40" width="40" height="20" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <line x1="70" y1="50" x2="100" y2="55" stroke={T.cream} strokeWidth="2" />
        <circle cx="105" cy="56" r="6" fill={T.brown} opacity="0.7" />
        <rect x="36" y="60" width="6" height="10" fill={T.bg3} stroke={T.cream} strokeWidth="1" />
        <rect x="58" y="60" width="6" height="10" fill={T.bg3} stroke={T.cream} strokeWidth="1" />
        {progress > 0 && progress < 1 && (
          <>
            <line x1="39" y1="70" x2="39" y2="130" stroke={T.brownDeep} strokeWidth="2" opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
            </line>
            <line x1="61" y1="70" x2="61" y2="130" stroke={T.brownDeep} strokeWidth="2" opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
            </line>
          </>
        )}
        <defs>
          <linearGradient id="crema" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={T.brownDeep} stopOpacity="1" />
          </linearGradient>
        </defs>
        <g transform="translate(15, 130)">
          <path d="M 10 0 L 35 0 L 33 50 L 12 50 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.2" />
          <rect x="11" y={50 - 45 * progress} width="23" height={45 * progress} fill="url(#crema)" />
        </g>
        <g transform="translate(45, 130)">
          <path d="M 10 0 L 35 0 L 33 50 L 12 50 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.2" />
          <rect x="11" y={50 - 45 * progress} width="23" height={45 * progress} fill="url(#crema)" />
        </g>
      </g>
      <g transform="translate(80, 90)">
        <circle cx="0" cy="0" r="20" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <line x1="0" y1="0"
              x2={Math.cos(progress * Math.PI - Math.PI / 4) * 14}
              y2={Math.sin(progress * Math.PI - Math.PI / 4) * 14}
              stroke={T.accent} strokeWidth="2" />
        <circle cx="0" cy="0" r="2" fill={T.accent} />
        <text x="0" y="32" textAnchor="middle" fill={T.creamDim} fontSize="7" letterSpacing="2">9 BAR</text>
      </g>
    </svg>
  );
}

function MilkScene({ stepLabel, progress }: SceneProps) {
  const isPullingShot = !!stepLabel?.toLowerCase().includes("shot") || !!stepLabel?.toLowerCase().includes("ristretto") || progress < 0.2;
  const isSteaming = !!stepLabel?.toLowerCase().includes("steam") || !!stepLabel?.toLowerCase().includes("velvet") || (progress >= 0.2 && progress < 0.6);
  const isPouring = !!stepLabel?.toLowerCase().includes("pour") || !!stepLabel?.toLowerCase().includes("layer") || progress >= 0.6;

  return (
    <svg viewBox="0 0 400 280" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="milkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.milk} />
          <stop offset="100%" stopColor={T.brown} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Steam wand */}
      <g transform="translate(50, 30)" opacity={isSteaming ? 1 : 0.3}>
        <line x1="20" y1="0" x2="20" y2="60" stroke={T.cream} strokeWidth="2" />
        <rect x="15" y="60" width="10" height="14" fill={T.bg3} stroke={T.cream} strokeWidth="1" />
        {isSteaming && [0, 1, 2].map((i) => (
          <circle key={i} cx={20 + (i - 1) * 4} cy="80" r="2" fill={T.cream} opacity="0">
            <animate attributeName="opacity" values="0;0.6;0" dur="1.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values="80;100;120" dur="1.2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      {/* Milk pitcher */}
      <g transform="translate(40, 95)" opacity={isSteaming || isPouring ? 1 : 0.4}>
        <path d="M 0 0 L 60 0 L 55 60 Q 55 70 45 70 L 15 70 Q 5 70 5 60 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <path d="M 60 10 L 75 0 L 75 15 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <rect x="6" y={isSteaming ? 5 : 10} width="48" height={isSteaming ? 60 : 55} fill="url(#milkfill)" opacity="0.85" />
        {isSteaming && (
          <circle cx="30" cy="35" r="18" fill="none" stroke={T.cream} strokeWidth="1" opacity="0.4"
                  strokeDasharray="4 4" style={{ transformOrigin: "30px 35px", animation: "milk-swirl 3s linear infinite" }} />
        )}
        {isPouring && (
          <line x1="75" y1="14" x2="155" y2="120" stroke={T.milk} strokeWidth="2.5" opacity="0.9">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="0.5s" repeatCount="indefinite" />
          </line>
        )}
      </g>
      {/* Cup */}
      <g transform="translate(200, 100)">
        <path d="M 0 0 L 100 0 L 92 90 Q 92 105 78 105 L 22 105 Q 8 105 8 90 Z" fill={T.bg3} stroke={T.cream} strokeWidth="1.5" />
        <ellipse cx="50" cy="115" rx="65" ry="6" fill={T.bg3} stroke={T.cream} strokeWidth="1" />
        <path d="M 100 20 Q 130 20 130 50 Q 130 80 100 80" fill="none" stroke={T.cream} strokeWidth="1.5" />
        {(isPullingShot || progress > 0.05) && (
          <rect x="10" y={progress < 0.2 ? 80 - 70 * (progress / 0.2) : 10}
                width="80" height={progress < 0.2 ? 70 * (progress / 0.2) : 30}
                fill={T.espresso} opacity="0.95" />
        )}
        {isPouring && (
          <rect x="10" y={40 - 30 * ((progress - 0.6) / 0.4)}
                width="80" height={30 + 30 * ((progress - 0.6) / 0.4)}
                fill="url(#milkfill)" opacity="0.85" />
        )}
        {progress > 0.9 && (
          <>
            <ellipse cx="50" cy="20" rx="14" ry="3" fill={T.cream} opacity="0.8" />
            <ellipse cx="50" cy="26" rx="18" ry="3" fill={T.cream} opacity="0.7" />
            <ellipse cx="50" cy="32" rx="20" ry="3" fill={T.cream} opacity="0.6" />
            <ellipse cx="50" cy="38" rx="14" ry="2" fill={T.cream} opacity="0.5" />
          </>
        )}
      </g>
    </svg>
  );
}

// ─── BrewScene ──────────────────────────────────────────────────────────────

const MILK_METHODS = ["latte", "cappuccino", "flatwhite"] as const;

/**
 * Animated SVG brew visualizer.  Switches scene based on method.
 */
export function BrewScene({ method, phase, stepLabel, progress, hasMilk }: BrewSceneProps) {
  const sceneProps: SceneProps = { phase, stepLabel, progress };

  let Scene: React.ComponentType<SceneProps>;
  if (method === "aeropress")   Scene = AeropressScene;
  else if (method === "french") Scene = FrenchPressScene;
  else if (method === "moka")   Scene = MokaScene;
  else if (method === "espresso") Scene = EspressoScene;
  else if (method === "chemex") Scene = ChemexScene;
  else if (hasMilk || (MILK_METHODS as readonly string[]).includes(method)) Scene = MilkScene;
  else Scene = PourOverScene;

  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: "1.4",
      background: `linear-gradient(180deg, ${T.bg3}, ${T.bg2})`,
      border: `1px solid ${T.line}`, borderRadius: 20, overflow: "hidden",
    }}>
      {/* Grid lines */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "30%", height: 1, background: T.line }} />
      <div style={{ position: "absolute", top: 0, right: "20%", width: 1, height: 50, background: T.line }} />
      {/* Accent dot */}
      <div style={{
        position: "absolute", top: 46, right: "calc(20% - 8px)", width: 18, height: 18,
        borderRadius: "50%", background: T.accent, opacity: 0.7,
        boxShadow: `0 0 30px ${T.accent}`,
      }} />
      <Scene {...sceneProps} />
      <div style={{ position: "absolute", top: 16, left: 16, fontSize: 9, letterSpacing: "0.3em", color: T.creamDim }}>
        ● LIVE
      </div>
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 9, letterSpacing: "0.3em", color: T.creamDim }}>
        {(method || "v60").toUpperCase()}
      </div>
    </div>
  );
}
