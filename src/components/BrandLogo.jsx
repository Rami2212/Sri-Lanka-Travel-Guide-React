const BrandLogo = ({ compact = false }) => (
  <span className="flex items-center gap-3">
    <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-[1.35rem] bg-slate-950 shadow-lg shadow-lagoon-900/20">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(251,146,60,0.9),transparent_22%),linear-gradient(135deg,#0e7490,#14532d_58%,#0f172a)]" />
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="relative h-9 w-9 text-white"
        fill="none"
      >
        <path
          d="M24 7.5c-6.1 0-11 4.8-11 10.8 0 7.7 11 20.2 11 20.2s11-12.5 11-20.2c0-6-4.9-10.8-11-10.8Z"
          fill="currentColor"
          opacity="0.96"
        />
        <path
          d="M19.2 21.2c3.8-6.1 9.3-4.8 12.5-2.9-3.1 1-5.3 3.1-6.6 6.3-1.1-2.1-3-3.2-5.9-3.4Z"
          fill="#14532d"
        />
        <path
          d="M18.1 27.5c3.6 1.3 7.7 1.3 11.8 0"
          stroke="#0e7490"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <circle cx="31.5" cy="15.2" r="3.2" fill="#fb923c" />
      </svg>
    </span>

    {!compact ? (
      <span>
        <span className="block font-display text-xl font-black leading-none text-slate-950">
          Sri Lanka
        </span>
        <span className="text-xs font-black uppercase tracking-[0.24em] text-lagoon-700">
          Travel Guide
        </span>
      </span>
    ) : null}
  </span>
);

export default BrandLogo;
