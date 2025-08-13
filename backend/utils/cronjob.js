import cron from "node-cron";
import UserModel from "../models/User.model.js";
import AmountModel from "../models/Amount.model.js";
import GuestModel from "../models/Guest.model.js";

// Utility function for logging only in development
const devLog = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

// Utility function for error logging only in development
const devError = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
};

export const scheduleUserDeletionJob = () => {
  /**
   * 1️⃣ DAILY JOB — DELETE INACTIVE NON-GUEST USERS
   */
  cron.schedule("0 0 * * *", async () => {
    try {
      devLog("Daily cleanup: Deleting inactive users (non-guests) ...");

      const now = new Date();
      const hundredDaysAgo = new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000);

      const inactiveUsers = await UserModel.find({
        role: { $ne: "guest" },
        lastLogin: { $lt: hundredDaysAgo },
      });

      for (const user of inactiveUsers) {
        const deletedAmounts = await AmountModel.deleteMany({
          user: user._id,
          userType: "user",
        });

        await UserModel.findByIdAndDelete(user._id);
        devLog(`Deleted inactive user: ${user.username}, deleted ${deletedAmounts.deletedCount} expenses`);
      }

      devLog("Daily inactive user cleanup finished.");
    } catch (error) {
      devError("Error cleaning inactive users:", error);
    }
  });

  /**
   * 2️⃣ FREQUENT JOB — DELETE EXPIRED GUESTS (Every 5 minutes for better cleanup)
   */
  cron.schedule("*/5 * * * *", async () => {
    try {
      devLog("Frequent cleanup: Deleting expired guests...");

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const expiredGuests = await GuestModel.find({
        createdAt: { $lt: tenMinutesAgo },
      });

      let totalDeletedGuests = 0;
      let totalDeletedExpenses = 0;

      for (const guest of expiredGuests) {
        const deletedAmounts = await AmountModel.deleteMany({
          user: guest._id,
          userType: "guest",
        });

        await GuestModel.deleteOne({ _id: guest._id });

        totalDeletedGuests++;
        totalDeletedExpenses += deletedAmounts.deletedCount;

        devLog(`Deleted expired guest: ${guest.username}, deleted ${deletedAmounts.deletedCount} expenses`);
      }

      devLog(`Expired guest cleanup finished. Deleted ${totalDeletedGuests} guests and ${totalDeletedExpenses} expenses.`);

      const allOrphanedExpenses = await AmountModel.find({});
      let orphanedCount = 0;

      for (const expense of allOrphanedExpenses) {
        let isOrphaned = false;

        if (expense.userType === "guest") {
          const guestExists = await GuestModel.findById(expense.user);
          if (!guestExists) isOrphaned = true;
        } else if (expense.userType === "user") {
          const userExists = await UserModel.findById(expense.user);
          if (!userExists) isOrphaned = true;
        }

        if (isOrphaned) {
          await AmountModel.deleteOne({ _id: expense._id });
          orphanedCount++;
        }
      }

      if (orphanedCount > 0) {
        devLog(`Cleaned up ${orphanedCount} total orphaned expenses`);
      }
    } catch (error) {
      devError("Error cleaning guests:", error);
    }
  });
};
