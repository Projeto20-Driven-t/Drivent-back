import { Router } from "express";
import { getActivities, getActivitiesDate, getUserSelections, UserSelectActivity } from "@/controllers/activities-controller";
import { authenticateToken } from "@/middlewares";

const activitiesRouter = Router();

activitiesRouter
  .get("/", getActivities)
  .get("/dates", getActivitiesDate)
  .all("/*", authenticateToken)
  .get("/select", getUserSelections)
  .post("/select/:activityId", UserSelectActivity);

export { activitiesRouter };
