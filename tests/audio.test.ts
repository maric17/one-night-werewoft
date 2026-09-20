import { speak } from '../src/utils/audio';

test('speak resolves without error in non-browser env', async () => {
  await expect(speak('test')).resolves.toBeUndefined();
});
