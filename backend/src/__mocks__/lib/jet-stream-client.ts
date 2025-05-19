// __mocks__/jetStreamWrapper.ts (or in your test file directly)
import { JetStreamClient } from "nats";

export const mockJetStreamClient = {
  publish: jest.fn().mockResolvedValue({ seq: 1 }),
  pullSubscribe: jest.fn(),
  subscribe: jest.fn(),
  // Add more JetStreamClient methods as needed
} as unknown as JetStreamClient;

export const jetStreamWrapper = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  client: mockJetStreamClient,
};
