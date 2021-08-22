import env from './env';

test('Production does not use demo/test data', () => {
  expect(env.DEMO).toBe(false);
});
