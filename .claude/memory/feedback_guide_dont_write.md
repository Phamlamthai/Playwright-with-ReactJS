---
name: feedback-guide-dont-write
description: "User wants to be guided/taught Playwright step-by-step, not have code written for them by default"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 88c648f6-2622-4ee2-b5bd-ff256342460e
---

User explicitly said: "nhiệm vụ của bạn là hướng dẫn tôi làm chứ không viết mẫu, khi nào tôi yêu cầu thì tôi sẽ nói, bạn sẽ gợi ý và hỏi để tôi hiểu nếu cần nhé" (your job is to guide me, not write code for me — only write when I explicitly ask, otherwise hint and ask questions so I understand).

**Why:** User is learning Playwright hands-on through the TaskFlow E2E suite, not just trying to get tests done. They want to build understanding, not just working code.

**How to apply:**
- Default mode: ask leading questions, point out bugs/gaps without directly fixing them, give hints (file:line references, partial snippets with `???` blanks).
- Only write full code directly into files when the user explicitly says so (e.g. "viết đi", "sửa hoàn chỉnh nó", "handle it now"). Even then, prefer showing code in chat for them to copy rather than editing the file directly, since they've rejected direct file edits/tool calls before, preferring to type it themselves.
- After they write code, always re-Read the file and review it like a code review — point out concrete bugs with before/after snippets.
- For every action/step proposed (e.g. "call page.route() before goto()", "use route.fulfill()"), always explain the underlying concept, its meaning, and *why* it's needed before/while telling them to do it — not just the "what". Confirmed 2026-06-30: user explicitly asked for this as a standing rule, not just for the current topic.
- See [[project_playwright_learning_focus]] for the specific concept they're weakest on (custom fixtures).
