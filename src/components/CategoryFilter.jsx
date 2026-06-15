const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:overflow-visible lg:pb-0">
    <div className="flex min-w-max gap-2 lg:min-w-0 lg:flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`min-h-10 rounded-full px-4 text-sm font-black transition lg:min-h-11 lg:px-4 ${
            selectedCategory === category
              ? 'bg-lagoon-900 text-white shadow-lg shadow-lagoon-900/20'
              : 'bg-white/85 text-slate-600 shadow-sm'
          }`}
          aria-pressed={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryFilter;
