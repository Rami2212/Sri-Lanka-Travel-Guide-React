# Sri Lanka Travel Guide

A responsive, mobile-first travel companion for discovering attractions across Sri Lanka. Browse destinations by category, search for places, save favorites, track visited locations, view maps and directions, and keep a private travel photo log directly in the browser.

## Highlights

- Explore attractions across Sri Lanka.
- Search by place name, district, category, address, or description.
- Filter destinations by category.
- View detailed location information and opening hours.
- Show the user's current location with the Geolocation API.
- Calculate distance to attractions using the Haversine formula.
- Preview destinations and directions with Google Maps.
- Save favorite and visited places across browser sessions.
- Capture or select travel photos and store them locally.
- Create a local traveler profile with a profile image.
- Use mobile bottom navigation, tablet layouts, and a desktop header.

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 3
- Fetch API
- Geolocation API
- Google Maps embeds and navigation links
- LocalStorage
- IndexedDB
- ESLint
- Netlify

## Pages

| Route | Description |
| --- | --- |
| `/` | Home dashboard, featured places, categories, and current-location map |
| `/attractions` | Search, filter, and browse attractions |
| `/attractions/:id` | Attraction image, details, distance, map, and directions |
| `/favorites` | Saved attractions |
| `/visited` | Visited places |
| `/travel-images` | Local travel photo capture and gallery |
| `/profile` | Local traveler profile and profile image |

## Core Features

### Attraction Discovery

Attraction data is loaded asynchronously from `public/data/locations.json`. Each attraction contains its name, category, district, description, address, opening hours, coordinates, and image.

The Explore page supports:

- Text search
- Category filtering
- Responsive attraction cards
- Empty states
- Persistent category selection

### Maps and Directions

The app uses the browser Geolocation API to request the user's current coordinates.

When permission is granted, the app can:

- Display the current position on Google Maps.
- Calculate distance to each attraction.
- Show directions from the current location to an attraction.
- Open the route in the full Google Maps website or app.

If permission is denied, attraction browsing and destination maps continue to work.

### Favorites and Visited Places

Favorite and visited attraction IDs are stored in LocalStorage. They remain available after refreshing or reopening the browser.

### Travel Images

The Travel Images page supports mobile camera capture and regular file selection:

```html
<input type="file" accept="image/*" capture="environment" />
```

Images are linked to attractions and stored in IndexedDB. They are never uploaded to a server.

### Local Profile

The traveler profile includes:

- Name
- Bio
- Profile image
- Live profile preview

Profile data is stored locally in the browser. No account or authentication is required.

## Browser Storage

| Data | Storage |
| --- | --- |
| Profile name and bio | LocalStorage |
| Profile image | LocalStorage |
| Favorite attraction IDs | LocalStorage |
| Visited attraction IDs | LocalStorage |
| Last selected category | LocalStorage |
| Travel photos | IndexedDB |

Clearing browser site data removes locally stored profile information, preferences, and travel images.

## Getting Started

### Requirements

- Node.js 20 or later
- npm
- A modern browser

### Install

```bash
git clone https://github.com/Rami2212/Sri-Lanka-Travel-Guide-React
cd Sri-Lanka-Travel-Guide-React
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production files are generated in `dist`.

### Preview Production Build

```bash
npm run preview
```

### Run Lint Checks

```bash
npm run lint
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build |
| `npm run lint` | Run ESLint checks |

## Project Structure

```text
public/
  data/
    locations.json
  images/
    hero.jpg
    explore.jpg
    attractions/
src/
  components/
    AttractionCard.jsx
    BottomNavigation.jsx
    BrandLogo.jsx
    CategoryFilter.jsx
    DesktopFooter.jsx
    EmptyState.jsx
    HeaderNavigation.jsx
    LocationPermissionCard.jsx
  data/
    categories.js
  hooks/
    useAttractions.js
  pages/
    AttractionDetails.jsx
    Attractions.jsx
    Favorites.jsx
    Home.jsx
    Profile.jsx
    TravelImages.jsx
    Visited.jsx
  utils/
    distance.js
    indexedDb.js
    storage.js
  App.jsx
  index.css
  main.jsx
```

## Browser Compatibility Notes

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari

Important notes:

- If a user denies location permission, geolocation service doesn't work.

## Responsive Design

The interface is designed mobile-first:

- Mobile and tablet devices use icon-based bottom navigation.
- Desktop devices use a sticky header and footer.
- Attraction grids expand from one column to two and three columns.
- Touch targets are sized for mobile interaction.
- Maps, forms, images, and cards adapt to available screen space.

## Deployment

The repository includes Netlify configuration in `netlify.toml`.

Netlify build settings:

```text
Build command: npm run build
Publish directory: dist
```

## Privacy

- The app has no backend account system.
- Profile details remain in the browser.
- Travel images remain in IndexedDB on the current device.
- Location is requested only after user interaction.
- Location and photos are not uploaded by this application.