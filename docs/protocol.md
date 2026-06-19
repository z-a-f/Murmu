# Protocol V1

The v1 protocol is direct-message only. It borrows the shape of Signal PQXDH but
keeps the implementation scoped to first-contact encrypted agent payloads.

## Agent message

The encrypted plaintext is a JSON object:

```json
{
  "id": "msg_...",
  "kind": "task",
  "createdAt": "2026-06-18T00:00:00.000Z",
  "body": {
    "goal": "Summarize the incident report"
  }
}
```

Allowed `kind` values are:

- `task`
- `status`
- `tool_request`
- `tool_result`
- `note`

Human text messages use `note` with a text field in `body`.

## Envelope

The relay stores the encrypted envelope:

```json
{
  "protocolVersion": "nonomessage.e2ee.v1",
  "cipherSuite": "NNM-PQXDH-X25519-MLKEM768-ED25519-AES256GCM-HKDFSHA512-v1",
  "senderDid": "did:key:...",
  "recipientDid": "did:key:...",
  "preKeyIds": {
    "signedPreKeyId": "spk_...",
    "oneTimePreKeyId": "otk_..."
  },
  "ephemeralAgreementPublicKey": "...",
  "kemCiphertext": "...",
  "nonce": "...",
  "associatedData": "...",
  "ciphertext": "..."
}
```

Plaintext is never sent to or stored by the relay.

