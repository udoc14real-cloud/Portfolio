/**
 * The scroll journey: a path drawn down the page and an illustrated
 * Godson who walks along it. Behaviour lives in src/lib/fx.ts.
 * Any element with data-chapter becomes a stop; data-say is what he says there.
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
        <div className="jr-bubble">
          <span>Hey, I&apos;m Godson!</span>
        </div>
        <div className="jr-flip">
          <Avatar />
        </div>
        <div className="jr-shadow" />
      </div>
    </div>
  );
}

/** Side-view illustrated avatar, facing right. Pivots: hips (32,64), shoulders (33,43). */
export function Avatar() {
  const skin = "#5b3826";
  const skinShade = "#45291b";
  return (
    <svg className="av" viewBox="0 0 64 104" width="64" height="104" xmlns="http://www.w3.org/2000/svg">
      <g className="av-body">
        {/* back arm */}
        <g className="av-arm-b">
          <rect x="29" y="41" width="8" height="22" rx="4" fill="#9fbf1f" />
          <circle cx="33" cy="64" r="3.6" fill={skinShade} />
        </g>
        {/* back leg */}
        <g className="av-leg-b">
          <rect x="27.5" y="60" width="9" height="28" rx="4.5" fill="#15151c" />
          <rect x="26" y="86" width="15" height="7" rx="3.5" fill="#dcdcd6" />
        </g>
        {/* front leg */}
        <g className="av-leg-f">
          <rect x="27.5" y="60" width="9" height="28" rx="4.5" fill="#262633" />
          <rect x="26" y="86" width="16" height="7" rx="3.5" fill="#ffffff" />
          <rect x="26" y="91" width="16" height="2" rx="1" fill="#c9c9c2" />
        </g>
        {/* hood behind neck */}
        <path d="M23.5 42 C23 35 27 32.5 31 33 C27.5 35 26.5 38 27 42 Z" fill="#a8cc22" />
        {/* torso / hoodie */}
        <rect x="22" y="37" width="21" height="30" rx="9" fill="#d4ff3f" />
        <path d="M24 60 h17" stroke="#a8cc22" strokeWidth="2" strokeLinecap="round" />
        <path d="M37 40 v9" stroke="#f4f4f1" strokeWidth="1.4" strokeLinecap="round" />
        {/* neck */}
        <rect x="30" y="31" width="7" height="8" rx="3" fill={skinShade} />
        {/* head */}
        <g className="av-head">
          <ellipse cx="34" cy="21" rx="11" ry="12" fill={skin} />
          {/* low-cut hair */}
          <path
            d="M23.1 21 C22.9 13 28 9 34.4 9 C40.6 9 44.6 12.6 45 17.6 C41 15.4 36.2 15 31.8 16.2 C28.4 17.2 26.3 19.6 25.6 23.5 Z"
            fill="#121212"
          />
          <circle cx="28.4" cy="22.5" r="2.5" fill={skinShade} />
          <path d="M38.6 17.6 L42.2 17.9" stroke="#121212" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse className="av-eye" cx="40.4" cy="21" rx="1.3" ry="1.6" fill="#0d0d0d" />
          <path d="M44.6 21.8 C46.4 23.6 45.6 25.2 44 25.2" fill="none" stroke={skinShade} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M40 28.2 C41.6 29.3 43.2 29.1 44.2 27.9" fill="none" stroke="#24130a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        {/* front arm holding a stylus */}
        <g className="av-arm-f">
          <rect x="29" y="41" width="8" height="22" rx="4" fill="#c2e832" />
          <path d="M35.5 63 L43 57" stroke="#f4f4f1" strokeWidth="2" strokeLinecap="round" />
          <circle cx="43.2" cy="56.8" r="1.2" fill="#0d0d0d" />
          <circle cx="33" cy="64" r="3.6" fill={skin} />
        </g>
      </g>
    </svg>
  );
}
