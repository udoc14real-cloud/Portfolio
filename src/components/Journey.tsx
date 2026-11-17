import AvatarHead from "./AvatarHead";

/**
 * The scroll journey: a path drawn down the page and a walking Godson.
 * Any element with data-chapter becomes a stop; data-say is what he says there.
 * Behaviour lives in src/lib/fx.ts.
 */
export default function Journey() {
  return (
    <div className="jr" aria-hidden="true">
      <svg className="jr-svg" xmlns="http://www.w3.org/2000/svg">
        <path className="jr-track" d="" />
        <path className="jr-done" d="" />
        <g className="jr-stops" />
      </svg>
      <div className="jr-bar">
        <div className="jr-bar-fill" />
      </div>
      <div className="jr-char">
        <div className="jr-body">
        <div className="jr-bubble">
          <span>Hey!</span>
        </div>
        <div className="jr-fig">
          <div className="jr-flip">
            <WalkerBody />
          </div>
          <AvatarHead className="ah-walker" />
          <svg className="wb-wave" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="30" width="14" height="14" rx="5" fill="#2a3b5f" />
            <g fill="#dc9c80">
              <rect x="8" y="14" width="16" height="18" rx="7" />
              <rect x="8.2" y="3" width="4.4" height="16" rx="2.2" />
              <rect x="13" y="0.5" width="4.4" height="17" rx="2.2" />
              <rect x="17.8" y="2" width="4.4" height="16" rx="2.2" />
              <rect x="22" y="6" width="4" height="13" rx="2" transform="rotate(8 24 12)" />
              <rect x="2" y="17" width="4.4" height="12" rx="2.2" transform="rotate(-38 4 23)" />
            </g>
          </svg>
        </div>
        <div className="jr-shadow" />
        </div>
      </div>
    </div>
  );
}

/** Legs, arms and hoodie hem drawn under the avatar bust. Pivots: hips (42,10), shoulders (42,-14). */
function WalkerBody() {
  const navy = "#1f2e4d";
  const navyDark = "#141f36";
  const skin = "#dc9c80";
  return (
    <svg className="wb" viewBox="0 -30 84 76" xmlns="http://www.w3.org/2000/svg">
      {/* back arm */}
      <g className="wb-arm-b">
        <rect x="37" y="-16" width="11" height="26" rx="5.5" fill={navyDark} />
        <circle cx="42.5" cy="11" r="4.6" fill="#c98a6f" />
      </g>
      {/* back leg */}
      <g className="wb-leg-b">
        <rect x="36" y="6" width="12" height="28" rx="5" fill="#33507a" />
        <path d="M33 31 h17 a4 4 0 0 1 4 4 v1.5 a2.5 2.5 0 0 1 -2.5 2.5 h-17.5 a3 3 0 0 1 -3 -3 v-2 a3 3 0 0 1 2 -3 z" fill="#d9d9d3" />
      </g>
      {/* front leg */}
      <g className="wb-leg-f">
        <rect x="36" y="6" width="12" height="28" rx="5" fill="#46689b" />
        <path d="M33 31 h17 a4 4 0 0 1 4 4 v1.5 a2.5 2.5 0 0 1 -2.5 2.5 h-17.5 a3 3 0 0 1 -3 -3 v-2 a3 3 0 0 1 2 -3 z" fill="#ffffff" />
        <rect x="31" y="37" width="23" height="2.2" rx="1.1" fill="#c6c6bf" />
      </g>
      {/* hoodie body continuing below the bust */}
      <path d="M22 -30 h40 v30 a10 10 0 0 1 -10 10 h-20 a10 10 0 0 1 -10 -10 z" fill={navy} />
      <path d="M26 3 h32" stroke={navyDark} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M33 -12 h18 v8 a3 3 0 0 1 -3 3 h-12 a3 3 0 0 1 -3 -3 z" fill={navyDark} opacity="0.7" />
      {/* front arm */}
      <g className="wb-arm-f">
        <rect x="37" y="-16" width="11" height="26" rx="5.5" fill="#2a3b5f" />
        <circle cx="42.5" cy="11" r="4.6" fill={skin} />
      </g>
    </svg>
  );
}
