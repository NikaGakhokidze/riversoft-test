# Live Odds Board Web Application

This React TypeScript application displays a real-time, virtualized list of over 10,000 live sports matches with dynamic odds updates. Built with Vite for optimal performance, the app showcases modern web development best practices including real-time data simulation, efficient virtualization. The application features interactive betting odds, sport-based filtering, and persistent user selections.



## Key Features

- **Real-Time Data Simulation:** Displays 10,000+ live matches with odds that update in real-time via mock WebSocket connections.
- **High-Performance Virtualization:** Uses `react-window` for efficient rendering of large lists, ensuring smooth scrolling and minimal memory usage.
- **Interactive Betting Odds:** Users can select multiple odds with visual feedback, selections are highlighted and persisted in local state.
- **Dynamic Visual Feedback:** Odds changes are animated with color transitions (green for increase, red for decrease) to provide clear visual feedback.
- **Persistent State Management:** User's odds selections are maintained using Zustand store with localStorage persistence.
- **Advanced Filtering:** Matches can be filtered by sport type with real-time search and category selection.
- **Responsive Design:** Modern, mobile-first design using Tailwind CSS with dark theme support.
- **Component Architecture:** Built with reusable shadcn/ui components following atomic design principles.

## Architecture

The application follows a clean, scalable architecture with TypeScript throughout, emphasizing separation of concerns and maintainability. I used custom hooks to encapsulate complex logic and side effects, while composition patterns promote code reusability and maintainability across components.

```
riversoft-odds/
├── src/
│   ├── components/
│   │   ├── OddsBoard.tsx                # Main virtualized odds display
│   │   ├── ui/                          # Reusable UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── button-variants.ts       # Separated for Fast Refresh
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   └── icons/                       # Sport-specific icons
│   │       ├── BasketballIcon.tsx
│   │       ├── FootballIcon.tsx
│   │       └── TennisIcon.tsx
│   ├── features/
│   │   └── odds/
│   │       ├── store/
│   │       │   └── use-odds-store.ts    # Zustand state management
│   │       └── types/
│   │           └── index.ts             # TypeScript definitions
│   ├── hooks/                           # Shared React hooks
│   │   ├── use-mock-web-socket.ts       # Real-time data simulation
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── mock-data.ts                 # Data generation utilities
│   │   ├── mock-matches.json            # Base match data (10k+ entries)
│   │   └── utils.ts                     # Utility functions
│   ├── App.tsx                          # Main application component
│   ├── main.tsx                         # Vite entry point
│   └── globals.css                      # Global styles & CSS variables
├── public/
│   └── vite.svg
├── dist/                                # Production build output
├── package.json
├── vite.config.ts                       # Vite configuration
├── tailwind.config.ts                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration
└── eslint.config.js                     # ESLint configuration
```

### Key Architectural Decisions

- **`src/features/`**: Feature-based organization following domain-driven design principles
- **`components/ui/`**: Reusable, accessible UI components based on shadcn/ui library
- **`hooks/`**: Custom React hooks for shared logic and state management
- **`store/`**: Zustand stores for client-side state management with persistence
- **`lib/`**: Pure utility functions and data processing logic
- **`types/`**: Centralized TypeScript type definitions for type safety


### State Management: Zustand

I selected Zustand over Redux or Context API for its simplicity and readability:

1. **Minimal Boilerplate:** Simple, intuitive API without reducers or actions
2. **TypeScript Native:** Excellent TypeScript support with full type inference
3. **Persistence:** Built-in middleware for localStorage persistence
4. **Performance:** Selective subscriptions prevent unnecessary re-renders
5. **Bundle Size:** Lightweight (~2KB) compared to Redux ecosystem

### Performance Optimization: React Window

For rendering 10,000+ list items efficiently:

1. **Virtualization:** Only renders visible items plus a small buffer zone
2. **Memory Efficiency:** Constant memory usage regardless of list size
3. **Smooth Scrolling:** Maintains 60fps scrolling performance
4. **Dynamic Heights:** Handles variable item sizes gracefully

### Real-Time Updates: Mock WebSocket

Simulated real-time data updates using:

1. **Realistic Data Patterns:** Mimics actual sports betting data streams
2. **Controlled Update Rates:** Configurable update frequency for testing
3. **Memory Efficient:** Batch updates and selective re-rendering
4. **Realistic Odds Fluctuation:** Statistical models for believable odds changes

### Styling: Tailwind CSS + shadcn/ui

Modern styling approach with utility-first CSS:

1. **Utility-First:** Rapid development with composable utility classes
2. **Design System:** Consistent spacing, colors, and typography
3. **Dark Mode:** Built-in dark theme support with CSS variables
4. **Component Library:** shadcn/ui for accessible, unstyled components
5. **Performance:** Purged CSS for minimal production bundle size

### Type Safety: TypeScript

Comprehensive TypeScript implementation:

1. **Strict Mode:** Maximum type safety with strict compiler options
2. **Interface Definitions:** Strong typing for all data structures
3. **Component Props:** Fully typed React component interfaces
4. **API Responses:** Type-safe data fetching and processing

## Performance Features

### List Virtualization
- **react-window** implementation for handling 10,000+ items
- Variable item heights with automatic sizing
- Smooth scrolling with consistent 60fps performance
- Memory usage remains constant regardless of list size

### State Optimization
- **Selective re-rendering** using Zustand's selector pattern
- **Memoized components** with React.memo for expensive renders
- **Debounced search** to prevent excessive filtering operations
- **Lazy loading** of non-critical components

### Bundle Optimization
- **Tree shaking** eliminates unused code
- **Code splitting** for faster initial page loads
- **Asset optimization** with Vite's built-in optimizations
- **CSS purging** removes unused Tailwind classes

## How to Run the Application

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd riversoft-odds
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

6. **Run Linting**
   ```bash
   npm run lint
   ```


---

