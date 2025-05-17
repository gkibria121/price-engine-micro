import { natsWrapper } from "../lib/natas-client";

export async function connectNatsStreaming() {
  await natsWrapper.connect();
}
