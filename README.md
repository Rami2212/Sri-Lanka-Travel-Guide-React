# Sri Lanka Travel Guide

A mobile-first Sri Lanka travel companion web application built for the SENG 41293 Mobile Web Application Development practical assignment.

The project follows Track B: Local Tour and Travel Web Guide. It helps travelers browse Sri Lankan attractions, search and filter places, view location details, save favorites, mark visited places, view maps and directions, capture travel photos, and maintain a local traveler profile.

## Assignment Information

- Course: SENG 41293 - Mobile Web Application Development
- Track: Track B - Local Tour and Travel Web Guide
- Application type: Responsive Mobile Web Application / Single Page Application
- Deployment target: Netlify or localhost demonstration
- Main focus: Mobile-first UI, browser storage, asynchronous data loading, and Web API integration

## Live Demo / Local Demo

For local demonstration, run the app with Vite:

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal. By default, Vite uses:

```text
http://localhost:5173
```

For production preview:

```bash
npm run build
npm run preview
```

## Features

### Home Dashboard

- Mobile-first Sri Lanka Travel Guide landing section.
- Cover-image hero using `public/images/hero.jpg`.
- Welcome message using the locally stored profile name.
- Quick stats for saved places, visited places, and travel photos.
- Current-location Google Maps card using the Geolocation API.
- Quick category shortcuts.
- Featured attractions grid.

### Explore Attractions

- Explore page hero using `public/images/explore.jpg`.
- Attraction data loaded asynchronously from a local JSON file.
- Search by name, district, category, address, or description.
- Dynamic category filtering.
- Last selected category is persisted in LocalStorage.
- Empty-state message when no results match.

### Attraction Details

- Large attraction image at the top of the page.
- Detailed data section with description, address, opening hours, coordinates, and distance.
- Google Maps preview for the attraction.
- If location permission is granted, the map switches to directions from the user's current location to the attraction.
- External Google Maps link for navigation.
- Favorite and visited action buttons.
- Link to capture a travel photo for the selected attraction.

### Favorites

- Add or remove attractions from Favorites.
- Favorite attraction IDs are saved in LocalStorage.
- Favorites remain after page refresh or browser restart.
- Dedicated Favorites page displays all saved places.

### Visited Places

- Mark attractions as visited.
- Visited attraction IDs are saved in LocalStorage.
- Dedicated Visited page displays travel history.

### Travel Images

- Capture or select travel images using a mobile-friendly file input.
- Link each image to an attraction.
- Store images locally in IndexedDB.
- View saved travel images in a gallery.
- Delete locally saved images.
- No images are uploaded to a server.

### Profile

- Edit local traveler name and bio.
- Upload a local profile image.
- Profile preview updates before saving.
- Profile data is saved in LocalStorage.
- No authentication or backend is required.

### Responsive Navigation

- Mobile and tablet use a bottom navigation bar with icons.
- Desktop uses a sticky header navigation.
- Desktop also includes a small footer.

## Technology Stack

- React
- Vite
- React Router
- Tailwind CSS
- Fetch API
- Geolocation API
- Google Maps links and embeddable maps
- LocalStorage
- IndexedDB
- ESLint
- Netlify deployment configuration

## Browser APIs Used

### Fetch API

Attraction records are fetched asynchronously from:

```text
public/data/locations.json
```

This satisfies the assignment requirement for asynchronous data loading through Fetch API or a mock REST API.

### Geolocation API

The app requests the user's current location through the browser Geolocation API.

Used for:

- Showing current location on Google Maps.
- Calculating distance from the user to an attraction.
- Showing directions from the user to the selected attraction.

If permission is denied, the app still works and shows a friendly permission message.

### Camera / File Capture

The Travel Images page uses:

```html
<input type="file" accept="image/*" capture="environment" />
```

On supported mobile browsers, this opens the camera. On desktop, it opens the file picker.

### LocalStorage

Used for small persistent data:

- Traveler profile name
- Traveler profile bio
- Profile image data URL
- Favorite attraction IDs
- Visited attraction IDs
- Last selected category filter

### IndexedDB

Used for larger local image data:

- Travel image records
- Attraction linked to each image
- Image creation date

## Data Storage Plan

| Data | Storage | Reason |
| --- | --- | --- |
| Attraction records | JSON file | Easy mock API data source |
| Favorite IDs | LocalStorage | Small persistent list |
| Visited IDs | LocalStorage | Small persistent list |
| Last category filter | LocalStorage | User preference |
| Profile name and bio | LocalStorage | Small text data |
| Profile image | LocalStorage | Small local profile preview |
| Travel photos | IndexedDB | Better for larger image data |

## Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Dashboard, hero, current location, categories, featured places |
| `/attractions` | Explore | Search, filter, and browse attractions |
| `/attractions/:id` | Attraction Details | Image, details, maps, directions, actions |
| `/favorites` | Favorites | Saved attractions |
| `/visited` | Visited | Visited places history |
| `/travel-images` | Travel Images | Camera/file capture and local gallery |
| `/profile` | Profile | Local profile editor and profile image |

## Project Structure

```text
Sri-Lanka-Travel-Guide-React/
  public/
    _redirects
    data/
      locations.json
    images/
      hero.jpg
      explore.jpg
      attractions/
        *.svg
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
  index.html
  netlify.toml
  package.json
  tailwind.config.js
  vite.config.js
```

## Installation

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build in `dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint checks |

## Deployment

The app is ready for Netlify deployment.

Netlify configuration is included in:

```text
netlify.toml
```

Build settings:

```text
Build command: npm run build
Publish directory: dist
```

SPA redirects are configured with:

```text
public/_redirects
```

This allows React Router routes such as `/attractions/sigiriya-rock-fortress` to work after deployment.

## Browser Compatibility Notes

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Firefox
- Safari

Important notes:

- Geolocation works on `localhost` during development.
- Geolocation and camera features work best on HTTPS when deployed.
- Netlify provides HTTPS automatically.
- If a user denies location permission, maps and browsing still work.
- Camera capture behavior depends on browser and device support.

## Testing Checklist

Use Chrome DevTools device toolbar to test mobile sizes.

Recommended test scenarios:

- Home page loads correctly on mobile, tablet, and desktop.
- Mobile bottom navigation icons are visible.
- Desktop header navigation is visible at large screen sizes.
- Explore search filters attractions correctly.
- Category filter updates results.
- Last selected category persists after refresh.
- Favorite button persists after refresh.
- Visited button persists after refresh.
- Attraction detail page loads by route ID.
- Google Maps destination preview loads.
- Location permission granted shows distance and directions.
- Location permission denied shows a friendly message.
- Travel image capture/select saves to IndexedDB.
- Travel image delete removes the image.
- Profile name and bio save to LocalStorage.
- Profile image preview and save work.
- Production build has no runtime errors.

## Assignment Requirement Mapping

| Requirement | Implementation |
| --- | --- |
| Mobile-first responsive design | Tailwind CSS responsive layout, bottom mobile nav, desktop header |
| SPA routing | React Router routes |
| Dynamic attraction list | Fetches `locations.json` asynchronously |
| Search and filtering | Explore page search input and category filters |
| Detailed attraction view | `/attractions/:id` route |
| Favorites system | LocalStorage favorite IDs |
| Visited places | LocalStorage visited IDs |
| Data persistence | LocalStorage and IndexedDB |
| Web API integration | Geolocation API and camera/file capture |
| Google Maps integration | Destination maps and directions links |
| Client-side validation | Profile and image input validation |
| Deployment readiness | Vite build, Netlify config, SPA redirects |

## Viva Explanation Notes

This application is a React single page application built with Vite. It uses React Router for client-side navigation and Tailwind CSS for mobile-first responsive styling.

Attraction data is stored in `public/data/locations.json` and loaded asynchronously with the Fetch API. This acts as a mock REST API for the assignment.

The app uses LocalStorage for small persistent user data such as profile details, favorites, visited places, and the last selected category filter. It uses IndexedDB for travel images because image data can be larger than normal text preferences.

The Geolocation API is used to request the user's real current location. When permission is granted, the app calculates the distance to attractions with the Haversine formula and can show directions from the user's current position to a selected attraction.

The Travel Images feature uses a file input with camera capture support. On mobile browsers, this can open the device camera. Saved travel photos are stored locally in IndexedDB and are not uploaded to a backend.

## Known Limitations

- There is no backend server or authentication system.
- Captured travel images stay only on the same browser and device.
- Profile image is stored as a data URL in LocalStorage, so large images are rejected.
- Google Maps behavior may vary based on browser privacy settings and network access.
- Camera capture depends on browser and device support.

## Submission Notes

Before submitting as a zip file:

- Do not include `node_modules`.
- Do not include `dist` unless specifically required.
- Include the source code, `package.json`, `package-lock.json`, README, and public assets.
- Confirm the app runs with `npm install` and `npm run dev`.

## License

This project is for academic coursework and demonstration purposes.
