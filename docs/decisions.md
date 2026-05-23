# Decisions Log

## Overview
Records of important technical and product decisions made during development.

---

## Format
Each entry follows this format:
- **Date**: When the decision was made
- **Decision**: What was decided
- **Reason**: Why this choice was made
- **Alternatives Considered**: Other options that were evaluated

---

## Decisions

### 2026-05-23 — Use FastAPI for Backend
- **Decision**: Use FastAPI (Python) for the backend
- **Reason**: Fast to build, async support, automatic OpenAPI docs, great for AI/ML integrations
- **Alternatives**: Django, Flask, Node.js/Express

---

### 2026-05-23 — Use React + Vite for Frontend
- **Decision**: Use React with Vite as the build tool
- **Reason**: Fast HMR, lightweight setup, modern tooling
- **Alternatives**: Next.js, Vue, plain HTML

---

### 2026-05-23 — Use OpenAI API for AI Features
- **Decision**: Integrate OpenAI API for resume analysis and cover letter generation
- **Reason**: Best-in-class LLM quality, easy Python SDK
- **Alternatives**: Local LLMs, Hugging Face, Anthropic Claude

---

### 2026-05-23 — macOS Keychain for Git Credentials
- **Decision**: Use `osxkeychain` as git credential helper
- **Reason**: Secure, built into macOS, no plaintext credential files
- **Alternatives**: `.git-credentials` file, SSH keys

---
_Add new decisions above this line_

