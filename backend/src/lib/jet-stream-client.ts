import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
} from "nats";
import { Subject } from "@daynightprint/events";
class JetStreamWrapper {
  protected nc!: NatsConnection;
  protected _jsm!: JetStreamClient;
  protected jsmAdmin!: JetStreamManager;
  protected url: string;
  constructor(url: string) {
    this.url = url;
  }

  async connect() {
    this.nc = await connect({ servers: this.url });
    this._jsm = this.nc.jetstream();
    this.jsmAdmin = await this.nc.jetstreamManager();

    // Create the stream if it doesn't exist
    const stream = "PRODUCT_EVENTS";
    try {
      await this.jsmAdmin.streams.info(stream);
    } catch {
      await this.jsmAdmin.streams.add({
        name: stream,
        subjects: Object.values(Subject),
        max_msgs: 100000,
        max_bytes: 104857600, // 100MB
      });
      console.log(`Created stream: ${stream}`);
    }
  }
  async disconnect() {
    await this.nc.close();
  }

  public get client(): JetStreamClient {
    if (!this._jsm) throw new Error("Please connect before accessing client");
    return this._jsm;
  }
}

const jetStreamWrapper = new JetStreamWrapper(process.env.NATS_URL!);

export { jetStreamWrapper };
