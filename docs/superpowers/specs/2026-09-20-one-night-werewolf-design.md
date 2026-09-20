# One Night Ultimate Werewolf - Web App Design Spec

## 1. Overview
A mobile-first, browser-based implementation of the "One Night Ultimate Werewolf" board game. The app entirely replaces physical cards, acting as both the deck and the game master. Players use a single shared device ("pass-and-play" style) to view their roles, take night actions, and time their day phase.

## 2. Tech Stack
- **Framework:** Next.js (React)
- **Deployment:** Vercel
- **Styling:** Vanilla CSS (CSS Modules)
- **State Management:** React Context API
- **Audio:** `window.speechSynthesis` API for text-to-speech narrator, HTML5 Audio for ambient sounds.

## 3. Architecture & Data Flow
The core of the application is a central `GameEngine` powered by React Context.

### State Model
```typescript
type GamePhase = 'SETUP' | 'PASS_AND_VIEW' | 'NIGHT' | 'DAY' | 'VOTING' | 'GAMEOVER';

type Player = {
  id: string;
  name: string;
  originalRole: Role | null;
  currentRole: Role | null;
};

type GameState = {
  phase: GamePhase;
  players: Player[];
  centerCards: Role[];
  availableRoles: Role[];
  actionLog: ActionEvent[]; // Tracks what happened during the night for end-game resolution
};
```

### Game Phases
1. **Setup:**
   - Input player names.
   - Select active roles from a predefined list (e.g., 2 Werewolves, 1 Seer, 1 Robber, 1 Troublemaker, 1 Villager).
   - The app verifies that exactly `Players + 3` roles are selected.
   - Cards are virtually shuffled and dealt.
2. **Pass & View:**
   - A screen displays: "Pass phone to [Player Name]".
   - Player taps to reveal their card.
   - Player taps to hide their card.
   - Repeat until all players have viewed their starting roles.
3. **Night Phase:**
   - The screen goes dark.
   - Text-to-speech narrator calls out roles in order.
   - If the called role is in the game, the narrator instructs them to wake up and take their action.
   - The player assigned that role picks up the phone, performs their action via UI (e.g., Seer taps a player's card to view it), and taps "Done".
   - The narrator tells the role to go back to sleep.
4. **Day Phase:**
   - Narrator tells everyone to wake up.
   - A countdown timer (e.g., 5 minutes) starts on the screen.
5. **Voting & Resolution:**
   - After discussion, players point at their targets in real life.
   - The app asks who received the most votes (or who died).
   - The app reveals all final cards and the action log, declaring which team won.

## 4. Components
- **AudioController:** A singleton or context provider that manages queuing and playing `SpeechSynthesisUtterance` commands and ambient mp3s.
- **Card:** A reusable UI component with a flip animation (CSS transforms).
- **Phase Views:** `SetupView`, `PassView`, `NightActionView`, `DayTimerView`, `GameOverView`.

## 5. UI & Aesthetics
- **Theme:** Dark mode, mysterious, premium.
- **Effects:** Glassmorphism (translucent backgrounds with blur), glowing borders for active cards, and smooth CSS transitions for phase changes and card flips.
- **Layout:** Optimized exclusively for mobile portrait view since it's a pass-and-play game.

## 6. Scope & V1 Requirements
For the initial version, we will implement the following core roles:
- Werewolf (x2)
- Seer (x1)
- Robber (x1)
- Troublemaker (x1)
- Villager (x1+)

*Note: Additional complex roles (Doppelganger, Drunk) can be added in later iterations once the core engine is proven.*
