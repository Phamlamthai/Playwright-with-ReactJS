---
name: feedback-notes-in-project
description: "Store concept/learning notes as files inside the project (e.g. e2e/playwright-concepts.md), not only in hidden .claude system folder"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 88c648f6-2622-4ee2-b5bd-ff256342460e
---

Khi lưu notes học Playwright hoặc concept bất kỳ, phải tạo file trong **project directory** (ví dụ `e2e/playwright-concepts.md`) để user có thể mở và đọc từ editor — không chỉ lưu vào `/Users/thaipl1607/.claude/projects/.../memory/` (hidden folder, user không thấy được từ IDE).

**Why:** User phàn nàn "mày ném vào bộ nhớ máy làm đéo gì" (2026-07-01) — memory system ẩn không accessible từ editor, không có ích cho user khi muốn đọc lại.

**How to apply:**
- Vẫn dùng memory system (`.claude/projects/.../memory/`) để AI nhớ giữa sessions.
- Nhưng ĐỒNG THỜI tạo file tương ứng trong project (ưu tiên `e2e/playwright-concepts.md` cho Playwright notes) để user đọc được trực tiếp.
- File trong project là "single source of truth" cho user; memory system là "lookup index" cho AI.
