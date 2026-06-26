const statusCopy = {
  idle: 'Enable location to preview your current position directly in Google Maps.',
  loading: 'Requesting location permission from your browser...',
  granted: 'Your current location is active on the map and reused across tabs on this browser.',
  denied: 'Location permission was denied, so the current-location map cannot be shown.',
  unsupported: 'This browser does not support the Geolocation API.',
  error: 'We could not read your location. Please try again from a secure browser context.',
};

const LocationPermissionCard = ({ status, error, onRequestLocation, userLocation, compactMobile = false }) => {
  const hasLocation = status === 'granted' && userLocation;
  const mobileMapHeight = compactMobile ? 'h-56' : 'h-64';
  const mapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`
    : '';
  const embedUrl = hasLocation ? `${mapsUrl}&z=14&output=embed` : '';

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-lagoon-900 text-white shadow-soft lg:rounded-[2.25rem]">
      <div className="p-4 lg:p-5">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">Google Maps</p>
        <h2 className="mt-2 font-display text-2xl font-black lg:text-[1.65rem]">Your current location</h2>
      </div>

      <div className="relative mx-4 mb-4 flex-1 overflow-hidden rounded-[1.5rem] bg-cyan-950/40 lg:mx-5 lg:mb-5">
        {hasLocation ? (
          <iframe
            title="Current location on Google Maps"
            src={embedUrl}
            className={`${mobileMapHeight} w-full border-0 lg:h-full lg:min-h-72`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={`${mobileMapHeight} bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.22),transparent_18%),radial-gradient(circle_at_72%_45%,rgba(251,146,60,0.18),transparent_20%),linear-gradient(135deg,rgba(14,116,144,0.72),rgba(15,23,42,0.94))] lg:h-full lg:min-h-72`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
          </div>
        )}

        {!hasLocation ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/45 p-5 text-center backdrop-blur-[2px]">
            <div className="max-w-xs rounded-[1.75rem] bg-white/95 p-5 text-slate-950 shadow-soft">
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                {error || statusCopy[status]}
              </p>
              <button
                type="button"
                className="mt-4 min-h-11 rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white transition hover:bg-lagoon-700 disabled:cursor-wait disabled:opacity-70"
                onClick={onRequestLocation}
                disabled={status === 'loading' || status === 'unsupported'}
              >
                {status === 'loading' ? 'Checking location...' : 'Allow location'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default LocationPermissionCard;
