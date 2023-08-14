import { UserActivity } from "@prisma/client";
import { prisma } from "@/config";

async function getActivities() {
  return prisma.activity.findMany();
}

async function getActivitiesDate() {
  return prisma.activityDate.findMany();
}

async function UserSelectActivity(data: Omit<UserActivity, "id">) {
  return prisma.userActivity.create({ data });
}

async function updateSlotsCount(activityId: number) {
  return prisma.activity.update({
    where: { id: activityId },
    data: { slots: { decrement: 1 } }
  });
}

async function getUserSelections(userId: number) {
  return prisma.userActivity.findMany({ where: { userId: userId } });
}

const activitiesRepository = {
  getActivities,
  getActivitiesDate,
  UserSelectActivity,
  getUserSelections,
  updateSlotsCount
};

export default activitiesRepository;
