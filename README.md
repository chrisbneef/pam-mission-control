# PAM Revenue Manager Mission Control

> **INTERNAL DRAFT — NOT APPROVED FOR PUBLICATION**

A Vercel-ready React + TypeScript operational dashboard for the PAM Revenue Manager. It is a local UI prototype: it does not connect to Hermes, task storage, chat transport, analytics, or a production deployment.

## Included

- **Revenue Manager chat:** operator messages are added to the local conversation state.
- **Task creation:** a keyboard-accessible dialog creates a task in **Actively working**.
- **Dynamic Kanban:** Actively working, Waiting for Michael, Waiting for Chris, and Completed lanes are rendered from state.
- **Agent office:** an original CSS pixel-art office scene with reduced-motion support.
- **Responsive app shell:** mobile navigation, horizontally scrollable board, semantic headings/landmarks, labeled forms, visible focus, and dialog semantics.

## Local development

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run build
npm run lint
```

The production build is emitted to `dist/`, which Vercel can deploy with its standard Vite detection. No Vercel configuration or external integration is required for the static prototype.

## Next integration boundary

Before a release, Chris should approve the real-time transport and persistence model. The UI must not be represented as a live view of Hermes agents until a vetted, authorized source exists. See `docs/mission-control-contract.md` for the internal page contract and claim ledger.