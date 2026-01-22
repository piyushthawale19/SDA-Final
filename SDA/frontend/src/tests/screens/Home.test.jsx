import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../screens/Home';
import { UserContext } from '../../context/user.context';
import { ThemeContext } from '../../context/theme.context';
import axios from '../../config/axios';

// Mock axios
vi.mock('../../config/axios');

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home Component - Projects Section', () => {
  const mockUser = {
    _id: '123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockProjects = [
    {
      _id: 'proj1',
      name: 'Test Project 1',
      description: 'Test Description 1',
      users: [mockUser],
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'proj2',
      name: 'Test Project 2',
      description: 'Test Description 2',
      users: [mockUser],
      createdAt: new Date().toISOString(),
    },
  ];

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: mockUser, setUser: vi.fn() }}>
          <ThemeContext.Provider value={{ theme: 'light', toggleTheme: vi.fn() }}>
            <Home />
          </ThemeContext.Provider>
        </UserContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: { projects: mockProjects } });
  });

  describe('UI Creation Tests', () => {
    it('should render the Home component successfully', async () => {
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText(/my projects/i)).toBeInTheDocument();
      });
    });

    it('should display the create project button', async () => {
      renderHome();
      
      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /new project/i });
        expect(createButton).toBeInTheDocument();
      });
    });

    it('should render project cards when projects are loaded', async () => {
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Test Project 2')).toBeInTheDocument();
      });
    });

    it('should display search input field', async () => {
      renderHome();
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/search projects/i);
        expect(searchInput).toBeInTheDocument();
      });
    });

    it('should render navbar component', async () => {
      renderHome();
      
      await waitFor(() => {
        // NavbarSimple should be rendered
        expect(document.querySelector('nav')).toBeInTheDocument();
      });
    });
  });

  describe('Project Creation Tests', () => {
    it('should open create project modal when button is clicked', async () => {
      const user = userEvent.setup();
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /new project/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText(/create new project/i)).toBeInTheDocument();
      });
    });

    it('should successfully create a new project', async () => {
      const user = userEvent.setup();
      const newProject = {
        _id: 'proj3',
        name: 'New Test Project',
        description: 'New Description',
        users: [mockUser],
      };

      axios.post.mockResolvedValueOnce({ data: { project: newProject } });
      
      renderHome();
      
      // Open modal
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
      });
      const createButton = screen.getByRole('button', { name: /new project/i });
      await user.click(createButton);
      
      // Fill form
      await waitFor(() => {
        expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
      });
      
      const nameInput = screen.getByLabelText(/project name/i);
      const descInput = screen.getByLabelText(/description/i);
      
      await user.type(nameInput, 'New Test Project');
      await user.type(descInput, 'New Description');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create project/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/projects/create',
          expect.any(FormData)
        );
      });
    });

    it('should show error when project name is empty', async () => {
      const user = userEvent.setup();
      renderHome();
      
      // Open modal
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
      });
      const createButton = screen.getByRole('button', { name: /new project/i });
      await user.click(createButton);
      
      // Try to submit without filling name
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
      });
      
      const submitButton = screen.getByRole('button', { name: /create project/i });
      await user.click(submitButton);
      
      // Should not call API
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('Project List Display Tests', () => {
    it('should filter projects based on search query', async () => {
      const user = userEvent.setup();
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Test Project 2')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText(/search projects/i);
      await user.type(searchInput, 'Project 1');
      
      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Project 2')).not.toBeInTheDocument();
      });
    });

    it('should display message when no projects exist', async () => {
      axios.get.mockResolvedValueOnce({ data: { projects: [] } });
      
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
      });
    });

    it('should navigate to project when project card is clicked', async () => {
      const user = userEvent.setup();
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });
      
      const projectCard = screen.getByText('Test Project 1').closest('div[role="button"]');
      if (projectCard) {
        await user.click(projectCard);
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(
            '/project',
            expect.objectContaining({
              state: expect.objectContaining({
                project: expect.objectContaining({ name: 'Test Project 1' }),
              }),
            })
          );
        });
      }
    });
  });

  describe('Project Deletion Tests', () => {
    it('should open delete confirmation dialog', async () => {
      const user = userEvent.setup();
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });
      
      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => 
        btn.querySelector('svg') && btn.getAttribute('aria-label')?.includes('delete')
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
        
        await waitFor(() => {
          expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
        });
      }
    });

    it('should successfully delete a project', async () => {
      const user = userEvent.setup();
      axios.delete.mockResolvedValueOnce({ data: { success: true } });
      
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      });
      
      // Simulate delete action
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => 
        btn.querySelector('svg') && btn.getAttribute('aria-label')?.includes('delete')
      );
      
      if (deleteButton) {
        await user.click(deleteButton);
        
        await waitFor(() => {
          const confirmButton = screen.getByRole('button', { name: /confirm|delete/i });
          if (confirmButton) {
            user.click(confirmButton);
          }
        });
        
        await waitFor(() => {
          expect(axios.delete).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle API errors when fetching projects', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValueOnce(new Error('Network Error'));
      
      renderHome();
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle errors when creating a project', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce(new Error('Creation failed'));
      
      renderHome();
      
      // Open modal and try to create
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
      });
      
      const createButton = screen.getByRole('button', { name: /new project/i });
      await user.click(createButton);
      
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/project name/i);
        user.type(nameInput, 'Test');
      });
      
      const submitButton = screen.getByRole('button', { name: /create project/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        // Should show error message
        expect(screen.queryByText(/error/i)).toBeInTheDocument();
      });
    });
  });
});
