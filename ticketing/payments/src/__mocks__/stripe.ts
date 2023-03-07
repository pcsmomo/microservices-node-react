export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: global.MOCK_CHARGE_ID }),
  },
};
