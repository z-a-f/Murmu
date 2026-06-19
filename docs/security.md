# Security Notes

This repository is a prototype. It uses modern primitives and tests the
plaintext boundary, but it is not production-audited cryptographic software.

## Cipher suite

`NNM-PQXDH-X25519-MLKEM768-ED25519-AES256GCM-HKDFSHA512-v1`

- Ed25519 signs identity-controlled prekey bundles.
- X25519 provides classical elliptic-curve key agreement.
- ML-KEM-768 provides post-quantum KEM material.
- HKDF-SHA512 derives the message encryption key.
- AES-256-GCM encrypts structured agent payloads.

## Metadata

The relay can observe:

- Sender DID
- Recipient DID
- Envelope creation time
- Message size
- Delivery acknowledgement state

V1 does not attempt metadata-hiding, mixnets, private information retrieval, or
sealed sender.

## Key storage

The web app stores local identity state in IndexedDB. The MCP app stores local
identity state in a JSON file chosen by `NNM_MCP_STATE` or a user data
directory. Production mobile clients should use platform secure storage.

