# Test Coverage Documentation

## Overview

This document describes the comprehensive test coverage for the **Projects** section of the SDA hackathon application.

## Test Structure

### Frontend Tests (`/frontend/src/tests/`)

#### 1. **Home Component Tests** (`screens/Home.test.jsx`)
Tests for the project list/home page functionality:

- **UI Creation Tests**
  - ✅ Renders Home component successfully
  - ✅ Displays create project button
  - ✅ Renders project cards when projects are loaded
  - ✅ Displays search input field
  - ✅ Renders navbar component

- **Project Creation Tests**
  - ✅ Opens create project modal
  - ✅ Successfully creates a new project
  - ✅ Shows error when project name is empty
  - ✅ Handles image upload

- **Project List Display Tests**
  - ✅ Filters projects based on search query
  - ✅ Displays message when no projects exist
  - ✅ Navigates to project when clicked

- **Project Deletion Tests**
  - ✅ Opens delete confirmation dialog
  - ✅ Successfully deletes a project

- **Error Handling Tests**
  - ✅ Handles API errors when fetching projects
  - ✅ Handles errors when creating a project

#### 2. **Project Component Tests** (`screens/Project.test.jsx`)
Tests for the individual project workspace:

- **UI Creation Tests**
  - ✅ Renders Project component successfully
  - ✅ Displays navbar
  - ✅ Renders file explorer section
  - ✅ Renders chat/message section
  - ✅ Renders code editor section
  - ✅ Renders preview/iframe section
  - ✅ Displays run button
  - ✅ Displays download button

- **File Operations Tests**
  - ✅ Loads project file tree from API
  - ✅ Displays files from file tree
  - ✅ Opens file when clicked
  - ✅ Updates file tree when modified

- **Chat/Messaging Tests**
  - ✅ Sends regular messages
  - ✅ Sends AI messages with @ai tag
  - ✅ Displays AI loading state

- **WebContainer Operations Tests**
  - ✅ Initializes WebContainer on mount
  - ✅ Mounts file tree to WebContainer

- **Collaborator Management Tests**
  - ✅ Fetches all users for collaboration
  - ✅ Adds collaborators to project
  - ✅ Displays project collaborators

- **Download Functionality Tests**
  - ✅ Downloads project files as ZIP

- **Error Handling Tests**
  - ✅ Handles project loading errors
  - ✅ Handles WebContainer initialization errors

#### 3. **Dev Server E2E Tests** (`e2e/devServer.test.js`)
Tests for frontend development server:

- **Frontend Server Tests**
  - ✅ Starts frontend dev server without errors
  - ✅ Responds to HTTP requests
  - ✅ Serves main index.html file
  - ✅ Loads Vite client scripts
  - ✅ Serves static assets
  - ✅ Enables Hot Module Replacement (HMR)

- **npm run dev Command Tests**
  - ✅ Executes npm run dev without syntax errors
  - ✅ Has dev script defined in package.json

- **Build Validation Tests**
  - ✅ Validates vite configuration
  - ✅ Has all required dependencies installed

- **Environment Validation Tests**
  - ✅ Supports ES modules
  - ✅ Has Node.js version compatible with Vite

### Backend Tests (`/backend/__tests__/`)

#### 1. **Project Routes Integration Tests** (`project.routes.test.js`)
API endpoint integration tests:

- **POST /projects/create**
  - ✅ Creates a new project successfully
  - ✅ Fails when project name is missing
  - ✅ Fails without authentication
  - ✅ Creates project with image upload
  - ✅ Handles duplicate project names

- **GET /projects/all**
  - ✅ Gets all projects for authenticated user
  - ✅ Fails without authentication
  - ✅ Returns empty array when user has no projects
  - ✅ Populates user information in projects

- **GET /projects/get-project/:projectId**
  - ✅ Gets project by ID
  - ✅ Fails with invalid project ID
  - ✅ Fails without authentication
  - ✅ Returns 404 for non-existent project

- **PUT /projects/add-user**
  - ✅ Adds user to project
  - ✅ Fails with invalid project ID
  - ✅ Fails when users array is empty
  - ✅ Does not add duplicate users
  - ✅ Fails if user does not belong to project

- **PUT /projects/update-file-tree**
  - ✅ Updates project file tree
  - ✅ Fails with missing fileTree
  - ✅ Fails with invalid projectId

- **DELETE /projects/:projectId**
  - ✅ Deletes project successfully
  - ✅ Fails to delete project user does not own
  - ✅ Fails without authentication

