# ai-sprawl

AI-assisted coding is making software creation cheap. That speed creates a new problem: software sprawl.

This project is about the control layer that helps teams discover, classify, and govern the code, scripts, agents, and automations AI makes easy to create.

## Problem

Teams are producing more software than they can confidently understand, review, secure, or maintain.

The failure mode is not just bad code. It is:

- unknown software existing in too many places
- weak ownership
- stale secrets and permissions
- duplicated logic and duplicated tools
- no clear cleanup or governance path

## Product thesis

The product is **AI Code Governance**.

Start where teams already work:

- GitHub pull requests
- risk scoring
- ownership checks
- simple policy enforcement
- visibility into AI-amplified sprawl

## Initial wedge

A GitHub app that flags risky changes in pull requests and forces lightweight governance before merge.

## Why now

AI coding tools are no longer experimental. The bottleneck has shifted from producing code to controlling what that code turns into.

## Repo layout

- `docs/problem.md` - the core problem statement
- `docs/mvp.md` - the first product wedge
- `docs/roadmap.md` - the build plan
- `src/index.js` - server entry point
- `src/server.js` - HTTP API and GitHub App scaffold
- `src/github/app.js` - install URL and webhook helpers
- `src/risk/score.js` - the first risk-scoring stub

## Running

```bash
npm start
```

Available routes:

- `GET /` - dashboard homepage
- `GET /dashboard` - dashboard homepage
- `GET /health`
- `GET /github/install`
- `GET /github/config`
- `GET /api/dashboard`
- `POST /api/risk/score`
- `POST /webhooks/github`

## Environment

- `PORT` - server port, defaults to `3000`
- `GITHUB_APP_SLUG` - GitHub App slug used for the install URL, defaults to `ai-sprawl`
- `GITHUB_APP_WEBHOOK_SECRET` - optional webhook signature secret

## Status

This repo is the home for the project definition, product thinking, and first implementation work.
