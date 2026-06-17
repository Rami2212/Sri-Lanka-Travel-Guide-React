const DB_NAME = 'sri-lanka-travel-guide';
const DB_VERSION = 1;
const STORE_NAME = 'travelImages';

const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('attractionId', 'attractionId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runTransaction = async (mode, action) => {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
};

export const saveTravelImage = async ({ attractionId, attractionName, dataUrl }) => {
  const image = {
    id: crypto.randomUUID(),
    attractionId,
    attractionName,
    dataUrl,
    createdAt: new Date().toISOString(),
  };

  await runTransaction('readwrite', (store) => store.add(image));
  return image;
};

export const getAllTravelImages = async () => {
  const images = await runTransaction('readonly', (store) => store.getAll());
  return images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const deleteTravelImage = async (id) => {
  await runTransaction('readwrite', (store) => store.delete(id));
};
