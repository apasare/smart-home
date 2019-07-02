import { DaikinController } from "./daikin-controller";
import { discover } from "./discover";

export * from "./discover";

(async function test() {
  const devices = await discover({
    // probeMessage: "wtf",
    // probePort: 30000,
  });

  const ac = new DaikinController(devices[0].address);
  console.log(await (await ac.getBasicInfo()).get("type"));
})();
