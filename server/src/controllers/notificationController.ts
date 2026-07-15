import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

export const getNotifications = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const notifications = notificationService.getUserNotifications(req.user.id);
  res.status(200).json(notifications);
};

export const markAsRead = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { id } = req.params;
  const notification = notificationService.markAsRead(id, req.user.id);
  
  if (!notification) {
    res.status(404).json({ error: 'Notification not found' });
    return;
  }
  
  res.status(200).json(notification);
};
