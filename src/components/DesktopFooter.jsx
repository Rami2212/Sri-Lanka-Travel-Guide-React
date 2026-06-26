import BrandLogo from './BrandLogo';

const DesktopFooter = () => (
  <footer className="mx-auto hidden max-w-7xl px-8 pb-8 lg:block">
    <div className="flex items-center justify-between rounded-[2rem] border border-white/70 bg-white/65 px-6 py-4 text-sm font-bold text-slate-500 shadow-card backdrop-blur">
      <BrandLogo />
      <p>Travel companion with maps, favorites, and photos.</p>
    </div>
  </footer>
);

export default DesktopFooter;
