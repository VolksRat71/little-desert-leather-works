import express from 'express';
import { prisma } from '../index';
import { z } from 'zod';

const router = express.Router();

// Schema validation for user creation/update
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().optional()
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Don't include sensitive data or full order details in the list
        _count: {
          select: { orders: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const validationResult = userSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.format()
      });
    }

    const userData = validationResult.data;

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = await prisma.user.create({
      data: userData
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validationResult = userSchema.partial().safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationResult.error.format()
      });
    }

    const userData = validationResult.data;

    // If trying to update email, check if it's already taken
    if (userData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: userData.email,
          NOT: { id }
        }
      });

      if (existingUser) {
        return res.status(409).json({ error: 'Email is already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
