import { describe, expect, it } from "vitest";
import {
  decryptAgentMessage,
  encryptAgentMessage,
  generateIdentity,
  generateOneTimePreKey,
  generateSignedPreKey,
  publicIdentity,
  createAgentMessage,
  assertPreKeyBundle,
  type PreKeyClaim,
} from "../src/index.js";

describe("protocol", () => {
  it("encrypts and decrypts an agent JSON message", async () => {
    const alice = generateIdentity("agent", { label: "alice" });
    const bob = generateIdentity("agent", { label: "bob" });
    const bobSignedPreKey = generateSignedPreKey(bob);
    const bobOneTimePreKey = generateOneTimePreKey(bob);

    assertPreKeyBundle({
      identity: publicIdentity(bob),
      signedPreKey: bobSignedPreKey.publicKey,
      oneTimePreKeys: [bobOneTimePreKey.publicKey],
    });

    const claim: PreKeyClaim = {
      identity: publicIdentity(bob),
      signedPreKey: bobSignedPreKey.publicKey,
      oneTimePreKey: bobOneTimePreKey.publicKey,
      claimedAt: new Date().toISOString(),
    };
    const message = createAgentMessage("task", {
      goal: "prepare release notes",
      priority: "high",
    });

    const envelope = await encryptAgentMessage({
      sender: alice,
      recipient: claim,
      message,
    });

    expect(JSON.stringify(envelope)).not.toContain("prepare release notes");
    expect(envelope.senderDid).toBe(alice.did);
    expect(envelope.recipientDid).toBe(bob.did);

    const decrypted = await decryptAgentMessage(envelope, {
      identity: bob,
      signedPreKey: bobSignedPreKey,
      oneTimePreKey: bobOneTimePreKey,
      senderIdentity: publicIdentity(alice),
    });

    expect(decrypted).toEqual(message);
  });

  it("rejects tampered associated data", async () => {
    const alice = generateIdentity("agent");
    const bob = generateIdentity("agent");
    const bobSignedPreKey = generateSignedPreKey(bob);
    const claim: PreKeyClaim = {
      identity: publicIdentity(bob),
      signedPreKey: bobSignedPreKey.publicKey,
      claimedAt: new Date().toISOString(),
    };
    const envelope = await encryptAgentMessage({
      sender: alice,
      recipient: claim,
      message: createAgentMessage("status", { state: "ready" }),
    });

    await expect(
      decryptAgentMessage(
        { ...envelope, senderDid: "did:key:z6MkTampered" },
        {
          identity: bob,
          signedPreKey: bobSignedPreKey,
          senderIdentity: publicIdentity(alice),
        },
      ),
    ).rejects.toThrow();
  });

  it("rejects decryption by the wrong recipient", async () => {
    const alice = generateIdentity("agent");
    const bob = generateIdentity("agent");
    const carol = generateIdentity("agent");
    const bobSignedPreKey = generateSignedPreKey(bob);
    const claim: PreKeyClaim = {
      identity: publicIdentity(bob),
      signedPreKey: bobSignedPreKey.publicKey,
      claimedAt: new Date().toISOString(),
    };
    const envelope = await encryptAgentMessage({
      sender: alice,
      recipient: claim,
      message: createAgentMessage("tool_request", { name: "search" }),
    });

    await expect(
      decryptAgentMessage(envelope, {
        identity: carol,
        signedPreKey: generateSignedPreKey(carol),
        senderIdentity: publicIdentity(alice),
      }),
    ).rejects.toThrow("Envelope recipient does not match local identity");
  });
});

