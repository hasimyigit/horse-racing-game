# Horse Racing Game

This repository contains a dynamic and interactive horse racing simulation game. Built with Vue 3 and Vite, it allows users to generate racing events, watch animated races in real-time, and track results across multiple rounds. The application leverages Vuex for robust state management and Tailwind CSS for a modern, responsive user interface.

## Key Features

-   **Dynamic Event Generation:** Automatically creates a full schedule of 6 racing rounds with varying distances and a unique roster of competitors.
-   **Competitor & Schedule Management:** View the full roster of horses and the complete event schedule, which updates live as races progress.
-   **Detailed Results:** After each round, view detailed standings, including finishing positions, completion times, and points awarded. A comprehensive results board tracks all completed races.
-   **Responsive Design:** The interface is built to be usable across various screen sizes, from mobile devices to desktops.
-   **Comprehensive Testing:** The project includes unit tests with Vitest and end-to-end tests with Playwright to ensure reliability.

## Tech Stack

-   **Framework:** Vue 3 (Composition API)
-   **State Management:** Vuex 4
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Language:** TypeScript
-   **Unit Testing:** Vitest
-   **End-to-End Testing:** Playwright

# Horse Racing Game

This repository contains a dynamic and interactive horse racing simulation game. Built with Vue 3 and Vite, it allows users to generate racing events, watch animated races in real-time, and track results across multiple rounds. The application leverages Vuex for robust state management and Tailwind CSS for a modern, responsive user interface.

## Key Features

-   **Dynamic Event Generation:** Automatically creates a full schedule of 6 racing rounds with varying distances and a unique roster of competitors.
-   **Competitor & Schedule Management:** View the full roster of horses and the complete event schedule, which updates live as races progress.
-   **Detailed Results:** After each round, view detailed standings, including finishing positions, completion times, and points awarded. A comprehensive results board tracks all completed races.
-   **Responsive Design:** The interface is built to be usable across various screen sizes, from mobile devices to desktops.
-   **Comprehensive Testing:** The project includes unit tests with Vitest and end-to-end tests with Playwright to ensure reliability.

## Tech Stack

-   **Framework:** Vue 3 (Composition API)
-   **State Management:** Vuex 4
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Language:** TypeScript
-   **Unit Testing:** Vitest
-   **End-to-End Testing:** Playwright

Directory structure:
└── src/
    ├── App.vue
    ├── components/
    │   ├── arena/
    │   │   └── ArenaHeader.vue
    │   ├── competitors/
    │   │   ├── CompetitorCard.vue
    │   │   └── CompetitorRoster.vue
    │   ├── results/
    │   │   ├── EventResults.vue
    │   │   ├── ResultsBoard.vue
    │   │   └── RoundResult.vue
    │   ├── schedule/
    │   │   └── EventSchedule.vue
    │   ├── track/
    │   │   ├── EventCard.vue
    │   │   ├── RaceArena.vue
    │   │   ├── RacerComponent.vue
    │   │   └── RacingLane.vue
    │   └── ui/
    │       ├── ActionButton.vue
    │       ├── ProgressTracker.vue
    │       └── WelcomeScreen.vue
    ├── composables/
    │   └── useRaceFlow.ts
    ├── constants/
    │   └── index.ts
    ├── main.ts
    ├── store/
    │   ├── horse/
    │   │   ├── composable/
    │   │   │   └── index.ts
    │   │   ├── module/
    │   │   │   └── index.ts
    │   │   └── __test__/
    │   │       └── index.test.ts
    │   ├── index.ts
    │   ├── race/
    │   │   ├── composable/
    │   │   │   └── index.ts
    │   │   ├── module/
    │   │   │   └── index.ts
    │   │   └── __test__/
    │   │       └── index.test.ts
    │   └── result/
    │       ├── composable/
    │       │   └── index.ts
    │       ├── module/
    │       │   └── index.ts
    │       └── __test__/
    │           └── index.test.ts
    ├── styles/
    │   └── main.css
    ├── types/
    │   └── index.ts
    ├── utils/
    │   ├── race-helper.ts
    │   └── random.ts
    ├── views/
    │   └── RacingArena.vue
    └── vite-env.d.ts

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/hasimyigit/horse-racing-game.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd horse-racing-game
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the development server with hot module replacement.
-   `npm run build`: Compiles the application for production.
-   `npm run preview`: Serves the production build locally to preview it.
-   `npm run test:unit`: Runs all unit tests using Vitest.
-   `npm run test:e2e`: Runs all end-to-end tests using Playwright.
-   `npm run lint`: Lints and automatically-fixes code style issues.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/hasimyigit/horse-racing-game.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd horse-racing-game
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the development server with hot module replacement.
-   `npm run build`: Compiles the application for production.
-   `npm run preview`: Serves the production build locally to preview it.
-   `npm run test:unit`: Runs all unit tests using Vitest.
-   `npm run test:e2e`: Runs all end-to-end tests using Playwright.
-   `npm run lint`: Lints and automatically-fixes code style issues.
