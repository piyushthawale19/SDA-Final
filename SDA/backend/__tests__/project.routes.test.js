import request from 'supertest';
import express from 'express';
import projectRoutes from '../routes/project.routes.js';
import userModel from '../models/user.model.js';
import projectModel from '../models/project.model.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/projects', projectRoutes);

describe('Project Routes Integration Tests', () => {
  let authToken;
  let testUser;
  let testProject;

  beforeEach(async () => {
    // Create test user
    testUser = await userModel.create({
      email: 'test@example.com',
      password: 'hashedpassword123',
      name: 'Test User',
    });

    // Generate auth token
    authToken = jwt.sign(
      { email: testUser.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '24h' }
    );

    // Create test project
    testProject = await projectModel.create({
      name: 'test project',
      description: 'Test Description',
      users: [testUser._id],
    });
  });

  describe('POST /projects/create', () => {
    it('should create a new project successfully', async () => {
      const response = await request(app)
        .post('/projects/create')
        .set('Cookie', `token=${authToken}`)
        .field('name', 'New Test Project')
        .field('description', 'New project description');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project).toHaveProperty('name', 'new test project');
      expect(response.body.project).toHaveProperty('description', 'New project description');
    });

    it('should fail when project name is missing', async () => {
      const response = await request(app)
        .post('/projects/create')
        .set('Cookie', `token=${authToken}`)
        .field('description', 'Description without name');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/projects/create')
        .field('name', 'Unauthorized Project');

      expect(response.status).toBe(401);
    });

    it('should create project with image upload', async () => {
      const response = await request(app)
        .post('/projects/create')
        .set('Cookie', `token=${authToken}`)
        .field('name', 'Project With Image')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(201);
      expect(response.body.project).toHaveProperty('imageId');
    });

    it('should handle duplicate project names', async () => {
      // First project
      await request(app)
        .post('/projects/create')
        .set('Cookie', `token=${authToken}`)
        .field('name', 'Duplicate Name');

      // Try to create duplicate
      const response = await request(app)
        .post('/projects/create')
        .set('Cookie', `token=${authToken}`)
        .field('name', 'Duplicate Name');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /projects/all', () => {
    it('should get all projects for authenticated user', async () => {
      const response = await request(app)
        .get('/projects/all')
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/projects/all');

      expect(response.status).toBe(401);
    });

    it('should return empty array when user has no projects', async () => {
      // Create new user with no projects
      const newUser = await userModel.create({
        email: 'noproject@example.com',
        password: 'password123',
        name: 'No Project User',
      });

      const newToken = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .get('/projects/all')
        .set('Cookie', `token=${newToken}`);

      expect(response.status).toBe(200);
      expect(response.body.projects).toHaveLength(0);
    });

    it('should populate user information in projects', async () => {
      const response = await request(app)
        .get('/projects/all')
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.projects[0].users[0]).toHaveProperty('email');
      expect(response.body.projects[0].users[0]).toHaveProperty('name');
    });
  });

  describe('GET /projects/get-project/:projectId', () => {
    it('should get project by ID', async () => {
      const response = await request(app)
        .get(`/projects/get-project/${testProject._id}`)
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('project');
      expect(response.body.project._id.toString()).toBe(testProject._id.toString());
    });

    it('should fail with invalid project ID', async () => {
      const response = await request(app)
        .get('/projects/get-project/invalid-id')
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(400);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/projects/get-project/${testProject._id}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/projects/get-project/${fakeId}`)
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /projects/add-user', () => {
    let collaborator;

    beforeEach(async () => {
      collaborator = await userModel.create({
        email: 'collaborator@example.com',
        password: 'password123',
        name: 'Collaborator',
      });
    });

    it('should add user to project', async () => {
      const response = await request(app)
        .put('/projects/add-user')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: testProject._id.toString(),
          users: [collaborator._id.toString()],
        });

      expect(response.status).toBe(200);
      expect(response.body.project.users).toContainEqual(
        expect.objectContaining({ email: 'collaborator@example.com' })
      );
    });

    it('should fail with invalid project ID', async () => {
      const response = await request(app)
        .put('/projects/add-user')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: 'invalid-id',
          users: [collaborator._id.toString()],
        });

      expect(response.status).toBe(400);
    });

    it('should fail when users array is empty', async () => {
      const response = await request(app)
        .put('/projects/add-user')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: testProject._id.toString(),
          users: [],
        });

      expect(response.status).toBe(400);
    });

    it('should not add duplicate users', async () => {
      // Add user first time
      await request(app)
        .put('/projects/add-user')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: testProject._id.toString(),
          users: [collaborator._id.toString()],
        });

      // Try to add same user again
      const response = await request(app)
        .put('/projects/add-user')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: testProject._id.toString(),
          users: [collaborator._id.toString()],
        });

      expect(response.status).toBe(200);
      const project = await projectModel.findById(testProject._id);
      const userCount = project.users.filter(
        (id) => id.toString() === collaborator._id.toString()
      ).length;
      expect(userCount).toBe(1);
    });

    it('should fail if user does not belong to project', async () => {
      const otherUser = await userModel.create({
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User',
      });

      const otherToken = jwt.sign(
        { email: otherUser.email },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .put('/projects/add-user')
        .set('Cookie', `token=${otherToken}`)
        .send({
          projectId: testProject._id.toString(),
          users: [collaborator._id.toString()],
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /projects/update-file-tree', () => {
    it('should update project file tree', async () => {
      const fileTree = {
        'package.json': {
          file: {
            contents: JSON.stringify({ name: 'test', version: '1.0.0' }),
          },
        },
        src: {
          directory: {
            'App.jsx': {
              file: {
                contents: 'import React from "react";',
              },
            },
          },
        },
      };

      const response = await request(app)
        .put('/projects/update-file-tree')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: testProject._id.toString(),
          fileTree,
        });

      expect(response.status).toBe(200);
      expect(response.body.project.fileTree).toEqual(fileTree);
    });

    it('should fail with missing fileTree', async () => {
      const response = await request(app)
        .put('/projects/update-file-tree')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: testProject._id.toString(),
        });

      expect(response.status).toBe(400);
    });

    it('should fail with invalid projectId', async () => {
      const response = await request(app)
        .put('/projects/update-file-tree')
        .set('Cookie', `token=${authToken}`)
        .send({
          projectId: 'invalid-id',
          fileTree: {},
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /projects/:projectId', () => {
    it('should delete project successfully', async () => {
      const response = await request(app)
        .delete(`/projects/${testProject._id}`)
        .set('Cookie', `token=${authToken}`);

      expect(response.status).toBe(200);
      
      const deletedProject = await projectModel.findById(testProject._id);
      expect(deletedProject).toBeNull();
    });

    it('should fail to delete project user does not own', async () => {
      const otherUser = await userModel.create({
        email: 'other@example.com',
        password: 'password123',
        name: 'Other User',
      });

      const otherToken = jwt.sign(
        { email: otherUser.email },
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .delete(`/projects/${testProject._id}`)
        .set('Cookie', `token=${otherToken}`);

      expect(response.status).toBe(400);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/projects/${testProject._id}`);

      expect(response.status).toBe(401);
    });
  });
});
