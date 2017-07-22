export const CHANGE_OUTPUT = '@@session/CHANGE_OUTPUT';

// consts - not event types
export const OUTPUT_NONE = 'OUTPUT_NONE';
export const OUTPUT_CONSOLE = 'OUTPUT_CONSOLE';
export const OUTPUT_PAGE = 'OUTPUT_PAGE';
export const OUTPUT_BOTH = 'OUTPUT_BOTH';

// note: value should be in OUTPUT_*
export function changeOutput(value) {
  return { type: CHANGE_OUTPUT, value };
}
