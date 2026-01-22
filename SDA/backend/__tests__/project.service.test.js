import * as projectService from '../services/project.service.js';
import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';

describe('Project Service Tests', () => {
  let testUserId;
  let testProject;

  beforeEach(async () => {
    testUserId = new mongoose.Types.ObjectId();
    testProject = await projectModel.create({
      name: 'test service project',
      description: 'Service test description',
      users: [testUserId],
    });
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'New Project',
        description: 'New Description',
        users: [testUserId],
      };

      const result = await projectService.createProject(projectData);

      expect(result).toBeDefined();
      expect(result.name).toBe('new project');
      expect(result.description).toBe('New Description');
      expect(result.users).toContainEqual(testUserId);
    });

    it('should create project without description', async () => {
      const projectData = {
        name: 'Minimal Project',
        users: [testUserId],
      };

      const result = await projectService.createProject(projectData);

      expect(result).toBeDefined();
      expect(result.description).toBe('');
    });

    it('should create project with imageId', async () => {
      const projectData = {
        name: 'Project With Image',
        users: [testUserId],
        imageId: 'image-123.jpg',
      };

      const result = await projectService.createProject(projectData);

      expect(result).toBeDefined();
      expect(result.imageId).toBe('image-123.jpg');
    });

    it('should throw error when name is missing', async () => {
      const projectData = {
        users: [testUserId],
      };

      await expect(projectService.createProject(projectData)).rejects.toThrow(
        'Project name is required'
      );
    });

    it('should throw error when users array is empty', async () => {
      const projectData = {
        name: 'No Users Project',
        users: [],
      };

      await expect(projectService.createProject(projectData)).rejects.toThrow(
        'Users array is required'
      );
    });

    it('should throw error when users is not provided', async () => {
      const projectData = {
        name: 'No Users Project',
      };

      await expect(projectService.createProject(projectData)).rejects.toThrow(
        'Users array is required'
      );
    });

    it('should handle duplicate project names', async () => {
      const projectData = {
        name: 'test service project',
        users: [testUserId],
      };

      await expect(projectService.createProject(projectData)).rejects.toThrow(
        'Project name already exists'
      );
    });

    it('should populate users data', async () => {
      const userId = new mongoose.Types.ObjectId();
      const projectData = {
        name: 'Populated Project',
        users: [userId],
      };

      const result = await projectService.createProject(projectData);

      expect(result).toBeDefined();
      expect(result.users).toBeDefined();
    });
  });

  describe('getAllProjectByUserId', () => {
    it('should get all projects for a user', async () => {
      const projects = await projectService.getAllProjectByUserId({
        userId: testUserId,
      });

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0].users).toContainEqual(testUserId);
    });

    it('should return empty array for user with no projects', async () => {
      const newUserId = new mongoose.Types.ObjectId();
      const projects = await projectService.getAllProjectByUserId({
        userId: newUserId,
      });

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(0);
    });

    it('should throw error when userId is missing', async () => {
      await expect(
        projectService.getAllProjectByUserId({})
      ).rejects.toThrow('User ID is required');
    });

    it('should sort projects by creation date', async () => {
      // Create another project
      await projectModel.create({
        name: 'newer project',
        users: [testUserId],
      });

      const projects = await projectService.getAllProjectByUserId({
        userId: testUserId,
      });

      expect(projects[0].name).toBe('newer project');
    });
  });

  describe('getProjectById', () => {
    it('should get project by ID', async () => {
      const result = await projectService.getProjectById({
        projectId: testProject._id,
      });

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(testProject._id.toString());
      expect(result.name).toBe('test service project');
    });

    it('should throw error when projectId is missing', async () => {
      await expect(projectService.getProjectById({})).rejects.toThrow(
        'Project ID is required'
      );
    });

    it('should throw error for invalid projectId', async () => {
      await expect(
        projectService.getProjectById({ projectId: 'invalid-id' })
      ).rejects.toThrow('Invalid project ID');
    });

    it('should throw error when project not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        projectService.getProjectById({ projectId: fakeId })
      ).rejects.toThrow('Project not found');
    });
  });

  describe('addUsersToProject', () => {
    let collaboratorId;

    beforeEach(() => {
      collaboratorId = new mongoose.Types.ObjectId();
    });

    it('should add users to project', async () => {
      const result = await projectService.addUsersToProject({
        projectId: testProject._id,
        users: [collaboratorId],
        userId: testUserId,
      });

      expect(result).toBeDefined();
      expect(result.users).toContainEqual(collaboratorId);
    });

    it('should not add duplicate users', async () => {
      await projectService.addUsersToProject({
        projectId: testProject._id,
        users: [collaboratorId],
        userId: testUserId,
      });

      const result = await projectService.addUsersToProject({
        projectId: testProject._id,
        users: [collaboratorId],
        userId: testUserId,
      });

      const userCount = result.users.filter(
        (id) => id.toString() === collaboratorId.toString()
      ).length;
      expect(userCount).toBe(1);
    });

    it('should throw error when projectId is missing', async () => {
      await expect(
        projectService.addUsersToProject({
          users: [collaboratorId],
          userId: testUserId,
        })
      ).rejects.toThrow('Project ID is required');
    });

    it('should throw error when users array is missing', async () => {
      await expect(
        projectService.addUsersToProject({
          projectId: testProject._id,
          userId: testUserId,
        })
      ).rejects.toThrow('Invalid users array');
    });

    it('should throw error when userId is missing', async () => {
      await expect(
        projectService.addUsersToProject({
          projectId: testProject._id,
          users: [collaboratorId],
        })
      ).rejects.toThrow('Logged-in user ID is required');
    });

    it('should throw error when user does not belong to project', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      await expect(
        projectService.addUsersToProject({
          projectId: testProject._id,
          users: [collaboratorId],
          userId: otherUserId,
        })
      ).rejects.toThrow('User does not belong to this project');
    });

    it('should handle adding multiple users at once', async () => {
      const user2Id = new mongoose.Types.ObjectId();
      const user3Id = new mongoose.Types.ObjectId();

      const result = await projectService.addUsersToProject({
        projectId: testProject._id,
        users: [collaboratorId, user2Id, user3Id],
        userId: testUserId,
      });

      expect(result.users).toContainEqual(collaboratorId);
      expect(result.users).toContainEqual(user2Id);
      expect(result.users).toContainEqual(user3Id);
    });
  });

  describe('updateFileTree', () => {
    it('should update project file tree', async () => {
      const fileTree = {
        'package.json': {
          file: {
            contents: '{"name": "test"}',
          },
        },
      };

      const result = await projectService.updateFileTree({
        projectId: testProject._id,
        fileTree,
      });

      expect(result).toBeDefined();
      expect(result.fileTree).toEqual(fileTree);
    });

    it('should throw error when projectId is missing', async () => {
      await expect(
        projectService.updateFileTree({ fileTree: {} })
      ).rejects.toThrow('Project ID is required');
    });

    it('should throw error when fileTree is missing', async () => {
      await expect(
        projectService.updateFileTree({ projectId: testProject._id })
      ).rejects.toThrow('fileTree must be an object');
    });

    it('should throw error when fileTree is not an object', async () => {
      await expect(
        projectService.updateFileTree({
          projectId: testProject._id,
          fileTree: 'not an object',
        })
      ).rejects.toThrow('fileTree must be an object');
    });

    it('should throw error when project not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        projectService.updateFileTree({
          projectId: fakeId,
          fileTree: {},
        })
      ).rejects.toThrow('Project not found');
    });

    it('should handle complex file tree structures', async () => {
      const complexFileTree = {
        src: {
          directory: {
            components: {
              directory: {
                'App.jsx': {
                  file: {
                    contents: 'import React from "react";',
                  },
                },
              },
            },
          },
        },
        'package.json': {
          file: {
            contents: '{}',
          },
        },
      };

      const result = await projectService.updateFileTree({
        projectId: testProject._id,
        fileTree: complexFileTree,
      });

      expect(result.fileTree).toEqual(complexFileTree);
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const result = await projectService.deleteProject({
        projectId: testProject._id,
        userId: testUserId,
      });

      expect(result).toEqual({ success: true });

      const deletedProject = await projectModel.findById(testProject._id);
      expect(deletedProject).toBeNull();
    });

    it('should throw error when projectId is missing', async () => {
      await expect(
        projectService.deleteProject({ userId: testUserId })
      ).rejects.toThrow('Project ID is required');
    });

    it('should throw error when userId is missing', async () => {
      await expect(
        projectService.deleteProject({ projectId: testProject._id })
      ).rejects.toThrow('User ID is required');
    });

    it('should throw error when user does not belong to project', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      await expect(
        projectService.deleteProject({
          projectId: testProject._id,
          userId: otherUserId,
        })
      ).rejects.toThrow('Project not found or user does not have permission');
    });

    it('should throw error for invalid projectId', async () => {
      await expect(
        projectService.deleteProject({
          projectId: 'invalid-id',
          userId: testUserId,
        })
      ).rejects.toThrow('Invalid project ID');
    });

    it('should throw error for non-existent project', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(
        projectService.deleteProject({
          projectId: fakeId,
          userId: testUserId,
        })
      ).rejects.toThrow('Project not found or user does not have permission');
    });
  });
});
