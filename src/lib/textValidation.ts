const INLINE_CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/;

export function getInlineTextValidationError(value: string, fieldLabel: string) {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return `${fieldLabel} is required.`;
  }

  if (INLINE_CONTROL_CHARACTER_PATTERN.test(trimmedValue)) {
    return `${fieldLabel} cannot contain control characters.`;
  }

  return null;
}