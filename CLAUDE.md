# email-tone

A scalar function that scores how appropriate an email's tone is for its intended context.

## Input Schema
- `email` (string, required) - The email text to evaluate
- `context` (string, required) - Free-form description of the situation/audience

## Task
Single `vector.completion` with 4 responses:
1. "The tone is perfectly appropriate for this context"
2. "The tone is mostly appropriate with minor issues"
3. "The tone is somewhat inappropriate for this context"
4. "The tone is highly inappropriate for this context"

## Output
Score in [0, 1] where 1 = perfectly appropriate tone.
Formula: `scores[0] + (scores[1] * 0.66) + (scores[2] * 0.33)`
