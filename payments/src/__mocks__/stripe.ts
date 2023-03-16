export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: 'ch_sadf324qeasdafagaq31245sdaf',
    }),
  },
};
