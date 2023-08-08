import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activity-service';

export async function getActivities(req: AuthenticatedRequest, res: Response) {
   
      const activities = await activitiesService.getActivities();
      return res.status(httpStatus.OK).send(activities);
    
  }
  
  export async function getActivitiesDate(req: AuthenticatedRequest, res: Response) {
    
      const date = await activitiesService.getActivitiesDate();
      return res.status(httpStatus.OK).send(date);
    
  }
  
  export async function UserSelectActivity(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { activityId } = req.params;
    const select = await activitiesService.UserSelectActivity(userId, Number(activityId));
      return res.status(httpStatus.OK).send(select);
   
  }
  
  export async function getUserSelections(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
  
      const select = await activitiesService.getUserSelections(userId);
      return res.status(httpStatus.OK).send(select);
  
  }