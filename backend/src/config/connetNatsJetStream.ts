import { jetStreamWrapper } from "../lib/jet-stream-client";

export async function connectNatsJetStream() {
  await jetStreamWrapper.connect();
}
