# AGENTS.md

Panduan untuk agent AI yang bekerja di repo ini.

## Agent skills

### Issue tracker

PRD, spec, dan ticket proyek ini dikelola sebagai GitHub Issues. Gunakan `gh` CLI untuk semua operasi (bikin/lihat/edit issue). Lihat `docs/agents/issue-tracker.md`.

### Triage labels

Label triage memakai 5 peran kanonik: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Lihat `docs/agents/triage-labels.md`.

### Domain docs

Layout single-context: satu `CONTEXT.md` di root + `docs/adr/` untuk keputusan desain. Lihat `docs/agents/domain.md`.
