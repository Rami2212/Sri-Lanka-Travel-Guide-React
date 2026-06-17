import { useState } from 'react';

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const Profile = ({ profile, onSaveProfile }) => {
  const [name, setName] = useState(profile.name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [image, setImage] = useState(profile.image || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setSuccess('');
      return;
    }

    if (file.size > 900000) {
      setError('Profile image must be smaller than 900 KB for LocalStorage.');
      setSuccess('');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImage(dataUrl);
      setError('');
      setSuccess('Profile image ready. Save profile to keep it locally.');
    } catch {
      setError('Could not read this profile image. Please try another file.');
      setSuccess('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedBio = bio.trim();

    if (trimmedName.length < 2) {
      setError('Name must contain at least 2 characters.');
      setSuccess('');
      return;
    }

    if (trimmedName.length > 40) {
      setError('Name must be 40 characters or fewer.');
      setSuccess('');
      return;
    }

    if (trimmedBio.length > 140) {
      setError('Bio must be 140 characters or fewer.');
      setSuccess('');
      return;
    }

    onSaveProfile({ name: trimmedName, bio: trimmedBio, image });
    setError('');
    setSuccess('Profile saved locally.');
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <header className="lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8">
        <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-lagoon-700">Profile</p>
        <h1 className="font-display text-4xl font-black text-slate-950 lg:text-6xl">Traveler profile</h1>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600 lg:text-base lg:font-semibold lg:leading-8">
          Add a name, a short bio, and a profile image to make this travel dashboard your own.
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-6">
        <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 bg-cover bg-center p-6 text-white shadow-soft lg:sticky lg:top-28 lg:min-h-[420px] lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/88 via-cyan-800/72 to-sky-500/42" />
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cinnamon-400/30 blur-3xl" />
          <div className="absolute -bottom-20 left-8 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">Preview</p>
            <div className="mt-5 h-32 w-32 overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-card lg:h-40 lg:w-40">
              {image ? (
                <img src={image} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-lagoon-900/40 font-display text-4xl font-black text-cyan-50">
                  {(name || profile.name || 'T').trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="mt-2 font-display text-4xl font-black lg:text-6xl">
              {name.trim() || profile.name || 'Traveler'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-200 lg:text-base lg:leading-8">
              {bio.trim() || profile.bio || 'Add a short bio to personalize your travel dashboard.'}
            </p>
          </div>
        </section>

        <form
          className="mt-5 space-y-4 rounded-[2rem] bg-white/90 p-5 shadow-soft lg:mt-0 lg:rounded-[2.5rem] lg:p-7"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Profile image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block min-h-14 w-full cursor-pointer rounded-3xl border border-dashed border-lagoon-300 bg-lagoon-50 p-4 text-sm font-bold text-lagoon-900 file:mr-4 file:rounded-2xl file:border-0 file:bg-lagoon-900 file:px-4 file:py-3 file:text-sm file:font-black file:text-white"
            />
            {image ? (
              <button
                type="button"
                className="mt-3 min-h-11 rounded-2xl bg-slate-100 px-4 text-sm font-black text-slate-600"
                onClick={() => setImage('')}
              >
                Remove profile image
              </button>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-14 w-full rounded-3xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-900 outline-none focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-100"
              placeholder="Your name"
              minLength={2}
              maxLength={40}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Bio</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="min-h-32 w-full resize-none rounded-3xl border border-slate-200 bg-white px-5 py-4 text-base font-bold text-slate-900 outline-none focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-100 lg:min-h-44"
              placeholder="A short travel note"
              maxLength={140}
            />
            <span className="mt-2 block text-right text-xs font-bold text-slate-500">{bio.length}/140</span>
          </label>

          {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
          {success ? <p className="text-sm font-bold text-palm-700">{success}</p> : null}

          <button
            type="submit"
            className="min-h-14 w-full rounded-2xl bg-lagoon-900 px-5 text-sm font-black text-white shadow-lg shadow-lagoon-900/20"
          >
            Save profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
