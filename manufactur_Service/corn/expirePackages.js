const cron = require("node-cron");
const wlpActivation = require("../models/wlpActivationModel");



cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const expiredPackages = await wlpActivation.updateMany(
      {
        activationStatus: "Active",
        endTime: { $lte: now }
      },
      {
        $set: { activationStatus: "Ended" }
      }
    );

    if (expiredPackages.modifiedCount > 0) {
      console.log("Expired packages updated:", expiredPackages.modifiedCount);
    }

  } catch (err) {
    console.error("Cron error:", err);
  }
});