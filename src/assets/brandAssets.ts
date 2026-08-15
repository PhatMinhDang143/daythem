export const BRAND_NAME = 'MINH PHAT EDU';
export const BRAND_SLOGAN = 'Học toán chill - Chill tới chiều';
export const BRAND_CENTER_FULL_NAME = 'TRUNG TÂM GIÁO DỤC MINH PHAT EDU';

// High-precision SVG Data URI matching the user's exact uploaded avatar logo image
export const MINH_PHAT_AVATAR_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <!-- Bright sky blue outer background -->
  <rect width="500" height="500" fill="#009fe3"/>
  
  <!-- Outer Dark Navy Ring -->
  <circle cx="250" cy="250" r="215" fill="#142b42"/>
  <circle cx="250" cy="250" r="162" fill="#243C4C"/>

  <!-- Curved Text Top: "Học toán chill" -->
  <path id="topArcPath" d="M 50 250 A 200 200 0 0 1 450 250" fill="none"/>
  <text font-family="'Be Vietnam Pro', 'Nunito', 'Arial Black', sans-serif" font-weight="900" font-size="46" fill="#ffffff" stroke="#142b42" stroke-width="9" paint-order="stroke fill" text-anchor="middle">
    <textPath href="#topArcPath" startOffset="50%">Học toán chill</textPath>
  </text>
  
  <!-- Curved Text Bottom: "Chill tới chiều" -->
  <path id="bottomArcPath" d="M 450 250 A 200 200 0 0 1 50 250" fill="none"/>
  <text font-family="'Be Vietnam Pro', 'Nunito', 'Arial Black', sans-serif" font-weight="900" font-size="44" fill="#ffffff" stroke="#142b42" stroke-width="9" paint-order="stroke fill" text-anchor="middle">
    <textPath href="#bottomArcPath" startOffset="50%">Chill tới chiều</textPath>
  </text>

  <!-- Inner Illustration Window -->
  <g clip-path="url(#innerCircleClip)">
    <clipPath id="innerCircleClip">
      <circle cx="250" cy="250" r="156" />
    </clipPath>

    <!-- Sky background -->
    <rect x="50" y="50" width="400" height="400" fill="#7ed6f7"/>
    
    <!-- Fluffy Clouds -->
    <path d="M 100 210 Q 125 175 160 195 Q 185 165 220 185 Q 245 205 220 220 Z" fill="#ffffff"/>
    <path d="M 270 185 Q 305 160 340 180 Q 370 170 390 195 Q 380 220 345 220 Z" fill="#ffffff"/>

    <!-- Rolling Green Hills -->
    <path d="M 60 300 Q 170 240 310 300 L 310 420 L 60 420 Z" fill="#589028"/>
    <path d="M 150 310 Q 290 250 440 310 L 440 420 L 150 420 Z" fill="#7cb342"/>

    <!-- Neck -->
    <rect x="235" y="300" width="30" height="35" fill="#ffd1a4"/>

    <!-- White Shirt Body & Collar -->
    <path d="M 135 420 L 175 320 L 235 320 L 250 350 L 265 320 L 325 320 L 365 420 Z" fill="#ffffff"/>
    <!-- Collar details -->
    <path d="M 175 320 L 225 350 L 250 325 L 205 320 Z" fill="#f5f5f5" stroke="#142b42" stroke-width="2.5"/>
    <path d="M 325 320 L 275 350 L 250 325 L 295 320 Z" fill="#f5f5f5" stroke="#142b42" stroke-width="2.5"/>

    <!-- Dark Blue Tie -->
    <path d="M 238 325 L 262 325 L 268 415 L 250 430 L 232 415 Z" fill="#1b4d79" stroke="#142b42" stroke-width="2"/>

    <!-- Hand over chest -->
    <path d="M 215 365 Q 235 350 255 360 Q 260 375 240 390 Z" fill="#ffd1a4" stroke="#142b42" stroke-width="2"/>

    <!-- Pocket Badge "#MINH PHAT" -->
    <rect x="268" y="355" width="54" height="20" rx="3" fill="#ffffff" stroke="#142b42" stroke-width="1.8"/>
    <text x="295" y="369" font-family="'Be Vietnam Pro', sans-serif" font-size="7.5" font-weight="900" fill="#142b42" text-anchor="middle">#MINH PHAT</text>

    <!-- Head & Ears -->
    <ellipse cx="178" cy="245" rx="15" ry="19" fill="#ffd1a4"/>
    <ellipse cx="322" cy="245" rx="15" ry="19" fill="#ffd1a4"/>
    <path d="M 178 230 C 178 315 322 315 322 230 C 322 175 178 175 178 230 Z" fill="#ffe0bd"/>

    <!-- Cute Eyes -->
    <ellipse cx="218" cy="235" rx="14" ry="18" fill="#1c2833"/>
    <ellipse cx="282" cy="235" rx="14" ry="18" fill="#1c2833"/>
    <circle cx="213" cy="229" r="5" fill="#ffffff"/>
    <circle cx="277" cy="229" r="5" fill="#ffffff"/>

    <!-- Eyebrows -->
    <path d="M 200 210 Q 218 203 236 210" fill="none" stroke="#1c2833" stroke-width="5" stroke-linecap="round"/>
    <path d="M 264 210 Q 282 203 300 210" fill="none" stroke="#1c2833" stroke-width="5" stroke-linecap="round"/>

    <!-- Smile -->
    <path d="M 235 264 Q 250 278 265 264" fill="none" stroke="#142b42" stroke-width="4" stroke-linecap="round"/>

    <!-- Blush cheeks -->
    <ellipse cx="200" cy="254" rx="10" ry="7" fill="#ff7043" opacity="0.5"/>
    <ellipse cx="300" cy="254" rx="10" ry="7" fill="#ff7043" opacity="0.5"/>

    <!-- Hair -->
    <path d="M 168 220 C 163 135 208 120 250 120 C 292 120 337 135 332 220 C 320 180 287 160 250 160 C 213 160 180 180 168 220 Z" fill="#141c24"/>
    <path d="M 178 215 Q 213 170 255 190 Q 285 170 322 215 C 314 190 290 180 250 180 C 210 180 186 190 178 215 Z" fill="#22303c"/>
  </g>
</svg>
`)}`;

export const getActiveBrandLogo = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('minhphat_custom_logo');
    if (custom && custom.trim().length > 0) {
      return custom;
    }
  }
  return MINH_PHAT_AVATAR_SVG;
};

export const BRAND_AVATAR = getActiveBrandLogo();


