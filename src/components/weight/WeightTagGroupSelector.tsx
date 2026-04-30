import { GroupedTagSelector } from '../GroupedTagSelector';
import {
  WEIGHT_TAG_CATEGORY_DESCRIPTIONS,
  WEIGHT_TAG_CATEGORY_LABELS,
  WEIGHT_TAG_CATEGORY_ORDER
} from '../../lib/tagCategories';
import type { AppSettings, WeightReading, WeightTagDefinition } from '../../lib/types';

type WeightTagGroupSelectorProps = {
  tags: WeightTagDefinition[];
  readings: WeightReading[];
  settings: AppSettings;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
  manageLinkTo?: string;
  manageLinkLabel?: string;
};

export function WeightTagGroupSelector(props: WeightTagGroupSelectorProps) {
  return (
    <GroupedTagSelector
      {...props}
      categoryOrder={WEIGHT_TAG_CATEGORY_ORDER}
      categoryLabels={WEIGHT_TAG_CATEGORY_LABELS}
      categoryDescriptions={WEIGHT_TAG_CATEGORY_DESCRIPTIONS}
      getTagMeta={(tag) =>
        tag.rangeMin !== null || tag.rangeMax !== null
          ? `${tag.rangeMin ?? '-'} to ${tag.rangeMax ?? '-'} kg`
          : 'No range'
      }
    />
  );
}