# Block Quality Checklist

Use this reference while implementing or reviewing a WordPress block.

## Data and editor rules

- Use `@wordpress/data` and `@wordpress/core-data` before custom fetch layers.
- Keep `useSelect` focused to avoid unnecessary rerenders.
- Preload or cache data when the editor would otherwise refetch heavily.
- Keep inspector controls aligned with the supported editing model.

## Frontend behavior

- Do not default to React on the frontend.
- Use `view.js` only when the block needs client interaction.
- Consider the Interactivity API for richer interactive behavior when the repository supports it.
- Load scripts conditionally whenever possible.

## Accessibility

- Ensure semantic heading and landmark structure.
- Keep controls keyboard accessible.
- Preserve visible focus states.
- Validate labels, names, and announcements for interactive UI.

## Security

- Escape and sanitize SSR output.
- Validate REST input and capabilities on custom endpoints.
- Avoid unsafe DOM insertion patterns on the frontend.

## Verification checklist

- Block appears in the inserter
- Block can be configured in the editor
- Attributes persist correctly
- Frontend render matches the intended output
- Styles load in the correct contexts
- No new PHP errors in debug log
- No new console errors for editor or frontend
- SSR/static decision is still justified
