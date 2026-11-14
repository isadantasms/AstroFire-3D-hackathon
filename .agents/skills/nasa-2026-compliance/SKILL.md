---
name: nasa-2026-compliance
description: Enforce NASA Space Apps 2026 rules, SI headers and watermarks, DOI/NTRS citations in docs/references.md, asset credits in assets/CREDITS.md, PSI-10 exclusion, and token-efficient git-diff language checks. Activate when editing README.md, LICENSE, docs/**, assets/CREDITS.md, or preparing submission.
---

# NASA Space Apps 2026 Compliance & Audit Skill

## 1. Mandatory 2026 Rules (Disqualification Prevention)
1. **Strict Prohibition of NASA Logos:** Never include the official NASA logo ("Meatball", "Worm", seal, or mission patch) in the UI, favicon, 3D scene, slides, or demo video.
2. **Dataset License Guard:** Cite every NASA PSI investigation by its official DOI (`CC0-1.0`). **Strictly exclude `PSI-10` (ACME/Flame Design)** as it has no open license declaration in PSI.
3. **Super Intelligence (SI) Transparency (Official 2026 Format):**
   - **Code Files:** Add `# SI-assisted: generated with <Model>, reviewed and edited by <Team Member>` at the top of AI-assisted source files.
   - **Git Commits:** Append `SI-assisted: <Model>` to commit messages.
   - **Images & Video:** Any AI-generated visual asset MUST carry a visible watermark on the image/video itself: `"Generated with SI (<Tool>)"`.
   - **README Section:** Keep the `## Super Intelligence (SI)` section in `README.md` divided into `### SI inside the product`, `### SI tools used to build it`, and `### What was not made with SI`.
4. **Complete Reference & Asset Ledgers:**
   - Log all data, papers, libraries, and SI models in `docs/references.md` using the 5-column table: `| Resource | Type | License | Link | Used in |`.
   - Log all icons, fonts, and visual assets in `assets/CREDITS.md`.
5. **Submission & Demo Limits:**
   - 100% of linked materials (`README.md`, live app, slides, video captions, submission form) MUST be in **English (EN)** and publicly accessible **without login**.
   - Demo limit for Global Judging: **max 30-second video** OR **max 7 slides**.

## 2. On-Demand Pre-Push Language Check (Token-Efficient)
Run ONLY when a team member explicitly asks for a pre-merge or final submission audit:
- Inspect **exclusively `git diff`** using a fast terminal regex check for Portuguese accented characters before reading any files:
  ```powershell
  git diff HEAD | Select-String -Pattern "[çãõáéíóúâêôà]"
  ```
- If empty, pass immediately with zero file reads; if matches appear in tracked files, translate only those specific lines into English.
