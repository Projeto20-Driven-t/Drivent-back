import { notFoundError } from '@/errors';
import activitiesRepository from '@/repositories/activity-repository'

async function getActivities() {
  const activities = await activitiesRepository.getActivities();

  if (!activities) throw notFoundError();

  for (let i = 0; i < activities.length; i++) {
    delete activities[i].createdAt;
    delete activities[i].updatedAt;
  }

  return activities;
}

async function getActivitiesDate() {
  const date = await activitiesRepository.getActivitiesDate();
  if (!date || date.length === 0) throw notFoundError();
  const month = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  let d = 1;
  const dates = [];
  for (const e of date) {
    for (const value of month) {
      if (e.month === value) break;
      d++;
    }
    dates.push({ id: e.id, weekDay: e.weekDay, month: d, monthDay: e.monthDay });
    d = 1;
  }
  return dates;
}

async function UserSelectActivity(userId: number, activityId: number) {
  const select = await activitiesRepository.UserSelectActivity({ userId, activityId });
  return select;
}

async function getUserSelections(userId: number) {
  const user = await activitiesRepository.getUserSelections(userId);
  return user;
}

const activitiesService = {
  getActivities,
  getActivitiesDate,
  UserSelectActivity,
  getUserSelections,
};

export default activitiesService;