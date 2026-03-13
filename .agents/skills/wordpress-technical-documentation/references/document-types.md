# Document Types

Use the correct structure based on the nature of the work.

## Feature document

Use for new capability or meaningful feature expansion.

Mandatory sections:

1. Title
2. Objective
3. Project context
4. Scope
   - Includes
   - Excludes
5. Functional requirements
6. Data model and relationships, if applicable
7. Acceptance criteria
8. Testing strategy

Optional sections:

- WordPress hooks or filters involved
- Block-specific notes
- Theme or plugin integration notes
- Non-functional requirements
- Update log

## Bug document

Use when documenting a defect and the verified fix.

Mandatory sections:

1. Title
2. Problem description
   - Symptoms
   - Example or failing behavior
3. Root cause
4. Implemented solutions
5. Verification
6. Important notes
7. Related files
8. Related commits, if applicable

Optional sections:

- Impact
- Priority
- Workarounds
- Discovery date or fix date

## Improvement document

Use when evolving current behavior without framing it as a defect.

Mandatory sections:

1. Title
2. Objective
3. Project context
4. Scope
   - Includes
   - Excludes
5. Current state
6. Proposed improvements
7. Functional requirements
8. Acceptance criteria
9. Testing strategy

Optional sections:

- Impact analysis
- Migration considerations
- Non-functional requirements
- Technical considerations

## Decision rule

- New capability: feature
- Incorrect behavior: bug
- Better version of acceptable current behavior: improvement
