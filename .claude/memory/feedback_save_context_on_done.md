---
name: feedback-save-context-on-done
description: "Save memory context after every \"done\" report to persist session state"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 08720495-f052-4892-8cc9-77d1d8ac7a06
---

After completing any task and reporting it as done, always save relevant context to memory files.

**Why:** User wants future sessions to pick up exactly where we left off without re-explaining context.

**How to apply:** At the end of each completed task, update or create memory files in `/Users/thaipl1607/.claude/projects/-Users-thaipl1607-taskflow/memory/` capturing: what was done, current state of the project, and what comes next.
