import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { deleteTravelImage, getAllTravelImages, saveTravelImage } from '../utils/indexedDb';

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const TravelImages = ({ attractions, onImagesChanged }) => {
  const [searchParams] = useSearchParams();
  const requestedAttractionId = searchParams.get('attraction');
  const [images, setImages] = useState([]);
  const [selectedAttractionId, setSelectedAttractionId] = useState('');
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await getAllTravelImages();
        setImages(storedImages);
        onImagesChanged(storedImages.length);
      } catch (error) {
        setFormError(error.message);
      }
    };

    loadImages();
  }, [onImagesChanged]);

  const requestedAttractionExists = attractions.some((attraction) => attraction.id === requestedAttractionId);
  const selectedAttractionExists = attractions.some((attraction) => attraction.id === selectedAttractionId);
  const activeAttractionId = selectedAttractionExists
    ? selectedAttractionId
    : requestedAttractionExists
      ? requestedAttractionId
      : attractions[0]?.id || '';
  const selectedAttraction = attractions.find((attraction) => attraction.id === activeAttractionId);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPreview('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file captured from the camera or gallery.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFile(file);
      setPreview(dataUrl);
      setFormError('');
    } catch {
      setFormError('Could not read this image. Please try another file.');
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedAttraction) {
      setFormError('Please select an attraction before saving a travel photo.');
      return;
    }

    if (!selectedFile || !preview) {
      setFormError('Please capture or choose an image before saving.');
      return;
    }

    try {
      setSaving(true);
      const savedImage = await saveTravelImage({
        attractionId: selectedAttraction.id,
        attractionName: selectedAttraction.name,
        dataUrl: preview,
      });
      const nextImages = [savedImage, ...images];
      setImages(nextImages);
      onImagesChanged(nextImages.length);
      setSelectedFile(null);
      setPreview('');
      setFormError('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setFormError(error.message || 'Could not save this image in IndexedDB.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTravelImage(id);
    const nextImages = images.filter((image) => image.id !== id);
    setImages(nextImages);
    onImagesChanged(nextImages.length);
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <header className="space-y-2 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8">
        <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-lagoon-700">Memories</p>
        <h1 className="font-display text-4xl font-black text-slate-950 lg:text-6xl">Travel images</h1>
        </div>
        <p className="text-sm leading-6 text-slate-600 lg:text-base lg:font-semibold lg:leading-8">
          Capture images using a mobile camera or add photos from your gallery.
        </p>
      </header>

      <section className="lg:grid lg:grid-cols-[0.55fr_1.45fr] lg:gap-6">
        <form
          className="space-y-4 rounded-[2rem] bg-white/90 p-5 shadow-soft lg:sticky lg:top-28 lg:self-start lg:rounded-[2.5rem] lg:p-5"
          onSubmit={handleSave}
          noValidate
        >
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Link photo to attraction</span>
            <select
              value={activeAttractionId}
              onChange={(event) => setSelectedAttractionId(event.target.value)}
              className="min-h-14 w-full rounded-3xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-900 outline-none focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-100"
              required
            >
              {attractions.map((attraction) => (
                <option key={attraction.id} value={attraction.id}>
                  {attraction.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Capture or choose image</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="block min-h-14 w-full cursor-pointer rounded-3xl border border-dashed border-lagoon-300 bg-lagoon-50 p-4 text-sm font-bold text-lagoon-900 file:mr-4 file:rounded-2xl file:border-0 file:bg-lagoon-900 file:px-4 file:py-3 file:text-sm file:font-black file:text-white"
              required
            />
          </label>

          {preview ? (
            <img
              src={preview}
              alt="Selected travel preview"
              className="h-64 w-full rounded-[2rem] object-cover shadow-card"
            />
          ) : null}

          {formError ? <p className="text-sm font-bold text-red-600">{formError}</p> : null}

          <button
            type="submit"
            className="min-h-14 w-full rounded-2xl bg-cinnamon-500 px-5 text-sm font-black text-white shadow-lg shadow-cinnamon-500/25 disabled:cursor-wait disabled:opacity-70"
            disabled={saving}
          >
            {saving ? 'Saving image...' : 'Save image to IndexedDB'}
          </button>
        </form>

        <div className="mt-6 lg:mt-0">
          {images.length === 0 ? (
            <EmptyState
              title="No travel photos saved"
              message="Use the camera input above to create a local image log for attractions you visit."
              action={
                <Link
                  to="/attractions"
                  className="inline-flex min-h-12 items-center rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white"
                >
                  Choose an attraction
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {images.map((image) => (
                <article key={image.id} className="overflow-hidden rounded-[2rem] bg-white/90 shadow-card">
                  <img src={image.dataUrl} alt={image.attractionName} className="h-56 w-full object-cover" />
                  <div className="space-y-3 p-4">
                    <div>
                      <h2 className="font-display text-xl font-black text-slate-950">{image.attractionName}</h2>
                      <p className="text-sm font-bold text-slate-500">
                        {new Date(image.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="min-h-12 w-full rounded-2xl bg-red-50 px-5 text-sm font-black text-red-700"
                      onClick={() => handleDelete(image.id)}
                    >
                      Delete local image
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TravelImages;