#### 2. **Project Service Tests** (`project.service.test.js`)
Business logic unit tests:

- **createProject**
  - ✅ Creates a new project successfully
  - ✅ Creates project without description
  - ✅ Creates project with imageId
  - ✅ Throws error when name is missing
  - ✅ Throws error when users array is empty
  - ✅ Handles duplicate project names
  - ✅ Populates users data

- **getAllProjectByUserId**
  - ✅ Gets all projects for a user
  - ✅ Returns empty array for user with no projects
  - ✅ Throws error when userId is missing
  - ✅ Sorts projects by creation date

- **getProjectById**
  - ✅ Gets project by ID
  - ✅ Throws error when projectId is missing
  - ✅ Throws error for invalid projectId
  - ✅ Throws error when project not found

- **addUsersToProject**
  - ✅ Adds users to project
  - ✅ Does not add duplicate users
  - ✅ Throws error when projectId is missing
  - ✅ Throws error when user does not belong to project
  - ✅ Handles adding multiple users at once

- **updateFileTree**
  - ✅ Updates project file tree
  - ✅ Throws error when projectId is missing
  - ✅ Throws error when fileTree is not an object
  - ✅ Handles complex file tree structures

- **deleteProject**
  - ✅ Deletes project successfully
  - ✅ Throws error when user does not belong to project
  - ✅ Throws error for non-existent project

#### 3. **Backend Dev Server Tests** (`devServer.test.js`)
Backend server startup tests:

- **Server Process Tests**
  - ✅ Starts backend dev server without errors
  - ✅ Has npm run dev script defined

- **HTTP Server Tests**
  - ✅ Responds to HTTP requests
  - ✅ Has CORS configured

- **API Endpoints Tests**
  - ✅ Has project routes available
  - ✅ Has auth routes available
  - ✅ Has user routes available

- **Database Connection Tests**
  - ✅ Connects to MongoDB

- **Middleware Tests**
  - ✅ Has body parser configured
  - ✅ Has cookie parser configured

- **Error Handling Tests**
  - ✅ Handles invalid routes gracefully
  - ✅ Handles malformed JSON

- **Environment Configuration Tests**
  - ✅ Loads environment variables
  - ✅ Runs in development mode

## Running Tests

### Frontend Tests

```bash
cd SDA/frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests only
npm run test:e2e
```

### Backend Tests

```bash
cd SDA/backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage Goals

- **Frontend**: >80% coverage for components and utilities
- **Backend**: >90% coverage for services, controllers, and routes
- **E2E**: Verify both servers start successfully without errors

## Test Technologies Used

### Frontend
- **Vitest**: Fast test runner optimized for Vite
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **jsdom/happy-dom**: DOM environment for tests

### Backend
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory MongoDB for tests
- **Node spawn**: Process testing for dev server

## Continuous Integration

These tests are designed to be run in CI/CD pipelines to ensure:

1. ✅ UI components render correctly
2. ✅ All API endpoints function properly
3. ✅ `npm run dev` starts both servers without errors
4. ✅ Database operations work correctly
5. ✅ Authentication and authorization are enforced
6. ✅ Error handling is robust

## Test Maintenance

- Tests should be updated when features are added or modified
- All new features in the Projects section must include tests
- Coverage should not drop below the defined thresholds
- E2E tests should be run before any production deployment

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**: Ensure MongoDB is running or use MongoDB Memory Server
2. **Port Conflicts**: Change ports in test files if 3000/5173 are in use
3. **Timeout Errors**: Increase timeout values for slower systems
4. **Module Resolution**: Ensure all dependencies are installed

### Debug Mode

```bash
# Frontend
npm test -- --reporter=verbose

# Backend
npm test -- --verbose
```

## Next Steps

1. Add visual regression tests using Playwright or Cypress
2. Add performance tests for file operations
3. Add load testing for concurrent users
4. Add security testing for authentication flows
5. Integrate with CI/CD pipeline (GitHub Actions, Jenkins, etc.)

## Summary

This comprehensive test suite ensures:
- ✅ **UI is created successfully** - All components render and display correctly
- ✅ **npm run dev executes without errors** - Both frontend and backend servers start
- ✅ **Servers start successfully** - HTTP endpoints respond correctly
- ✅ **All operations work** - CRUD operations, file management, collaboration features
- ✅ **Error handling is robust** - Graceful degradation and proper error messages
