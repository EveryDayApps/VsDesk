import { WorkspaceDefinition } from '../types/workspace';
import { bookmarkWorkspace } from './bookmarkWorkspace';
import { homeWorkspace } from './homeWorkspace';
import { settingsWorkspace } from './settingsWorkspace';

export const workspaceRegistry: WorkspaceDefinition[] = [
  homeWorkspace,
  bookmarkWorkspace,
  settingsWorkspace,
];

