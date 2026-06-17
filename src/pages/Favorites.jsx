import { Link } from 'react-router-dom';
import AttractionCard from '../components/AttractionCard';
import EmptyState from '../components/EmptyState';

const Favorites = ({
  attractions,
  favoriteIds,
  visitedIds,
  onToggleFavorite,
  onToggleVisited,
  userLocation,
}) => {
  const savedAttractions = attractions.filter((attraction) => favoriteIds.includes(attraction.id));

  return (
    <div className="space-y-5 lg:space-y-6">
      <header className="lg:flex lg:items-end lg:justify-between">
        <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cinnamon-700">Favorites</p>
        <h1 className="font-display text-4xl font-black text-slate-950 lg:text-6xl">Saved attractions</h1>
        </div>
        <p className="mt-2 hidden max-w-md text-sm font-semibold leading-6 text-slate-500 lg:block">
          A view for reviewing your bookmarked travel shortlist.
        </p>
      </header>

      {savedAttractions.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Save attractions from Explore or a detail page and they will remain here after refresh."
          action={
            <Link
              to="/attractions"
              className="inline-flex min-h-12 items-center rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white"
            >
              Explore attractions
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              favorite
              visited={visitedIds.includes(attraction.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleVisited={onToggleVisited}
              userLocation={userLocation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
