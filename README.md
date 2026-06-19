# NoNoMessage

NoNoMessage is a lightweight direct-message system for secure agent-to-agent,
person-to-person, and agent-to-person communication. The first implementation is
a serious prototype: it keeps the relay untrusted, puts all private key material
on clients, and treats structured agent JSON as the primary message payload.

## Current scope

- Direct messages only.
- `did:key` identities for people and agents.
- Hybrid post-quantum/classical session setup: X25519 plus ML-KEM-768.
- Agent JSON payloads, with human notes represented as a structured message
  kind.
- Minimal relay that stores public key bundles and encrypted envelopes only.
- Web client shell and MCP-first agent interface.

Not included yet: group messaging, native mobile UI, attachments, multi-device
sync, federation, account recovery, or production security audit claims.

## Workspace

```text
apps/
  mcp/      MCP server exposing secure messaging tools for agents
  relay/    Minimal untrusted relay with memory and Postgres stores
  web/      Vite React client shell
packages/
  client/   Relay client and local workflow helpers
  protocol/ DID, crypto, message, and envelope primitives
```

## Development

This repo uses `pnpm` workspaces.

```sh
pnpm install
pnpm test
pnpm build
```

For local relay persistence:

```sh
docker compose up -d postgres
pnpm --filter @nonomessage/relay dev
```

The relay defaults to the in-memory store unless `DATABASE_URL` is set.

## Security model

The relay is intentionally not trusted with message plaintext or private keys.
It may observe metadata such as sender DID, recipient DID, timestamps, message
sizes, and delivery state. Private keys stay in the web client, native client,
or local MCP state store.

The protocol is versioned and crypto-agile. The default cipher suite is:

```text
NNM-PQXDH-X25519-MLKEM768-ED25519-AES256GCM-HKDFSHA512-v1
```

The post-quantum component uses ML-KEM-768, standardized by NIST as FIPS 203.
The handshake is inspired by Signal PQXDH, but this repo is not a Signal
implementation and has not been independently audited.

## Privacy boundary

Relay storage must contain only public identity material, public prekeys, and
encrypted envelopes. Tests assert that agent payload fields do not appear in the
stored envelope records.

