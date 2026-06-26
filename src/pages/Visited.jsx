import { Link } from 'react-router-dom';
import AttractionCard from '../components/AttractionCard';
import EmptyState from '../components/EmptyState';

const Visited = ({
  attractions,
  favoriteIds,
  visitedIds,
  onToggleFavorite,
  onToggleVisited,
  userLocation,
  roadDistances,
}) => {
  const visitedAttractions = attractions.filter((attraction) => visitedIds.includes(attraction.id));

  return (
    <div className="space-y-5 lg:space-y-6">
      <header className="lg:flex lg:items-end lg:justify-between">
        <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-palm-700">Travel history</p>
        <h1 className="font-display text-4xl font-black text-slate-950 lg:text-6xl">Visited places</h1>
        </div>
        <p className="mt-2 hidden max-w-md text-sm font-semibold leading-6 text-slate-500 lg:block">
          Track where you have already been and decide what should come next.
        </p>
      </header>

      {visitedAttractions.length === 0 ? (
        <EmptyState
          title="No visited places yet"
          message="Mark attractions as visited to build a lightweight travel history stored in LocalStorage."
          action={
            <Link
              to="/attractions"
              className="inline-flex min-h-12 items-center rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white"
            >
              Browse places
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visitedAttractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              attraction={attraction}
              favorite={favoriteIds.includes(attraction.id)}
              visited
              onToggleFavorite={onToggleFavorite}
              onToggleVisited={onToggleVisited}
              userLocation={userLocation}
              roadDistances={roadDistances}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Visited;
