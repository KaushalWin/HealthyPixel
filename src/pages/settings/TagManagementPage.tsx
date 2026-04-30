import { useState } from 'react';
import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';
import { sortTags } from '../../lib/readingUtils';
import {
  BP_TAG_CATEGORY_LABELS,
  SUGAR_TAG_CATEGORY_LABELS,
  WEIGHT_TAG_CATEGORY_LABELS
} from '../../lib/tagCategories';
import { getInlineTextValidationError } from '../../lib/textValidation';
import type { BpTagDefinition, FoodTagDefinition, SugarTagDefinition, TagDefinition, TagSortMode, VitalModule, WeightTagDefinition } from '../../lib/types';

function parseNullableNumber(value: string) {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const MODULE_LABELS: Record<VitalModule, string> = {
  sugar: 'Sugar',
  weight: 'Weight',
  height: 'Height',
  bp: 'Blood Pressure',
  food: 'Food'
};

const ALL_MODULES: VitalModule[] = ['sugar', 'weight', 'height', 'bp', 'food'];

export function TagManagementPage() {
  const ctx = useAppData();
  const [activeModule, setActiveModule] = useState<VitalModule>('sugar');
  const [newLabel, setNewLabel] = useState('');
  const [sugarCategory, setSugarCategory] = useState<SugarTagDefinition['category']>('general');
  const [weightCategory, setWeightCategory] = useState<WeightTagDefinition['category']>('general');
  const [bpCategory, setBpCategory] = useState<BpTagDefinition['category']>('general');
  const [foodCategory, setFoodCategory] = useState<FoodTagDefinition['category']>('planned');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');
  const [bpSysMin, setBpSysMin] = useState('');
  const [bpSysMax, setBpSysMax] = useState('');
  const [bpDiaMin, setBpDiaMin] = useState('');
  const [bpDiaMax, setBpDiaMax] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const moduleTags = activeModule === 'sugar' ? ctx.tags : activeModule === 'weight' ? ctx.weightTags : activeModule === 'height' ? ctx.heightTags : activeModule === 'food' ? ctx.foodTags : ctx.bpTags;
  const moduleReadings = activeModule === 'sugar' ? ctx.readings : activeModule === 'weight' ? ctx.weightReadings : activeModule === 'height' ? ctx.heightReadings : activeModule === 'food' ? ctx.foodReadings : ctx.bpReadings;
  const orderedTags = sortTags(moduleTags, ctx.settings, moduleReadings);
  const isSugar = activeModule === 'sugar';
  const isWeight = activeModule === 'weight';
  const isBp = activeModule === 'bp';
  const isFood = activeModule === 'food';
  const showsCategorySelector = isSugar || isWeight || isBp || isFood;

  const hasDuplicateTagLabel = (trimmedLabel: string) => {
    const normalizedLabel = trimmedLabel.toLowerCase();

    if (isFood) {
      return (moduleTags as FoodTagDefinition[]).some(
        (tag) => tag.category === foodCategory && tag.label.toLowerCase() === normalizedLabel
      );
    }

    return moduleTags.some((tag) => tag.label.toLowerCase() === normalizedLabel);
  };

  const addModuleTag = () => {
    const labelError = getInlineTextValidationError(newLabel, 'Tag label');
    if (labelError) { setFormError(labelError); return; }

    const trimmedLabel = newLabel.trim();
    if (hasDuplicateTagLabel(trimmedLabel)) {
      setFormError(isFood ? 'Food tag labels must be unique within the selected category.' : 'Tag labels must be unique.');
      return;
    }

    if (isBp) {
      const sMin = parseNullableNumber(bpSysMin);
      const sMax = parseNullableNumber(bpSysMax);
      const dMin = parseNullableNumber(bpDiaMin);
      const dMax = parseNullableNumber(bpDiaMax);
      const createdTag = ctx.addBpTag(trimmedLabel, sMin, sMax, dMin, dMax, bpCategory);
      if (!createdTag) { setFormError('Unable to add tag. Check the label and try again.'); return; }
      setBpSysMin(''); setBpSysMax(''); setBpDiaMin(''); setBpDiaMax('');
    } else {
      const nextMin = parseNullableNumber(rangeMin);
      const nextMax = parseNullableNumber(rangeMax);
      if (nextMin !== null && nextMax !== null && nextMin > nextMax) { setFormError('Range min cannot exceed range max.'); return; }
      if (activeModule === 'sugar') {
        const createdTag = ctx.addTag(trimmedLabel, nextMin, nextMax, sugarCategory);
        if (!createdTag) { setFormError('Unable to add tag. Check the label and try again.'); return; }
      }
      else if (activeModule === 'weight') {
        const createdTag = ctx.addWeightTag(trimmedLabel, nextMin, nextMax, weightCategory);
        if (!createdTag) { setFormError('Unable to add tag. Check the label and try again.'); return; }
      }
      else if (activeModule === 'height') ctx.addHeightTag(trimmedLabel, nextMin, nextMax);
      else {
        const createdTag = ctx.addFoodTag(trimmedLabel, foodCategory, nextMin, nextMax);
        if (!createdTag) { setFormError('Unable to add tag. Check the label and try again.'); return; }
      }
      setRangeMin(''); setRangeMax('');
    }
    setFormError(null);
    setNewLabel('');
  };

  const updateModuleTag = (tagId: string, updates: Partial<TagDefinition> | Partial<SugarTagDefinition> | Partial<WeightTagDefinition> | Partial<BpTagDefinition> | Partial<FoodTagDefinition>) => {
    if (activeModule === 'sugar') ctx.updateTag(tagId, updates as any);
    else if (activeModule === 'weight') ctx.updateWeightTag(tagId, updates as any);
    else if (activeModule === 'height') ctx.updateHeightTag(tagId, updates as any);
    else if (activeModule === 'food') ctx.updateFoodTag(tagId, updates as any);
    else ctx.updateBpTag(tagId, updates as any);
  };

  const removeModuleTag = (tagId: string) => {
    if (activeModule === 'sugar') ctx.removeTag(tagId);
    else if (activeModule === 'weight') ctx.removeWeightTag(tagId);
    else if (activeModule === 'height') ctx.removeHeightTag(tagId);
    else if (activeModule === 'food') ctx.removeFoodTag(tagId);
    else ctx.removeBpTag(tagId);
  };

  return (
    <SiteShell title="Tag Settings" subtitle="Control tag order, ranges, removal, and custom-tag creation per module.">
      <div className="module-tabs" role="tablist">
        {ALL_MODULES.map((m) => (
          <button key={m} type="button" role="tab" className={activeModule === m ? 'module-tab active' : 'module-tab'} aria-selected={activeModule === m} onClick={() => { setActiveModule(m); setFormError(null); }}>
            {MODULE_LABELS[m]}
          </button>
        ))}
      </div>

      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div><h2>Selector ordering</h2><p>Tag ordering affects the reading form, list filters, and chart filters.</p></div>
        </div>
        <label className="date-time-picker__field">
          <span>Sort tags by</span>
          <select className="form-select" value={ctx.settings.tagSortMode} onChange={(e) => ctx.updateSettings({ tagSortMode: e.target.value as TagSortMode })}>
            <option value="recentlyUsed">Recently used</option>
            <option value="popular">Popular</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="creationDate">Creation date</option>
          </select>
        </label>
        <label className="date-time-picker__field">
          <span>Popular timeframe in days</span>
          <input type="number" min="1" max="365" value={ctx.settings.popularWindowDays} onChange={(e) => ctx.updateSettings({ popularWindowDays: Number(e.target.value) || 14 })} />
        </label>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div><h2>Add custom tag ({MODULE_LABELS[activeModule]})</h2><p>Create a custom label and optional healthy range.</p></div>
        </div>
        {isBp ? (
          <>
            <div className="two-column-grid">
              <label className="date-time-picker__field"><span>Label</span><input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} /></label>
              <label className="date-time-picker__field">
                <span>Category</span>
                <select className="form-select" value={bpCategory} onChange={(e) => setBpCategory(e.target.value as BpTagDefinition['category'])}>
                  {Object.entries(BP_TAG_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
            </div>
            <div className="four-column-grid">
              <label className="date-time-picker__field"><span>Systolic min</span><input type="number" value={bpSysMin} onChange={(e) => setBpSysMin(e.target.value)} /></label>
              <label className="date-time-picker__field"><span>Systolic max</span><input type="number" value={bpSysMax} onChange={(e) => setBpSysMax(e.target.value)} /></label>
              <label className="date-time-picker__field"><span>Diastolic min</span><input type="number" value={bpDiaMin} onChange={(e) => setBpDiaMin(e.target.value)} /></label>
              <label className="date-time-picker__field"><span>Diastolic max</span><input type="number" value={bpDiaMax} onChange={(e) => setBpDiaMax(e.target.value)} /></label>
            </div>
          </>
        ) : isFood ? (
          <div className="four-column-grid">
            <label className="date-time-picker__field"><span>Label</span><input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} /></label>
            <label className="date-time-picker__field">
              <span>Category</span>
              <select className="form-select" value={foodCategory} onChange={(e) => setFoodCategory(e.target.value as FoodTagDefinition['category'])}>
                <option value="planned">Planned</option>
                <option value="actual">Actual</option>
                <option value="context">Context</option>
                <option value="behavior">Behavior</option>
              </select>
            </label>
            <label className="date-time-picker__field"><span>Range min</span><input type="number" value={rangeMin} onChange={(e) => setRangeMin(e.target.value)} /></label>
            <label className="date-time-picker__field"><span>Range max</span><input type="number" value={rangeMax} onChange={(e) => setRangeMax(e.target.value)} /></label>
          </div>
        ) : showsCategorySelector ? (
          <div className="four-column-grid">
            <label className="date-time-picker__field"><span>Label</span><input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} /></label>
            <label className="date-time-picker__field">
              <span>Category</span>
              <select className="form-select" value={isSugar ? sugarCategory : weightCategory} onChange={(e) => {
                if (isSugar) setSugarCategory(e.target.value as SugarTagDefinition['category']);
                else setWeightCategory(e.target.value as WeightTagDefinition['category']);
              }}>
                {(isSugar ? Object.entries(SUGAR_TAG_CATEGORY_LABELS) : Object.entries(WEIGHT_TAG_CATEGORY_LABELS)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="date-time-picker__field"><span>Range min</span><input type="number" value={rangeMin} onChange={(e) => setRangeMin(e.target.value)} /></label>
            <label className="date-time-picker__field"><span>Range max</span><input type="number" value={rangeMax} onChange={(e) => setRangeMax(e.target.value)} /></label>
          </div>
        ) : (
          <div className="three-column-grid">
            <label className="date-time-picker__field"><span>Label</span><input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} /></label>
            <label className="date-time-picker__field"><span>Range min</span><input type="number" value={rangeMin} onChange={(e) => setRangeMin(e.target.value)} /></label>
            <label className="date-time-picker__field"><span>Range max</span><input type="number" value={rangeMax} onChange={(e) => setRangeMax(e.target.value)} /></label>
          </div>
        )}
        <div className="action-row compact"><button type="button" className="primary-button" onClick={addModuleTag}>Add tag</button></div>
        {formError ? <p className="field-error">{formError}</p> : null}
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div><h2>Edit existing tags ({MODULE_LABELS[activeModule]})</h2><p>Tags can be renamed, re-ranged, or removed.</p></div>
        </div>
        <div className="settings-list-grid">
          {orderedTags.map((tag) => (
            <article key={tag.id} className="settings-list-item">
              {isBp ? (
                <>
                  <div className="two-column-grid align-end">
                    {tag.type === 'custom' ? (
                      <label className="date-time-picker__field"><span>Label</span><input value={tag.label} onChange={(e) => updateModuleTag(tag.id, { label: e.target.value })} /></label>
                    ) : (
                      <div className="tag-static-field"><span>Built-in label</span><strong>{tag.label}</strong></div>
                    )}
                    {tag.type === 'custom' ? (
                      <label className="date-time-picker__field">
                        <span>Category</span>
                        <select className="form-select" value={(tag as BpTagDefinition).category} onChange={(e) => updateModuleTag(tag.id, { category: e.target.value as BpTagDefinition['category'] })}>
                          {Object.entries(BP_TAG_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </label>
                    ) : (
                      <div className="tag-static-field"><span>Category</span><strong>{BP_TAG_CATEGORY_LABELS[(tag as BpTagDefinition).category]}</strong></div>
                    )}
                  </div>
                  <div className="four-column-grid align-end">
                    <label className="date-time-picker__field"><span>Sys min</span><input type="number" value={(tag as BpTagDefinition).systolicMin ?? ''} onChange={(e) => updateModuleTag(tag.id, { systolicMin: parseNullableNumber(e.target.value) })} /></label>
                    <label className="date-time-picker__field"><span>Sys max</span><input type="number" value={(tag as BpTagDefinition).systolicMax ?? ''} onChange={(e) => updateModuleTag(tag.id, { systolicMax: parseNullableNumber(e.target.value) })} /></label>
                    <label className="date-time-picker__field"><span>Dia min</span><input type="number" value={(tag as BpTagDefinition).diastolicMin ?? ''} onChange={(e) => updateModuleTag(tag.id, { diastolicMin: parseNullableNumber(e.target.value) })} /></label>
                    <label className="date-time-picker__field"><span>Dia max</span><input type="number" value={(tag as BpTagDefinition).diastolicMax ?? ''} onChange={(e) => updateModuleTag(tag.id, { diastolicMax: parseNullableNumber(e.target.value) })} /></label>
                  </div>
                </>
              ) : isFood ? (
                <div className="four-column-grid align-end">
                  {tag.type === 'custom' ? (
                    <label className="date-time-picker__field"><span>Label</span><input value={tag.label} onChange={(e) => updateModuleTag(tag.id, { label: e.target.value })} /></label>
                  ) : (
                    <div className="tag-static-field"><span>Built-in label</span><strong>{tag.label}</strong></div>
                  )}
                  {tag.type === 'custom' ? (
                    <label className="date-time-picker__field">
                      <span>Category</span>
                      <select className="form-select" value={(tag as FoodTagDefinition).category} onChange={(e) => updateModuleTag(tag.id, { category: e.target.value as FoodTagDefinition['category'] })}>
                        <option value="planned">Planned</option>
                        <option value="actual">Actual</option>
                        <option value="context">Context</option>
                        <option value="behavior">Behavior</option>
                      </select>
                    </label>
                  ) : (
                    <div className="tag-static-field"><span>Category</span><strong>{(tag as FoodTagDefinition).category}</strong></div>
                  )}
                  <label className="date-time-picker__field">
                    <span>Range min</span>
                    <input type="number" value={tag.rangeMin ?? ''} onChange={(e) => {
                      const nextMin = parseNullableNumber(e.target.value);
                      const resolvedMax = tag.rangeMax !== null && nextMin !== null && nextMin > tag.rangeMax ? nextMin : tag.rangeMax;
                      updateModuleTag(tag.id, { rangeMin: nextMin, rangeMax: resolvedMax });
                    }} />
                  </label>
                  <label className="date-time-picker__field"><span>Range max</span><input type="number" value={tag.rangeMax ?? ''} onChange={(e) => updateModuleTag(tag.id, { rangeMax: parseNullableNumber(e.target.value) })} /></label>
                </div>
              ) : (
                <div className={activeModule === 'height' ? 'three-column-grid align-end' : 'four-column-grid align-end'}>
                  {tag.type === 'custom' ? (
                    <label className="date-time-picker__field"><span>Label</span><input value={tag.label} onChange={(e) => updateModuleTag(tag.id, { label: e.target.value })} /></label>
                  ) : (
                    <div className="tag-static-field"><span>Built-in label</span><strong>{tag.label}</strong></div>
                  )}
                  {activeModule === 'sugar' ? (
                    tag.type === 'custom' ? (
                      <label className="date-time-picker__field">
                        <span>Category</span>
                        <select className="form-select" value={(tag as SugarTagDefinition).category} onChange={(e) => updateModuleTag(tag.id, { category: e.target.value as SugarTagDefinition['category'] })}>
                          {Object.entries(SUGAR_TAG_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </label>
                    ) : (
                      <div className="tag-static-field"><span>Category</span><strong>{SUGAR_TAG_CATEGORY_LABELS[(tag as SugarTagDefinition).category]}</strong></div>
                    )
                  ) : null}
                  {activeModule === 'weight' ? (
                    tag.type === 'custom' ? (
                      <label className="date-time-picker__field">
                        <span>Category</span>
                        <select className="form-select" value={(tag as WeightTagDefinition).category} onChange={(e) => updateModuleTag(tag.id, { category: e.target.value as WeightTagDefinition['category'] })}>
                          {Object.entries(WEIGHT_TAG_CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </label>
                    ) : (
                      <div className="tag-static-field"><span>Category</span><strong>{WEIGHT_TAG_CATEGORY_LABELS[(tag as WeightTagDefinition).category]}</strong></div>
                    )
                  ) : null}
                  <label className="date-time-picker__field">
                    <span>Range min</span>
                    <input type="number" value={tag.rangeMin ?? ''} onChange={(e) => {
                      const nextMin = parseNullableNumber(e.target.value);
                      const resolvedMax = tag.rangeMax !== null && nextMin !== null && nextMin > tag.rangeMax ? nextMin : tag.rangeMax;
                      updateModuleTag(tag.id, { rangeMin: nextMin, rangeMax: resolvedMax });
                    }} />
                  </label>
                  <label className="date-time-picker__field"><span>Range max</span><input type="number" value={tag.rangeMax ?? ''} onChange={(e) => updateModuleTag(tag.id, { rangeMax: parseNullableNumber(e.target.value) })} /></label>
                </div>
              )}
              <div className="action-row compact">
                <button type="button" className="secondary-button danger small" onClick={() => removeModuleTag(tag.id)}>Remove tag</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}