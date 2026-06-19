import {
  base58BtcToBytes,
  bytesToBase58Btc,
  bytesToBase64Url,
  base64UrlToBytes,
} from "./encoding.js";

const ED25519_PUBLIC_KEY_MULTICODEC = new Uint8Array([0xed, 0x01]);

export function didKeyFromEd25519PublicKey(publicKey: Uint8Array): string {
  const encoded = bytesToBase58Btc(
    new Uint8Array([...ED25519_PUBLIC_KEY_MULTICODEC, ...publicKey]),
  );
  return `did:key:z${encoded}`;
}

export function ed25519PublicKeyFromDidKey(did: string): Uint8Array {
  const prefix = "did:key:z";
  if (!did.startsWith(prefix)) {
    throw new Error("Only did:key identities are supported");
  }

  const decoded = base58BtcToBytes(did.slice(prefix.length));
  if (
    decoded.length !== ED25519_PUBLIC_KEY_MULTICODEC.length + 32 ||
    decoded[0] !== ED25519_PUBLIC_KEY_MULTICODEC[0] ||
    decoded[1] !== ED25519_PUBLIC_KEY_MULTICODEC[1]
  ) {
    throw new Error("Unsupported did:key multicodec");
  }

  return decoded.slice(ED25519_PUBLIC_KEY_MULTICODEC.length);
}

export function assertDidMatchesSigningKey(
  did: string,
  signingPublicKey: string,
): void {
  const didKey = bytesToBase64Url(ed25519PublicKeyFromDidKey(did));
  const publicKey = bytesToBase64Url(base64UrlToBytes(signingPublicKey));
  if (didKey !== publicKey) {
    throw new Error("DID does not match signing public key");
  }
}

