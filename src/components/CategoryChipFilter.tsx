type CategoryChipFilterProps<TCategory extends string> = {
  title: string;
  helperText?: string;
  categories: readonly TCategory[];
  categoryLabels: Record<TCategory, string>;
  selectedCategories: TCategory[];
  onChange: (categories: TCategory[]) => void;
};

export function CategoryChipFilter<TCategory extends string>({
  title,
  helperText,
  categories,
  categoryLabels,
  selectedCategories,
  onChange
}: CategoryChipFilterProps<TCategory>) {
  return (
    <section className="filter-card" aria-label={title}>
      <div className="section-header-inline">
        <div>
          <h3>{title}</h3>
          {helperText ? <p>{helperText}</p> : null}
        </div>
      </div>

      <div className="preset-chip-row">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);

          return (
            <button
              key={category}
              type="button"
              className={isSelected ? 'tag-chip active' : 'tag-chip'}
              onClick={() => {
                if (isSelected) {
                  onChange(selectedCategories.filter((value) => value !== category));
                  return;
                }

                onChange([...selectedCategories, category]);
              }}
            >
              {categoryLabels[category]}
            </button>
          );
        })}
      </div>

      <p className="tag-selector__selected-summary">
        {selectedCategories.length === 0
          ? 'No categories selected.'
          : `${selectedCategories.length} selected: ${selectedCategories
              .map((category) => categoryLabels[category])
              .join(', ')}`}
      </p>
    </section>
  );
}