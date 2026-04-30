import { GroupedTagSelector } from '../GroupedTagSelector';
import {
  BP_TAG_CATEGORY_DESCRIPTIONS,
  BP_TAG_CATEGORY_LABELS,
  BP_TAG_CATEGORY_ORDER
} from '../../lib/tagCategories';
import type { AppSettings, BpReading, BpTagDefinition } from '../../lib/types';

type BpTagGroupSelectorProps = {
  tags: BpTagDefinition[];
  readings: BpReading[];
  settings: AppSettings;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
  manageLinkTo?: string;
  manageLinkLabel?: string;
};

export function BpTagGroupSelector(props: BpTagGroupSelectorProps) {
  return (
    <GroupedTagSelector
      {...props}
      categoryOrder={BP_TAG_CATEGORY_ORDER}
      categoryLabels={BP_TAG_CATEGORY_LABELS}
      categoryDescriptions={BP_TAG_CATEGORY_DESCRIPTIONS}
      getTagMeta={(tag) => {
        const hasRange =
          tag.systolicMin !== null ||
          tag.systolicMax !== null ||
          tag.diastolicMin !== null ||
          tag.diastolicMax !== null;

        if (!hasRange) {
          return 'No range';
        }

        return `Sys ${tag.systolicMin ?? '-'}-${tag.systolicMax ?? '-'} / Dia ${tag.diastolicMin ?? '-'}-${tag.diastolicMax ?? '-'}`;
      }}
    />
  );
}