import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import NavbarSimple from "../components/NavbarSimple";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { UserContext } from "../context/user.context";
import { ThemeContext } from "../context/theme.context";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { getDisplayName } from "../lib/utils";
import {
  Plus,
  FolderOpen,
  Users,
  Calendar,
  Trash2,
  Search,
  LayoutGrid,
  ChevronDown,
  LogOut,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import AvatarSelector from "../components/AvatarSelector";

const Home = () => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const profileMenuRef = useRef(null);
  const [createError, setCreateError] = useState("");

  const defaultImages = [
    "/Project/default1.jpg",
    "/Project/default2.jpg",
    "/Project/default3.jpg",
    "/Project/default4.jpg",
    "/Project/default5.jpg",
    "/Project/default6.jpg",
    "/Project/default7.jpg",
    "/Project/default8.jpg",
    "/Project/default9.jpg",
  ];

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    (project) =>
      project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project?.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    axios
      .get("/projects/all")
      .then((res) => {
        // Sort if backend not sorted by date
        const sortedProjects = res.data.projects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setProjects(sortedProjects);
      })
      .catch((err) => console.error(err));
  }, []);

  // Create Project
  const createProject = async (e) => {
    e.preventDefault();
    setCreateError(""); // Clear previous errors

    if (!projectName.trim()) {
      setCreateError("Project name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", projectName);
    formData.append("description", projectDesc);
    if (projectImage) formData.append("image", projectImage);

    try {
      const res = await axios.post("/projects/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.project) {
        // Prepend new project
        setProjects((prev) => [res.data.project, ...prev]);
      }

      setIsModalOpen(false);
      setProjectName("");
      setProjectDesc("");
      setProjectImage(null);
      setCreateError("");
      setActiveTab("projects"); // Switch to projects tab after creation
    } catch (err) {
      console.error(err.response?.data || err);
      // Display user-friendly error message
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create project. Please try again.";
      setCreateError(errorMessage);
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      // Call backend to delete project
      await axios.delete(`/projects/${projectToDelete._id}`);

      // Remove from local list
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));

      setShowDeleteDialog(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      // Fallback: still remove locally if backend not available
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
      <NavbarSimple />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar Navigation */}
        <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Navigation
            </h2>
            <nav className="space-y-2">
              {/* Projects Tab */}
              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "projects"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
                <span className="font-medium">Projects</span>
                <Badge variant="secondary" className="ml-auto">
                  {projects.length}
                </Badge>
              </button>

              {/* New Project Tab */}
              <button
                onClick={() => setActiveTab("new-project")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === "new-project"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">New Project</span>
              </button>
            </nav>
          </div>

          {/* User Profile Menu at Bottom */}
          <div
            className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800 relative"
            ref={profileMenuRef}
          >
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-full flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-all"
            >
              <Avatar
                alt={user?.name || user?.email}
                src={
                  user?.avatar && user.avatar !== "/avatars/default1.png"
                    ? user.avatar
                    : undefined
                }
                sx={{
                  bgcolor: "#9333ea",
                  color: "#fff",
                  width: 40,
                  height: 40,
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {getDisplayName(user)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 mx-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => {
                    setShowAvatarModal(true);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Palette className="h-4 w-4" />
                  <span>Change Avatar</span>
                </button>

                <button
                  onClick={() => {
                    toggleTheme();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-slate-200 dark:border-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Projects Tab Content */}
          {activeTab === "projects" && (
            <div className="p-8 max-w-7xl mx-auto">
              <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      My Projects
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                      Manage and organize your development projects
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                      <CardDescription>Total Projects</CardDescription>
                      <CardTitle className="text-3xl">
                        {projects.length}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardDescription>Active This Week</CardDescription>
                      <CardTitle className="text-3xl">
                        {
                          projects.filter((p) => {
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return new Date(p.createdAt) > weekAgo;
                          }).length
                        }
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <CardDescription>Collaborators</CardDescription>
                      <CardTitle className="text-3xl">
                        {
                          new Set(
                            projects.flatMap(
                              (p) => p.users?.map((u) => u._id) || [],
                            ),
                          ).size
                        }
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>

              {/* Projects Grid */}
              {filteredProjects.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">
                    No projects found matching "{searchQuery}"
                  </p>
                </div>
              )}

              {filteredProjects.length === 0 &&
                !searchQuery &&
                projects.length === 0 && (
                  <div className="text-center py-16">
                    <FolderOpen className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      No projects yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Get started by creating your first project
                    </p>
                    <Button
                      onClick={() => setActiveTab("new-project")}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Project
                    </Button>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) =>
                  project ? (
                    <Card
                      key={project._id}
                      className="group cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      onClick={() =>
                        navigate(`/project`, { state: { project } })
                      }
                    >
                      {/* Project Image */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden">
                        <img
                          src={
                            project.imageId
                              ? `http://localhost:8080/uploads/${project.imageId}`
                              : defaultImages[
                                  Math.floor(
                                    Math.random() * defaultImages.length,
                                  )
                                ]
                          }
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) =>
                            (e.target.src = "/Project/default1.jpg")
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToDelete(project);
                            setShowDeleteDialog(true);
                          }}
                          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-red-500/90 backdrop-blur-sm text-white flex items-center justify-center hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 z-10"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {/* Project Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-xl line-clamp-1">
                            {project?.name || "Untitled Project"}
                          </h3>
                        </div>
                      </div>

                      <CardContent className="pt-4 space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                          {project?.description || "No description provided."}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 pt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project?.users?.length || 0} member
                            {project?.users?.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0 pb-4">
                        {/* Collaborators */}
                        <div className="flex items-center gap-2 w-full">
                          <AvatarGroup max={4} spacing="medium">
                            {project?.users?.map((u) => {
                              const isDefaultAvatar =
                                !u.avatar ||
                                u.avatar === "/avatars/default1.png";
                              return (
                                <Avatar
                                  key={u._id}
                                  alt={u.name || u.email}
                                  src={isDefaultAvatar ? undefined : u.avatar}
                                  sx={{
                                    bgcolor: isDefaultAvatar
                                      ? "#9333ea"
                                      : undefined,
                                    color: "#fff",
                                    width: 32,
                                    height: 32,
                                    fontSize: 14,
                                    border: "2px solid white",
                                  }}
                                >
                                  {isDefaultAvatar
                                    ? u.email?.charAt(0).toUpperCase() || "?"
                                    : null}
                                </Avatar>
                              );
                            })}
                          </AvatarGroup>
                        </div>
                      </CardFooter>
                    </Card>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {/* New Project Tab Content */}
          {activeTab === "new-project" && (
            <div className="p-8 max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Create New Project
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Start a new project and collaborate with your team
              </p>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={createProject} className="space-y-6">
                    {/* Error Message */}
                    {createError && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <span className="font-semibold">Error:</span>
                          {createError}
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                          id="name"
                          placeholder="My Awesome Project"
                          value={projectName}
                          onChange={(e) => {
                            setProjectName(e.target.value);
                            setCreateError(""); // Clear error on input change
                          }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your project..."
                          rows={6}
                          value={projectDesc}
                          onChange={(e) => setProjectDesc(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setProjectName("");
                          setProjectDesc("");
                          setCreateError("");
                          setActiveTab("projects");
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 gap-2">
                        <Plus className="h-4 w-4" />
                        Create Project
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title={
          projectToDelete
            ? `Delete "${projectToDelete.name}"`
            : "Delete project"
        }
        description={
          projectToDelete
            ? `Are you sure you want to permanently delete "${projectToDelete.name}"? This cannot be undone.`
            : "Are you sure you want to permanently delete this project? This cannot be undone."
        }
        onCancel={() => {
          setShowDeleteDialog(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDelete}
      />

      {/* Avatar Selector Modal */}
      {showAvatarModal && (
        <AvatarSelector onClose={() => setShowAvatarModal(false)} />
      )}
    </main>
  );
};

export default Home;
