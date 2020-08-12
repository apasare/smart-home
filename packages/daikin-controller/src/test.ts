import { Client } from './api';
import { discover } from './discover';

(async function test() {
  const devices = await discover({
    // probeMessage: "wtf",
    // probePort: 30000,
  });

  devices.forEach((device) => {
    console.log(device);
  });

  const ac = new Client(devices[0].address);
  console.log(await ac.getBasicInfo());
})();
