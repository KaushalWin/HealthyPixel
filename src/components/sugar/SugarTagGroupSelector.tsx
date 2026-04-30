import { GroupedTagSelector } from '../GroupedTagSelector';
import {
  SUGAR_TAG_CATEGORY_DESCRIPTIONS,
  SUGAR_TAG_CATEGORY_LABELS,
  SUGAR_TAG_CATEGORY_ORDER
} from '../../lib/tagCategories';
import type { AppSettings, SugarReading, SugarTagDefinition } from '../../lib/types';

type SugarTagGroupSelectorProps = {
  tags: SugarTagDefinition[];
  readings: SugarReading[];
  settings: AppSettings;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
  manageLinkTo?: string;
  manageLinkLabel?: string;
};

export function SugarTagGroupSelector(props: SugarTagGroupSelectorProps) {
  return (
    <GroupedTagSelector
      {...props}
      categoryOrder={SUGAR_TAG_CATEGORY_ORDER}
      categoryLabels={SUGAR_TAG_CATEGORY_LABELS}
      categoryDescriptions={SUGAR_TAG_CATEGORY_DESCRIPTIONS}
      getTagMeta={(tag) =>
        tag.rangeMin !== null || tag.rangeMax !== null
          ? `${tag.rangeMin ?? '-'} to ${tag.rangeMax ?? '-'}`
          : 'No range'
      }
    />
  );
}