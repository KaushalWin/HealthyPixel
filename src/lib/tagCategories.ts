import type {
  BpTagCategory,
  BpTagDefinition,
  SugarTagCategory,
  SugarTagDefinition,
  TagDefinition,
  WeightTagCategory,
  WeightTagDefinition
} from './types';

type LegacyCategorizedTag = TagDefinition & {
  category?: string | null;
};

type LegacyBpTagDefinition = Omit<BpTagDefinition, 'category'> & {
  category?: string | null;
};

export const SUGAR_TAG_CATEGORY_ORDER: SugarTagCategory[] = [
  'timing',
  'activity',
  'context',
  'general'
];

export const SUGAR_TAG_CATEGORY_LABELS: Record<SugarTagCategory, string> = {
  timing: 'Timing tags',
  activity: 'Activity tags',
  context: 'Context tags',
  general: 'General tags'
};

export const SUGAR_TAG_CATEGORY_CHART_COLORS: Record<SugarTagCategory, string> = {
  timing: '#2176d2',
  activity: '#14804f',
  context: '#d97706',
  general: '#6b7280'
};

export const SUGAR_TAG_CATEGORY_DESCRIPTIONS: Record<SugarTagCategory, string> = {
  timing: 'When the reading happened in the day.',
  activity: 'Exercise or movement around the reading.',
  context: 'Situation or lifestyle context for the reading.',
  general: 'Migrated or uncategorized custom tags.'
};

export const WEIGHT_TAG_CATEGORY_ORDER: WeightTagCategory[] = [
  'timing',
  'bodyState',
  'routine',
  'general'
];

export const WEIGHT_TAG_CATEGORY_LABELS: Record<WeightTagCategory, string> = {
  timing: 'Timing tags',
  bodyState: 'Body state tags',
  routine: 'Routine tags',
  general: 'General tags'
};

export const WEIGHT_TAG_CATEGORY_DESCRIPTIONS: Record<WeightTagCategory, string> = {
  timing: 'When the weigh-in happened.',
  bodyState: 'What state your body was in around the weigh-in.',
  routine: 'Routine context for recurring check-ins.',
  general: 'Migrated or uncategorized custom tags.'
};

export const BP_TAG_CATEGORY_ORDER: BpTagCategory[] = [
  'timing',
  'bodyState',
  'context',
  'general'
];

export const BP_TAG_CATEGORY_LABELS: Record<BpTagCategory, string> = {
  timing: 'Timing tags',
  bodyState: 'Body state tags',
  context: 'Context tags',
  general: 'General tags'
};

export const BP_TAG_CATEGORY_CHART_COLORS: Record<BpTagCategory, string> = {
  timing: '#2176d2',
  bodyState: '#d64045',
  context: '#14804f',
  general: '#6b7280'
};

export const BP_TAG_CATEGORY_DESCRIPTIONS: Record<BpTagCategory, string> = {
  timing: 'When the blood pressure reading happened.',
  bodyState: 'Resting, exercise, or body-condition context.',
  context: 'Lifestyle or situational context for the reading.',
  general: 'Migrated or uncategorized custom tags.'
};

const SUGAR_TIMING_TAG_IDS = new Set([
  'pre-breakfast',
  'post-breakfast',
  'pre-lunch',
  'post-lunch',
  'pre-dinner',
  'post-dinner',
  'pre-snack',
  'post-snack',
  'fasting'
]);

const SUGAR_ACTIVITY_TAG_IDS = new Set(['pre-exercise', 'post-exercise']);

const SUGAR_CONTEXT_TAG_IDS = new Set(['random', 'weekend', 'cheat']);

const WEIGHT_TIMING_TAG_IDS = new Set(['w-morning', 'w-evening']);

const WEIGHT_BODY_STATE_TAG_IDS = new Set([
  'w-fasting',
  'w-pre-exercise',
  'w-post-exercise'
]);

const WEIGHT_ROUTINE_TAG_IDS = new Set(['w-random']);

const BP_TIMING_TAG_IDS = new Set(['bp-morning', 'bp-evening']);

const BP_BODY_STATE_TAG_IDS = new Set([
  'bp-resting',
  'bp-pre-exercise',
  'bp-post-exercise'
]);

const BP_CONTEXT_TAG_IDS = new Set(['bp-random']);

function isAllowedCategory<TCategory extends string>(
  value: unknown,
  allowed: readonly TCategory[]
): value is TCategory {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

function inferSugarTagCategory(tag: Pick<TagDefinition, 'id' | 'type'>): SugarTagCategory {
  if (SUGAR_TIMING_TAG_IDS.has(tag.id)) {
    return 'timing';
  }

  if (SUGAR_ACTIVITY_TAG_IDS.has(tag.id)) {
    return 'activity';
  }

  if (SUGAR_CONTEXT_TAG_IDS.has(tag.id)) {
    return 'context';
  }

  return tag.type === 'custom' ? 'general' : 'general';
}

function inferWeightTagCategory(tag: Pick<TagDefinition, 'id' | 'type'>): WeightTagCategory {
  if (WEIGHT_TIMING_TAG_IDS.has(tag.id)) {
    return 'timing';
  }

  if (WEIGHT_BODY_STATE_TAG_IDS.has(tag.id)) {
    return 'bodyState';
  }

  if (WEIGHT_ROUTINE_TAG_IDS.has(tag.id)) {
    return 'routine';
  }

  return tag.type === 'custom' ? 'general' : 'general';
}

function inferBpTagCategory(tag: Pick<BpTagDefinition, 'id' | 'type'>): BpTagCategory {
  if (BP_TIMING_TAG_IDS.has(tag.id)) {
    return 'timing';
  }

  if (BP_BODY_STATE_TAG_IDS.has(tag.id)) {
    return 'bodyState';
  }

  if (BP_CONTEXT_TAG_IDS.has(tag.id)) {
    return 'context';
  }

  return tag.type === 'custom' ? 'general' : 'general';
}

export function normalizeSugarTag(tag: LegacyCategorizedTag): SugarTagDefinition {
  return {
    ...tag,
    category: isAllowedCategory(tag.category, SUGAR_TAG_CATEGORY_ORDER)
      ? tag.category
      : inferSugarTagCategory(tag)
  };
}

export function normalizeWeightTag(tag: LegacyCategorizedTag): WeightTagDefinition {
  return {
    ...tag,
    category: isAllowedCategory(tag.category, WEIGHT_TAG_CATEGORY_ORDER)
      ? tag.category
      : inferWeightTagCategory(tag)
  };
}

export function normalizeBpTag(tag: LegacyBpTagDefinition): BpTagDefinition {
  return {
    ...tag,
    category: isAllowedCategory(tag.category, BP_TAG_CATEGORY_ORDER)
      ? tag.category
      : inferBpTagCategory(tag)
  };
}

export function groupTagsByCategory<TCategory extends string, TTag extends { category: TCategory }>(
  tags: TTag[],
  categoryOrder: readonly TCategory[]
) {
  return categoryOrder.reduce<Record<TCategory, TTag[]>>((grouped, category) => {
    grouped[category] = tags.filter((tag) => tag.category === category);
    return grouped;
  }, Object.fromEntries(categoryOrder.map((category) => [category, []])) as unknown as Record<TCategory, TTag[]>);
}