# Cleanup Roadmap

## Overview
Tracks technical debt, refactoring tasks, and code quality improvements.

---

## Pending Cleanups

### Backend
- [ ] Remove duplicate `jobTools.py` in `services/` (consolidate with `tools/job_tools.py`)
- [ ] Fix `.gitignore` — was listing individual `.venv` files instead of folder pattern ✅ Done
- [ ] Remove `.idea/` from git tracking ✅ Done
- [ ] Add proper schemas in `schemas/`
- [ ] Populate `models/` and `db/` with actual implementations

### Frontend
- [ ] Remove unused default assets (`react.svg`, `vite.svg`)
- [ ] Set up component structure under `components/`
- [ ] Populate `pages/` and `utils/`

### General
- [ ] Add `README.md` with setup instructions
- [ ] Add `.env.example` file for environment variable reference

---

## Completed
| Date | Task |
|------|------|
| 2026-05-23 | Fixed `.gitignore` with proper patterns |
| 2026-05-23 | Removed `.idea/` folder from git tracking |

