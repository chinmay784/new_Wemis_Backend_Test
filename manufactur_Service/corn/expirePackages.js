// const cron = require("node-cron");
// const wlpActivation = require("../models/wlpActivationModel");



// cron.schedule("*/5 * * * *", async () => {
//   try {
//     const now = new Date();

//     const expiredPackages = await wlpActivation.updateMany(
//       {
//         activationStatus: "Active",
//         endTime: { $lte: now }
//       },
//       {
//         $set: {
//           activationStatus: "Ended",
//           IsCycleComplite: true
//         }
//       }
//     );

//     if (expiredPackages.modifiedCount > 0) {
//       console.log("Expired packages updated:", expiredPackages.modifiedCount);
//     }

//   } catch (err) {
//     console.error("Cron error:", err);
//   }
// });




const cron = require("node-cron");
const DeviceActivation = require("../models/deviceActivationModel");

cron.schedule("*/5 * * * *", async () => {

  const now = new Date();

  const expired = await DeviceActivation.updateMany(
    {
      activationStatus: "Active",
      endTime: { $lte: now }
    },
    {
      $set: {
        activationStatus: "Ended",
        IsCycleComplite: true
      }
    }
  );

  if (expired.modifiedCount > 0) {
    console.log("Expired devices:", expired.modifiedCount);
  }

});