# PAM Revenue Manager Mission Control

> **INTERNAL DRAFT — NOT APPROVED FOR PUBLICATION**

A Vercel-ready Next.js operational dashboard for the PAM Revenue Manager. It is a protected internal UI prototype: it does not connect to Hermes, task storage, chat transport, or analytics.

## Included

- **Revenue Manager chat:** operator messages are added to the local conversation state.
- **Task creation:** a keyboard-accessible dialog creates a task in **Actively working**.
- **Dynamic Kanban:** Actively working, Waiting for Michael, Waiting for Chris, and Completed lanes are rendered from state.
- **Agent office:** an original CSS pixel-art office scene with reduced-motion support.
- **Responsive app shell:** mobile navigation, horizontally scrollable board, semantic headings/landmarks, labeled forms, visible focus, and dialog semantics.
- **Server-enforced sign-in:** an edge proxy redirects unauthenticated requests before Mission Control content is served; successful sign-in receives an HTTP-only, `Secure`, `SameSite=Strict` signed session cookie.

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

Vercel automatically detects Next.js. The app fails closed until the required authentication environment variables are set for both Preview and Production deployments.

## Vercel authentication configuration

Do not put credentials in source control or send them in chat. In the Vercel project’s **Settings → Environment Variables**, configure all three variables for every environment you deploy:

| Variable | Value |
|---|---|
| `MISSION_CONTROL_USERNAME` | The username you choose. |
| `MISSION_CONTROL_PASSWORD_HASH` | An `scrypt` password hash in the format `saltHex:derivedKeyHex`. |
| `MISSION_CONTROL_SESSION_SECRET` | A unique random secret of at least 32 bytes for signing sessions. |

Generate secrets locally in a trusted terminal—never in chat—and paste only the resulting values into Vercel’s encrypted environment-variable UI:

```bash
python3 -c "import secrets, hashlib, getpass; password=getpass.getpass('Mission Control password: ').encode(); salt=secrets.token_bytes(16); print('MISSION_CONTROL_PASSWORD_HASH='+salt.hex()+':'+hashlib.scrypt(password, salt=salt, n=16384, r=8, p=1, dklen=64).hex()); print('MISSION_CONTROL_SESSION_SECRET='+secrets.token_urlsafe(48))"
```

The command prompts for the password without echoing it. Configure Vercel firewall/rate-limit rules before exposing a public domain; the single-account sign-in implementation does not provide distributed brute-force throttling on its own.

## Next integration boundary

Before a release, Chris should approve the real-time transport and persistence model. The UI must not be represented as a live view of Hermes agents until a vetted, authorized source exists. See `docs/mission-control-contract.md` for the internal page contract and claim ledger.