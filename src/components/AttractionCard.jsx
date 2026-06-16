import { Link } from 'react-router-dom';
import { calculateDistanceKm, formatDistance } from '../utils/distance';

const AttractionCard = ({
  attraction,
  favorite,
  visited,
  onToggleFavorite,
  onToggleVisited,
  userLocation,
}) => {
  const distance = userLocation
    ? formatDistance(
        calculateDistanceKm(userLocation, {
          latitude: attraction.latitude,
          longitude: attraction.longitude,
        }),
      )
    : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-card backdrop-blur transition duration-300 lg:rounded-[2.25rem] lg:hover:-translate-y-1 lg:hover:shadow-soft">
      <Link to={`/attractions/${attraction.id}`} className="flex flex-1 flex-col">
        <div className="relative h-48 overflow-hidden bg-lagoon-50 lg:h-56">
          <img
            src={attraction.image}
            alt={attraction.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-4 top-4 rounded-full bg-slate-100/95 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-600">
            {attraction.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col space-y-3 p-4 lg:p-5">
          <div>
            <h3 className="font-display text-xl font-black text-slate-950">{attraction.name}</h3>
            <p className="text-sm font-semibold text-slate-500">{attraction.district}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600">
            {distance ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{distance}</span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="mt-auto grid grid-cols-2 gap-3 px-4 pb-4 lg:px-5 lg:pb-5">
        <button
          type="button"
          className={`min-h-12 rounded-2xl px-3 text-sm font-black transition ${
            favorite
              ? 'bg-cinnamon-500 text-white shadow-lg shadow-cinnamon-500/25'
              : 'bg-cinnamon-50 text-cinnamon-700'
          }`}
          aria-pressed={favorite}
          onClick={() => onToggleFavorite(attraction.id)}
        >
          {favorite ? 'Saved' : 'Favorite'}
        </button>
        <button
          type="button"
          className={`min-h-12 rounded-2xl px-3 text-sm font-black transition ${
            visited
              ? 'bg-palm-700 text-white shadow-lg shadow-palm-700/25'
              : 'bg-palm-50 text-palm-700'
          }`}
          aria-pressed={visited}
          onClick={() => onToggleVisited(attraction.id)}
        >
          {visited ? 'Visited' : 'Mark visited'}
        </button>
      </div>
    </article>
  );
};

export default AttractionCard;
