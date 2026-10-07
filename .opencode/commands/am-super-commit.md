---
description: Group changes into semantic commits following project conventions and push
---

Group all current changes into meaningful semantic commits following AM Social Club conventions and push the current branch.

Optional context for commit messages: `$ARGUMENTS`

## Project Conventions

**Branches:** `feat/feature-name` or `bugfix/bug-name`

**Commits:** `<type>(<scope>): <message>`
- **type**: feat | fix | docs | test | refactor | perf | chore
- **scope**: frontend | backend | database | config | ci | deps
- **message**: Clear, imperative, lowercase, no period

**Examples:**

feat(backend): Add POST /api/reservations endpoint
feat(frontend): Create ReservationForm component
feat(database): Add reservations table with indexes
fix(backend): Handle null values in reservation query
docs(readme): Update installation steps
test(backend): Add reservation service tests


**Rule:** One logical feature = ONE commit (squash if needed)

---

## Flow

1. **Inspect repository state:**
   - `git status --short`
   - `git diff --stat`
   - `git branch -v`
   - `git log --oneline -5`

2. **Identify change groups:**
   - Group by scope (backend changes, frontend changes, database changes)
   - Determine type (feat, fix, refactor, test, docs, chore, perf)
   - Check if they're related (same feature = same commit)
   - If independent changes → multiple commits

3. **Validate commit eligibility:**
   - ✅ Does it follow `<type>(<scope>): <message>` format?
   - ✅ Is the scope in [frontend | backend | database | config | ci | deps]?
   - ✅ Does it match the branch pattern (feat/xxx or bugfix/xxx)?
   - ✅ No sensitive files (.env, keys, tokens, secrets)?
   - ✅ All related files grouped together?
   - ❌ STOP if validation fails

4. **Show proposed commit plan:**

Branch: feat/reservation-system

Commit 1: feat(backend): Add reservation API endpoints

backend/src/api/reservations.ts (new)
backend/src/services/ReservationService.ts (new)
backend/src/types/reservation.ts (new)

Commit 2: feat(frontend): Create ReservationForm component

frontend/components/Forms/ReservationForm.tsx (new)
frontend/lib/reservationApi.ts (modified)

Commit 3: feat(database): Add reservations table

backend/src/db/migrations/003_reservations.sql (new)

5. **Ask for confirmation:**
   - "Does this grouping match your intent?"
   - "Should I proceed with these 3 commits?"

6. **Execute commits (if approved):**
```bash
   # Commit 1
   git add backend/src/api/reservations.ts \
           backend/src/services/ReservationService.ts \
           backend/src/types/reservation.ts
   git commit -m "feat(backend): Add reservation API endpoints"
   
   # Commit 2
   git add frontend/components/Forms/ReservationForm.tsx \
           frontend/lib/reservationApi.ts
   git commit -m "feat(frontend): Create ReservationForm component"
   
   # Commit 3
   git add backend/src/db/migrations/003_reservations.sql
   git commit -m "feat(database): Add reservations table"
```

7. **Push branch:**
```bash
   git push origin $(git rev-parse --abbrev-ref HEAD)
```

8. **Summarize:**

✅ Successfully pushed to feat/reservation-system

Commits created:

feat(backend): Add reservation API endpoints
feat(frontend): Create ReservationForm component
feat(database): Add reservations table

Files changed: X insertions, Y deletions
Ready for Pull Request to develop


---

## Rules (Non-Negotiable)

- ✅ Follow `<type>(<scope>): <message>` format strictly
- ✅ One logical feature = one commit (UNLESS truly independent)
- ✅ Group files by scope and intent
- ✅ Validate against `.env`, `.secrets`, `credentials`, `keys`, `tokens` - STOP if found
- ✅ Use imperative mood ("Add", not "Added")
- ✅ Lowercase message (except proper nouns)
- ✅ No period at end of message
- ✅ Check AGENT.md for commit style reference
- ✅ Push to correct branch (feat/* or bugfix/*)
- ❌ Do NOT use `--amend` (new commits only)
- ❌ Do NOT use `--force-push`
- ❌ Do NOT use `--no-verify`
- ❌ Do NOT mix unrelated changes in one commit
- ❌ Do NOT revert existing commits
- ❌ Do NOT commit sensitive files

---

## Context Integration

If `$ARGUMENTS` provided (e.g., "Implement login system"):
- Use as guidance for commit message accuracy
- Verify it matches the actual code changes
- Adjust scope/message if more specific scope exists
- DO NOT force generic message if specific scope applies

**Example:**
- Context: "Add authentication"
- Files show: JWT service + login page
- ✅ Use `feat(backend): Add JWT authentication` (specific)
- ❌ Do NOT use `feat: Add authentication` (too generic)

---

## Validation Checklist

Before each commit:
- [ ] Branch name matches pattern (feat/xxx or bugfix/xxx)
- [ ] Commit message format: `<type>(<scope>): <message>`
- [ ] Scope in allowed list: [frontend | backend | database | config | ci | deps]
- [ ] No sensitive files included
- [ ] Files grouped by intent
- [ ] Message is clear and actionable
- [ ] Follows project conventions in AGENT.md
- [ ] No force push needed
- [ ] Ready to create PR to develop

---

## After Push

1. Verify on GitHub
2. Create Pull Request (target: develop)
3. Title: Match first commit message
4. Description: List all commits created
5. Wait for CI to pass ✅
6. Request review from Code Reviewer agent
7. Address feedback if any
8. Merge to develop