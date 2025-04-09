import { Request, Response } from 'express';
import {
  createLiabilityDistributionService,
  updateLiabilityDistributionService,
  deleteLiabilityDistributionService,
  getLiabilityDistributionService
} from '../services/liabilityDistributionService';
import { validUser } from '../services/userServices';

// Save (Create or Update) Liability Distribution
export const saveLiabilityDistribution = async (request: Request, response: Response) => {
  try {
    const { userId, liabilityData } = request.body;

    if (!(await validUser(userId))) {
      return response.status(400).json({ error: 'Invalid User' });
    }
    const existing = await getLiabilityDistributionService(userId);

    if (existing) {
      await updateLiabilityDistributionService(userId, liabilityData);
    } else {
      await createLiabilityDistributionService(userId, liabilityData);
    }

    response.status(200).json({ message: 'Liability distribution saved successfully.' });
  } catch (error) {
    console.error('Error while saving asset-based distribution:', error);
    response.status(500).json({ error: 'Internal Server Error.' });
  }
};

// Get Liability Distribution by userId
export const getLiabilityDistributionByUserId = async (request: Request, response: Response) => {
  try {
    const {userId} = request.body;

    if (!(await validUser(userId))) {
      return response.status(400).json({ error: 'Invalid User' });
    }

    const distribution = await getLiabilityDistributionService(userId);

    if (!distribution) {
      return response.status(404).json({ message: 'No distribution found for this user.' });
    }

    response.status(200).json({ userId, beneficiaries: distribution });
  } catch (error) {
    console.error('Error fetching distribution:', error);
    response.status(500).json({ error: 'Internal Server Error.' });
  }
};

// Delete Liability Distribution by userId
export const deleteLiabilityDistribution = async (request: Request, response: Response) => {
  try {
    const userId = request.params.userId;

    if (!(await validUser(userId))) {
      return response.status(400).json({ error: 'Invalid User' });
    }

    await deleteLiabilityDistributionService(userId);
    response.status(200).json({ message: 'Liability distribution deleted successfully.' });
  } catch (error) {
    console.error('Error deleting liability distribution:', error);
    response.status(500).json({ error: 'Internal Server Error.' });
  }
};
