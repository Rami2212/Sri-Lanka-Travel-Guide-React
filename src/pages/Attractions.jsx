import { useDeferredValue, useState } from 'react';
import AttractionCard from '../components/AttractionCard';
import CategoryFilter from '../components/CategoryFilter';
import EmptyState from '../components/EmptyState';

const Attractions = ({
  attractions,
  loading,
  error,
  categories,
  selectedCategory,
  onSelectCategory,
  favoriteIds,
  visitedIds,
  onToggleFavorite,
  onToggleVisited,
  userLocation,
  roadDistances,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredAttractions = attractions.filter((attraction) => {
    const matchesCategory = selectedCategory === 'All' || attraction.category === selectedCategory;
    const searchableText = [
      attraction.name,
      attraction.district,
      attraction.category,
      attraction.address,
      attraction.description,
    ]
      .join(' ')
      .toLowerCase();

    return matchesCategory && searchableText.includes(normalizedSearch);
  });

  return (
    <div className="space-y-5 lg:space-y-6">
      <header className="space-y-2 rounded-[2.25rem] bg-slate-950 bg-[linear-gradient(90deg,rgba(15,23,42,0.7),rgba(15,23,42,0.38),rgba(15,23,42,0.1)),url('/images/explore.jpg')] bg-cover bg-center p-5 text-white shadow-soft lg:grid lg:min-h-72 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-8 lg:rounded-[2.75rem] lg:p-7">
        <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
          Browse Sri Lanka
        </p>
        <h1 className="font-display text-4xl font-black text-white lg:mt-3 lg:text-6xl">
          Explore attractions
        </h1>
        </div>
        <p className="text-sm leading-6 text-slate-200 lg:text-base lg:font-semibold lg:leading-8">
          Search by attraction, city, district, or category. Your last category filter is saved in
          LocalStorage for the next session.
        </p>
      </header>

      <section className="space-y-4 lg:rounded-[2.5rem] lg:bg-white/70 lg:p-5 lg:shadow-card lg:backdrop-blur">
        <label className="block">
          <span className="mb-2 block text-sm font-black text-slate-700">Search places</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Try Sigiriya, Ella, beaches..."
            className="min-h-14 w-full rounded-3xl border border-white/80 bg-white/90 px-5 text-base font-bold text-slate-900 shadow-card outline-none transition placeholder:text-slate-400 focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-100 lg:min-h-16 lg:text-lg"
          />
        </label>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </section>

      {loading ? (
        <div className="rounded-[2rem] bg-white/80 p-6 text-sm font-bold text-slate-500 shadow-card">
          Loading attraction data from the local JSON API...
        </div>
      ) : null}

      {error ? (
        <EmptyState title="Could not load attractions" message={error} />
      ) : null}

      {!loading && !error && filteredAttractions.length === 0 ? (
        <EmptyState
          title="No matching attractions"
          message="Try a different search phrase or switch the category filter back to All."
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredAttractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            favorite={favoriteIds.includes(attraction.id)}
            visited={visitedIds.includes(attraction.id)}
            onToggleFavorite={onToggleFavorite}
            onToggleVisited={onToggleVisited}
            userLocation={userLocation}
            roadDistances={roadDistances}
          />
        ))}
      </div>
    </div>
  );
};

export default Attractions;
