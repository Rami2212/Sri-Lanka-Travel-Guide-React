import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const navigationItems = [
  { to: '/', label: 'Home' },
  { to: '/attractions', label: 'Explore' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/visited', label: 'Visited' },
  { to: '/travel-images', label: 'Travel Images' },
  { to: '/profile', label: 'Profile' },
];

const HeaderNavigation = () => (
  <header className="sticky top-0 z-50 hidden border-b border-white/70 bg-white/80 backdrop-blur-2xl lg:block">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
      <NavLink to="/" className="group flex items-center gap-3">
        <span className="transition group-hover:rotate-2">
          <BrandLogo />
        </span>
      </NavLink>

      <nav className="flex items-center gap-1 rounded-full border border-white/80 bg-white/70 p-1 shadow-card">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-full px-5 py-3 text-sm font-black transition ${
                isActive
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                  : 'text-slate-500 hover:bg-lagoon-50 hover:text-lagoon-900'
              }`
            }
            end={item.to === '/'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/attractions"
        className="inline-flex min-h-12 items-center rounded-2xl bg-cinnamon-500 px-5 text-sm font-black text-white shadow-lg shadow-cinnamon-500/25 transition hover:-translate-y-0.5"
      >
        Plan a Route
      </NavLink>
    </div>
  </header>
);

export default HeaderNavigation;
