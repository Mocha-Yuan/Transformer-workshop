import type { TransformerModule } from './transformerModule';

export type ModuleId = TransformerModule['id'];
export type GameMode = 'campaign' | 'practice';

export interface PracticeLevel {
  id: string;
  title: string;
  difficulty: string;
  goal: string;
  missionTitle: string;
  missionBrief: string;
  storyProblem: string;
  successFeedback: string;
  conceptTakeaway: string;
  missionAnalogy: string;
  todayLesson: string;
  explainToOthers: string;
  targetSequence: string[];
}

export interface GameLevel {
  id: string;
  order: number;
  title: string;
  description: string;
  storyIntro: string;
  botFeedback: string;
  missionTitle: string;
  missionBrief: string;
  storyProblem: string;
  successFeedback: string;
  conceptTakeaway: string;
  missionAnalogy: string;
  todayLesson: string;
  explainToOthers: string;
  targetModuleIds: ModuleId[];
}

export interface GameProgress {
  levelIndex: number;
  highestUnlockedLevelIndex?: number;
  placedModuleIds: ModuleId[];
}

export type CheckStatus = 'empty' | 'correct' | 'wrong' | 'complete';

export interface CheckResult {
  status: CheckStatus;
  message: string;
}

export interface LevelMission {
  missionTitle: string;
  missionBrief: string;
  storyProblem: string;
  successFeedback: string;
  conceptTakeaway: string;
  missionAnalogy: string;
  todayLesson: string;
  explainToOthers: string;
}
