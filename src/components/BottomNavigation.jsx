import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/attractions', label: 'Explore', icon: 'compass' },
  { to: '/favorites', label: 'Saved', icon: 'heart' },
  { to: '/visited', label: 'Visited', icon: 'check' },
  { to: '/travel-images', label: 'Photos', icon: 'camera' },
  { to: '/profile', label: 'Profile', icon: 'user' },
];

const iconPaths = {
  home: 'M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z',
  compass: 'm15.5 8.5-2.2 5.1-5.1 2.2 2.2-5.1 5.1-2.2Z M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  check: 'M20 6 9 17l-5-5',
  camera: 'M4 8h3l1.5-2h7L17 8h3v10H4V8Z M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4.5 20a7.5 7.5 0 0 1 15 0',
};

const TabIcon = ({ type }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
    <path
      d={iconPaths[type]}
      fill={type === 'check' || type === 'user' ? 'none' : 'currentColor'}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const BottomNavigation = () => (
  <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/70 bg-white/90 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
    <div className="mx-auto grid max-w-3xl grid-cols-6 gap-1">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-center text-[0.62rem] font-black transition ${
              isActive ? 'bg-lagoon-900 text-white shadow-lg shadow-lagoon-900/20' : 'text-slate-500'
            }`
          }
          end={item.to === '/'}
        >
          <TabIcon type={item.icon} />
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNavigation;
