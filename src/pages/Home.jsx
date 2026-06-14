import { Link, useNavigate } from 'react-router-dom';
import AttractionCard from '../components/AttractionCard';
import LocationPermissionCard from '../components/LocationPermissionCard';

const Home = ({
  attractions,
  loading,
  profile,
  categories,
  favoriteIds,
  visitedIds,
  imageCount,
  selectedCategory,
  onSelectCategory,
  onToggleFavorite,
  onToggleVisited,
  locationStatus,
  locationError,
  onRequestLocation,
  userLocation,
}) => {
  const navigate = useNavigate();
  const featuredAttractions = attractions.slice(0, 6);
  const quickCategories = categories.filter((category) => category !== 'All').slice(0, 6);

  const openCategory = (category) => {
    onSelectCategory(category);
    navigate('/attractions');
  };

  return (
    <div className="space-y-5 lg:space-y-7">
      <section className="relative min-h-[340px] overflow-hidden rounded-[2.5rem] bg-slate-950 bg-[linear-gradient(90deg,rgba(15,23,42,0.82),rgba(15,23,42,0.58),rgba(15,23,42,0.34)),url('/images/hero.jpg')] bg-cover bg-center p-5 text-white shadow-soft lg:min-h-[360px] lg:rounded-[3rem] lg:p-7 xl:p-8">
        <div className="absolute -right-16 -top-12 h-44 w-44 rounded-full bg-cinnamon-400/40 blur-2xl lg:h-72 lg:w-72" />
        <div className="absolute -bottom-20 left-4 h-52 w-52 rounded-full bg-lagoon-500/30 blur-3xl lg:h-80 lg:w-80" />
        <div className="relative flex min-h-[300px] max-w-3xl flex-col justify-center lg:min-h-[304px]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-100">
            Sri Lanka Travel Guide
          </p>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight lg:text-5xl">
            Ayubowan, {profile.name || 'Traveler'}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 lg:mt-4 lg:text-base lg:leading-7">
            Discover beaches, temples, mountain towns, food spots, heritage cities, and places worth
            saving for your next journey.
          </p>
          <div className="mt-5 hidden gap-3 lg:flex">
            <Link
              to="/attractions"
              className="inline-flex min-h-12 items-center rounded-2xl bg-cinnamon-500 px-5 text-sm font-black text-white shadow-lg shadow-cinnamon-500/25 transition hover:-translate-y-0.5"
            >
              Explore Attractions
            </Link>
            <Link
              to="/travel-images"
              className="inline-flex min-h-10 items-center rounded-2xl bg-white/75 px-4 text-sm font-black text-lagoon-900 shadow-lg shadow-white/10 backdrop-blur transition hover:bg-white/90"
            >
              Open Travel Log
            </Link>
          </div>
          <div className="mt-4 grid max-w-sm grid-cols-3 gap-2 lg:mt-5">
            <Link
              to="/favorites"
              className="rounded-xl bg-white/20 px-2 py-1.5 text-center shadow-lg shadow-white/10 backdrop-blur transition hover:bg-white/40"
            >
              <span className="block font-display text-base font-black lg:text-lg">{favoriteIds.length}</span>
              <span className="text-[0.58rem] font-bold uppercase tracking-wider">Saved</span>
            </Link>
            <Link
              to="/visited"
              className="rounded-xl bg-white/20 px-2 py-1.5 text-center shadow-lg shadow-white/10 backdrop-blur transition hover:bg-white/40"
            >
              <span className="block font-display text-base font-black lg:text-lg">{visitedIds.length}</span>
              <span className="text-[0.58rem] font-bold uppercase tracking-wider">Visited</span>
            </Link>
            <Link
              to="/travel-images"
              className="rounded-xl bg-white/20 px-2 py-1.5 text-center shadow-lg shadow-white/10 backdrop-blur transition hover:bg-white/40"
            >
              <span className="block font-display text-base font-black lg:text-lg">{imageCount}</span>
              <span className="text-[0.58rem] font-bold uppercase tracking-wider">Photos</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="space-y-5 lg:grid lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch lg:gap-5 lg:space-y-0">
        <LocationPermissionCard
          status={locationStatus}
          error={locationError}
          onRequestLocation={onRequestLocation}
          userLocation={userLocation}
          compactMobile
        />

        <section className="space-y-3 rounded-[2.25rem] lg:flex lg:h-full lg:flex-col lg:bg-white/55 lg:p-5 lg:shadow-card lg:backdrop-blur">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-lagoon-700">
                Quick categories
              </p>
              <h2 className="font-display text-2xl font-black text-slate-950 lg:text-[1.7rem]">Pick a mood</h2>
            </div>
            <Link to="/attractions" className="text-sm font-black text-lagoon-700">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex-1 lg:grid-cols-2 lg:gap-2.5">
            {quickCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`min-h-14 rounded-[1.25rem] px-3.5 text-left font-display text-base font-black shadow-card transition lg:min-h-[3.75rem] lg:rounded-[1.25rem] lg:text-base ${
                  selectedCategory === category
                    ? 'bg-lagoon-900 text-white'
                    : 'bg-white/85 text-slate-900 hover:bg-lagoon-50'
                }`}
                onClick={() => openCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="space-y-3 lg:space-y-4">
        <div className="lg:flex lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cinnamon-700">Featured</p>
            <h2 className="font-display text-2xl font-black text-slate-950 lg:text-4xl">
              Start with these places
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] bg-white/80 p-6 text-sm font-bold text-slate-500 shadow-card">
            Loading featured attractions...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredAttractions.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                favorite={favoriteIds.includes(attraction.id)}
                visited={visitedIds.includes(attraction.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleVisited={onToggleVisited}
                userLocation={userLocation}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
