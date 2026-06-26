import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { formatDistance } from '../utils/distance';
import { buildRoadDistanceKey } from '../utils/roadDistance';

const AttractionDetails = ({
  attractions,
  loading,
  favoriteIds,
  visitedIds,
  onToggleFavorite,
  onToggleVisited,
  userLocation,
  locationStatus,
  locationError,
  roadDistances,
  onRequestLocation,
}) => {
  const { id } = useParams();
  const attraction = attractions.find((item) => item.id === id);

  if (loading) {
    return (
      <div className="rounded-[2rem] bg-white/80 p-6 text-sm font-bold text-slate-500 shadow-card">
        Loading attraction details...
      </div>
    );
  }

  if (!attraction) {
    return (
      <EmptyState
        title="Attraction not found"
        message="This place may have been removed from the local data file."
        action={
          <Link
            to="/attractions"
            className="inline-flex min-h-12 items-center rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white"
          >
            Back to attractions
          </Link>
        }
      />
    );
  }

  const favorite = favoriteIds.includes(attraction.id);
  const visited = visitedIds.includes(attraction.id);
  const destinationCoordinates = {
    latitude: attraction.latitude,
    longitude: attraction.longitude,
  };
  const distanceKey = userLocation ? buildRoadDistanceKey(userLocation, destinationCoordinates) : '';
  const roadDistanceKm = distanceKey ? roadDistances[distanceKey] : undefined;
  const distance =
    roadDistanceKm === undefined ? 'Checking road distance...' : formatDistance(roadDistanceKm);
  const destination = `${attraction.latitude},${attraction.longitude}`;
  const origin = userLocation ? `${userLocation.latitude},${userLocation.longitude}` : '';
  const mapsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
    : `https://www.google.com/maps?q=${destination}`;
  const mapEmbedUrl = userLocation
    ? `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}&z=10&output=embed`
    : `https://maps.google.com/maps?q=${destination}&z=13&output=embed`;
  const locationButtonDisabled = locationStatus === 'loading' || locationStatus === 'unsupported';

  return (
    <div className="space-y-5">
      <Link to="/attractions" className="inline-flex min-h-12 items-center text-sm font-black text-lagoon-700">
        Back to attractions
      </Link>

      <article className="space-y-5">
        <section className="relative min-h-[320px] overflow-hidden rounded-[2.5rem] bg-slate-950 shadow-soft lg:min-h-[440px] lg:rounded-[3rem]">
          <img src={attraction.image} alt={attraction.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 text-white lg:inset-x-8 lg:bottom-8">
            <span className="rounded-full bg-slate-100/95 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-600">
              {attraction.category}
            </span>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-black leading-tight lg:text-6xl">
              {attraction.name}
            </h1>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-50">{attraction.district}</p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-[2.5rem] bg-white/90 p-5 shadow-soft backdrop-blur lg:p-7">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-lagoon-700">Location data</p>
              <h2 className="mt-2 font-display text-3xl font-black text-slate-950">About this place</h2>
            </div>

            <p className="text-base leading-8 text-slate-700">{attraction.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-lagoon-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-lagoon-700">Address</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{attraction.address}</p>
              </div>
              <div className="rounded-3xl bg-cinnamon-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-cinnamon-700">Opening hours</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{attraction.openingHours}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-600">Coordinates</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                  {attraction.latitude}, {attraction.longitude}
                </p>
              </div>
              <div className="rounded-3xl bg-palm-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-palm-700">Road distance</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                  {distance || 'Enable location for distance'}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to={`/travel-images?attraction=${attraction.id}`}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cinnamon-500 px-5 text-sm font-black text-white shadow-lg shadow-cinnamon-500/20"
              >
                Capture travel photo
              </Link>
              <button
                type="button"
                className={`min-h-12 rounded-2xl px-5 text-sm font-black ${
                  favorite ? 'bg-cinnamon-100 text-cinnamon-700' : 'bg-white text-cinnamon-700 ring-2 ring-cinnamon-100'
                }`}
                aria-pressed={favorite}
                onClick={() => onToggleFavorite(attraction.id)}
              >
                {favorite ? 'Remove favorite' : 'Save favorite'}
              </button>
              <button
                type="button"
                className={`min-h-12 rounded-2xl px-5 text-sm font-black ${
                  visited ? 'bg-palm-100 text-palm-700' : 'bg-white text-palm-700 ring-2 ring-palm-100'
                }`}
                aria-pressed={visited}
                onClick={() => onToggleVisited(attraction.id)}
              >
                {visited ? 'Remove visited' : 'Mark as visited'}
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white shadow-lg shadow-lagoon-900/20"
              >
                {userLocation ? 'Open directions' : 'Open in Google Maps'}
              </a>
            </div>
          </div>

          <aside className="overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-soft">
            <div className="p-5 lg:p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Google Maps</p>
              <h2 className="mt-2 font-display text-3xl font-black">
                {userLocation ? 'Directions from your location' : 'Attraction map'}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-cyan-50">
                {userLocation
                  ? 'Route preview is based on your browser location and this attraction.'
                  : 'Enable location to switch this map from destination preview to directions.'}
              </p>
            </div>

            <div className="relative mx-5 mb-5 overflow-hidden rounded-[1.75rem] bg-cyan-950/40">
              <iframe
                title={`${attraction.name} map`}
                src={mapEmbedUrl}
                className="h-80 w-full border-0 lg:h-[430px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {!userLocation ? (
                <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] bg-white/95 p-4 text-slate-950 shadow-soft backdrop-blur">
                  <p className="text-sm font-black">Want directions from your current location?</p>
                  {locationError ? <p className="mt-1 text-xs font-bold text-red-600">{locationError}</p> : null}
                  <button
                    type="button"
                    className="mt-3 min-h-11 rounded-2xl bg-lagoon-900 px-4 text-sm font-black text-white disabled:cursor-wait disabled:opacity-70"
                    onClick={onRequestLocation}
                    disabled={locationButtonDisabled}
                  >
                    {locationStatus === 'loading' ? 'Checking location...' : 'Enable directions'}
                  </button>
                </div>
              ) : null}
            </div>
          </aside>
        </section>
      </article>
    </div>
  );
};

export default AttractionDetails;
