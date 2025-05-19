import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
class NatsWrapper {
  private _client?: Stan;
  get client() {
    if (!this._client)
      throw new Error("Please connect nats streaming before accessing client!");
    return this._client;
  }

  public async connect(): Promise<void> {
    const id = randomBytes(10).toString("hex");
    this._client = nats.connect(process.env.CLUSTER_ID!, id, {
      url: process.env.NATS_URL,
    });

    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Nats Streaming connected!");
        resolve();
      });
      this._client!.on("error", (error) => {
        reject(error);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
