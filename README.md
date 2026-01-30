# email-tone

A scalar function that scores how appropriate an email's tone is for its intended context.

## Overview

This ObjectiveAI function evaluates email tone appropriateness on a scale of 0 to 1, where 1 indicates a perfectly appropriate tone for the given context. It considers factors like formality level, emotional tone, and audience expectations.

## Input Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | The email text to evaluate |
| `context` | string | Yes | Free-form description of the situation/audience (e.g., "asking my boss for time off", "following up with a client after a demo") |

## Output

A score in the range `[0, 1]` where:
- **1.0** = Perfectly appropriate tone
- **0.66** = Mostly appropriate with minor issues
- **0.33** = Somewhat inappropriate
- **0.0** = Highly inappropriate

## How It Works

The function uses a `vector.completion` task with 4 response options:
1. "The tone is perfectly appropriate for this context"
2. "The tone is mostly appropriate with minor issues"
3. "The tone is somewhat inappropriate for this context"
4. "The tone is highly inappropriate for this context"

The final score is calculated as:
```
score = scores[0] + (scores[1] * 0.66) + (scores[2] * 0.33)
```

## Examples

**High Score** - Professional email to CEO:
```json
{
  "email": "Dear Mr. Thompson,\n\nI hope this message finds you well...",
  "context": "Requesting a meeting with the company CEO"
}
```

**Low Score** - Overly casual email to client:
```json
{
  "email": "yo whats up!! so like i was thinking about ur project...",
  "context": "Following up with a corporate client about their enterprise software contract"
}
```

## Installation

```bash
npm install
npm run build
```

## Links

- [ObjectiveAI](https://objective-ai.io)
- [GitHub](https://github.com/ObjectiveAI/objectiveai)
- [Discord](https://discord.gg/gbNFHensby)
