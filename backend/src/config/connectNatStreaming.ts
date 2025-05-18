import { natsWrapper } from "../lib/nats-client";

export async function connectNatsStreaming() {
  await natsWrapper.connect();
}
