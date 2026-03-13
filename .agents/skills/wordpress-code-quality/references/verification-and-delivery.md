# WordPress Verification And Delivery

Use this reference to choose a verification strategy and keep change sets reviewable.

## Verification strategy

Choose the strongest available option:

1. Automated tests when infrastructure already exists
2. Focused manual verification in WordPress when tests do not exist
3. Both, when the risk justifies it

## If automated tests exist

- Start with a failing test when adding new behavior.
- Keep tests focused on one behavior each.
- Prefer fast, targeted execution over broad suite runs.
- For browser tests, run the affected spec or a narrow grep, not the entire suite.

## If automated tests do not exist

Manual verification is required:

1. Establish a baseline before editing.
2. Verify immediately after each meaningful change.
3. Check both admin and frontend when relevant.
4. Review the WordPress debug log.
5. Check console errors when JS or blocks are involved.
6. Note any gaps you could not verify.

## Change-set discipline

- Keep the change focused on one problem or one feature slice.
- Avoid mixing feature work with unrelated formatting or refactors.
- Aim for a PR or delivery unit that is easy to review quickly.
- If the diff becomes broad, split it before closing the work.

## Suggested closure checklist

- Relevant quality checks passed
- Manual verification or automated tests executed
- Debug log reviewed where applicable
- Risks and limitations documented
- Public interface or operator-facing docs updated if behavior changed
