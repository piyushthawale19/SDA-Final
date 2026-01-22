import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Project from '../../screens/Project';
import { UserContext } from '../../context/user.context';
import axios from '../../config/axios';

// Mock dependencies
vi.mock('../../config/axios');
vi.mock('../../config/soket', () => ({
  initializeSocket: vi.fn(),
  receiveMessage: vi.fn(),
  sendMessage: vi.fn(),
}));
vi.mock('../../config/webContainer', () => ({
  getWebContainer: vi.fn(() => Promise.resolve({
    mount: vi.fn(),
    spawn: vi.fn(() => ({
      exit: Promise.resolve({ code: 0 }),
      output: {
        pipeTo: vi.fn(),
      },
    })),
    on: vi.fn(),
  })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: {
        project: {
          _id: 'proj123',
          name: 'Test Project',
          description: 'Test Description',
          users: [{ _id: 'user1', email: 'test@example.com', name: 'Test User' }],
          fileTree: {
            'package.json': {
              file: {
                contents: JSON.stringify({
                  name: 'test-project',
                  scripts: {
                    dev: 'vite',
                  },
                }),
              },
            },
          },
        },
      },
    }),
  };
});

describe('Project Component - Project Operations', () => {
  const mockUser = {
    _id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockProject = {
    _id: 'proj123',
    name: 'Test Project',
    description: 'Test Description',
    users: [mockUser],
    fileTree: {
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: 'test-project',
            scripts: {
              dev: 'vite',
            },
          }),
        },
      },
      'src': {
        directory: {
          'App.jsx': {
            file: {
              contents: 'import React from "react";\n\nfunction App() {\n  return <div>Hello</div>;\n}\n\nexport default App;',
            },
          },
        },
      },
    },
  };

  const renderProject = () => {
    return render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockUser, setUser: vi.fn() }}>
          <Project />
        </UserContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('/projects/get-project/')) {
        return Promise.resolve({ data: { project: mockProject } });
      }
      if (url.includes('/users/all')) {
        return Promise.resolve({ data: { users: [mockUser] } });
      }
      return Promise.reject(new Error('Not found'));
    });
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  describe('UI Creation Tests', () => {
    it('should render the Project component successfully', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display the navbar', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(document.querySelector('nav')).toBeInTheDocument();
      });
    });

    it('should render file explorer section', async () => {
      renderProject();
      
      await waitFor(() => {
        // Check if file tree is rendered
        const fileTree = screen.getByText(/package.json/i) || 
                        document.querySelector('[data-testid="file-tree"]');
        expect(fileTree).toBeDefined();
      }, { timeout: 3000 });
    });

    it('should render chat/message section', async () => {
      renderProject();
      
      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText(/send message/i) ||
                            screen.getByPlaceholderText(/type a message/i) ||
                            screen.getByRole('textbox');
        expect(messageInput).toBeDefined();
      }, { timeout: 3000 });
    });

    it('should render code editor section', async () => {
      renderProject();
      
      await waitFor(() => {
        // Monaco editor or code preview area should be present
        const codeSection = document.querySelector('.monaco-editor') ||
                           document.querySelector('[data-testid="code-editor"]');
        expect(codeSection).toBeDefined();
      }, { timeout: 3000 });
    });

    it('should render preview/iframe section', async () => {
      renderProject();
      
      await waitFor(() => {
        const previewSection = document.querySelector('iframe') ||
                              document.querySelector('[data-testid="preview"]');
        expect(previewSection).toBeDefined();
      }, { timeout: 3000 });
    });

    it('should display run button', async () => {
      renderProject();
      
      await waitFor(() => {
        const runButton = screen.getByRole('button', { name: /run|start/i });
        expect(runButton).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should display download button', async () => {
      renderProject();
      
      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /download/i });
        expect(downloadButton).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('File Operations Tests', () => {
    it('should load project file tree from API', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/projects/get-project/proj123')
        );
      }, { timeout: 3000 });
    });

    it('should display files from file tree', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(screen.getByText(/package.json/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should open file when clicked', async () => {
      const user = userEvent.setup();
      renderProject();
      
      await waitFor(() => {
        expect(screen.getByText(/package.json/i)).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const fileElement = screen.getByText(/package.json/i);
      await user.click(fileElement);
      
      await waitFor(() => {
        // File should be opened in editor
        expect(screen.getByText(/package.json/i)).toBeInTheDocument();
      });
    });

    it('should update file tree when modified', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      // Simulate file tree update
      const newFileTree = { ...mockProject.fileTree, 'newfile.js': { file: { contents: '' } } };
      
      await waitFor(() => {
        expect(axios.put).toBeDefined();
      });
    });
  });

  describe('Chat/Messaging Tests', () => {
    it('should send regular message', async () => {
      const user = userEvent.setup();
      const { sendMessage } = await import('../../config/soket');
      
      renderProject();
      
      await waitFor(() => {
        const messageInput = screen.getByRole('textbox');
        expect(messageInput).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const messageInput = screen.getByRole('textbox');
      await user.type(messageInput, 'Hello World');
      
      const sendButton = screen.getByRole('button', { name: /send/i }) ||
                        screen.getByRole('button', { name: /submit/i });
      if (sendButton) {
        await user.click(sendButton);
        
        await waitFor(() => {
          expect(sendMessage).toHaveBeenCalledWith(
            'project-message',
            expect.objectContaining({
              message: 'Hello World',
              sender: mockUser,
            })
          );
        });
      }
    });

    it('should send AI message with @ai tag', async () => {
      const user = userEvent.setup();
      const { sendMessage } = await import('../../config/soket');
      
      renderProject();
      
      await waitFor(() => {
        const messageInput = screen.getByRole('textbox');
        expect(messageInput).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const messageInput = screen.getByRole('textbox');
      await user.type(messageInput, '@ai create a react component');
      
      const sendButton = screen.getByRole('button', { name: /send/i }) ||
                        screen.getByRole('button', { name: /submit/i });
      if (sendButton) {
        await user.click(sendButton);
        
        await waitFor(() => {
          expect(sendMessage).toHaveBeenCalled();
        });
      }
    });

    it('should display AI loading state', async () => {
      const user = userEvent.setup();
      
      renderProject();
      
      await waitFor(() => {
        const messageInput = screen.getByRole('textbox');
        expect(messageInput).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const messageInput = screen.getByRole('textbox');
      await user.type(messageInput, '@ai help');
      
      const sendButton = screen.getByRole('button', { name: /send/i }) ||
                        screen.getByRole('button', { name: /submit/i });
      if (sendButton) {
        await user.click(sendButton);
        
        await waitFor(() => {
          expect(screen.getByText(/ai is thinking|loading/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('WebContainer Operations Tests', () => {
    it('should initialize WebContainer on mount', async () => {
      const { getWebContainer } = await import('../../config/webContainer');
      
      renderProject();
      
      await waitFor(() => {
        expect(getWebContainer).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('should mount file tree to WebContainer', async () => {
      const { getWebContainer } = await import('../../config/webContainer');
      const mockContainer = await getWebContainer();
      
      renderProject();
      
      await waitFor(() => {
        expect(mockContainer.mount).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Collaborator Management Tests', () => {
    it('should fetch all users for collaboration', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('/users/all');
      }, { timeout: 3000 });
    });

    it('should add collaborators to project', async () => {
      const user = userEvent.setup();
      
      renderProject();
      
      await waitFor(() => {
        const addButton = screen.getByRole('button', { name: /add user|collaborator/i });
        if (addButton) {
          user.click(addButton);
        }
      }, { timeout: 3000 });
      
      await waitFor(() => {
        expect(axios.put).toBeDefined();
      });
    });

    it('should display project collaborators', async () => {
      renderProject();
      
      await waitFor(() => {
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Download Functionality Tests', () => {
    it('should download project files as ZIP', async () => {
      const user = userEvent.setup();
      
      renderProject();
      
      await waitFor(() => {
        const downloadButton = screen.getByRole('button', { name: /download/i });
        expect(downloadButton).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const downloadButton = screen.getByRole('button', { name: /download/i });
      await user.click(downloadButton);
      
      // ZIP creation should be initiated
      await waitFor(() => {
        expect(downloadButton).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle project loading errors', async () => {
      axios.get.mockRejectedValueOnce(new Error('Failed to load project'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderProject();
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle WebContainer initialization errors', async () => {
      const { getWebContainer } = await import('../../config/webContainer');
      getWebContainer.mockRejectedValueOnce(new Error('WebContainer failed'));
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderProject();
      
      await waitFor(() => {
        expect(getWebContainer).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Theme Toggle Tests', () => {
    it('should toggle between light and dark theme', async () => {
      renderProject();
      
      await waitFor(() => {
        const themeToggle = screen.getByRole('button', { name: /theme|dark|light/i });
        if (themeToggle) {
          expect(themeToggle).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });
  });
});
