export type GamePhase = 'SETUP' | 'PASS_AND_VIEW' | 'NIGHT' | 'DAY' | 'VOTING' | 'GAMEOVER';

export type RoleName = 
  | 'Werewolf' 
  | 'Seer' 
  | 'Robber' 
  | 'Troublemaker' 
  | 'Villager'
  | 'Insomniac';

export type Role = {
  id: string;
  name: RoleName;
  team: 'Village' | 'Werewolf';
};

export type Player = {
  id: string;
  name: string;
  originalRole: Role | null;
  currentRole: Role | null;
};

export type GameState = {
  phase: GamePhase;
  players: Player[];
  centerCards: Role[];
  availableRoles: Role[];
};
