import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

export type Role = 'owner' | 'admin' | 'collaborator';

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface TeamMember {
  userId: string;
  role: Role;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  assigneeId?: string;
  statusId: string;
}

export interface Status {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  statuses: Status[];
  tasks: Task[];
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  projects: Project[];
}

export interface AppState {
  currentUser?: User;
  teams: Team[];
  theme: 'light' | 'dark';
}

const defaultState: AppState = {
  currentUser: undefined,
  teams: [],
  theme: 'light',
};

const AppContext = createContext<{
  state: AppState;
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, password: string) => void;
  createTeam: (name: string) => void;
  createProject: (teamId: string, name: string) => void;
  addTask: (teamId: string, projectId: string, task: Omit<Task, 'id'>) => void;
  updateTheme: (theme: 'light' | 'dark') => void;
}>(null as any);

const STORAGE_KEY = 'veloxity-data';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('loadState', e);
  }
  return defaultState;
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const login = (username: string, password: string) => {
    const user: User = { id: uuid(), username, password };
    setState({ ...state, currentUser: user });
  };

  const register = login;

  const logout = () => setState({ ...state, currentUser: undefined });

  const createTeam = (name: string) => {
    if (!state.currentUser) return;
    const team: Team = {
      id: uuid(),
      name,
      members: [{ userId: state.currentUser.id, role: 'owner' }],
      projects: [],
    };
    setState({ ...state, teams: [...state.teams, team] });
  };

  const createProject = (teamId: string, name: string) => {
    setState({
      ...state,
      teams: state.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              projects: [
                ...t.projects,
                { id: uuid(), teamId, name, statuses: [
                  { id: 'todo', name: 'Todo' },
                  { id: 'inprogress', name: 'In Progress' },
                  { id: 'done', name: 'Done' },
                ], tasks: [] },
              ],
            }
          : t
      ),
    });
  };

  const addTask = (teamId: string, projectId: string, task: Omit<Task, 'id'>) => {
    setState({
      ...state,
      teams: state.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              projects: t.projects.map((p) =>
                p.id === projectId
                  ? { ...p, tasks: [...p.tasks, { ...task, id: uuid() }] }
                  : p
              ),
            }
          : t
      ),
    });
  };

  const updateTheme = (theme: 'light' | 'dark') => setState({ ...state, theme });

  return (
    <AppContext.Provider value={{ state, login, logout, register, createTeam, createProject, addTask, updateTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
