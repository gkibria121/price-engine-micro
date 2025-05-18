export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject, data, callback) => {
      if (callback) {
        callback(); // Simulate successful publish
      }
    }),
  },
};
