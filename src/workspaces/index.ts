import { WorkspaceDefinition } from '../types/workspace';
import { homeWorkspace } from './homeWorkspace';
import { bookmarkWorkspace } from './bookmarkWorkspace';
import { settingsWorkspace } from './settingsWorkspace';

export const workspaceRegistry: WorkspaceDefinition[] = [
  homeWorkspace,
  bookmarkWorkspace,
  settingsWorkspace,
];
