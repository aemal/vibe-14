# Kanban Board

A modern, responsive Kanban board application built with Next.js 15, TypeScript, and Tailwind CSS. Features drag & drop functionality, animations, and full accessibility support.

## ✨ Features

- **Drag & Drop**: Seamlessly move cards between columns using @hello-pangea/dnd
- **Card Management**: Add, edit, and delete cards with a beautiful modal interface
- **Responsive Design**: Mobile-first design with touch-friendly interactions
- **Accessibility**: Full ARIA support, keyboard navigation, and screen reader compatibility
- **Smooth Animations**: Framer Motion powered animations and micro-interactions
- **Modern UI**: Clean, professional design with Tailwind CSS
- **TypeScript**: Fully typed for better development experience
- **State Management**: Centralized state management with React Context API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kanban-board
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

   > **Note**: Use `--legacy-peer-deps` with npm to resolve peer dependency conflicts with React 19.

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your Kanban board in action.

## 📱 Usage

### Adding Cards
- Click the "+" button in any column
- Fill out the card form with title and description
- Click "Add Card" to create the card

### Editing Cards
- Click the edit icon on any card
- Modify the title and description
- Click "Update Card" to save changes

### Moving Cards
- **Desktop**: Drag cards between columns using your mouse
- **Mobile**: Use touch gestures to drag cards, or swipe between columns

### Deleting Cards
- Click the delete icon on any card to remove it

### Mobile Navigation
- Swipe left/right to navigate between columns
- Use the dots at the bottom to jump to specific columns
- All touch targets are optimized for mobile (44x44px minimum)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind CSS
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx            # Main page component
├── components/
│   ├── kanban-board.tsx    # Main board component with DnD
│   ├── column.tsx          # Column component
│   ├── kanban-card.tsx     # Individual card component
│   └── card-modal.tsx      # Add/Edit card modal
├── contexts/
│   └── kanban-context.tsx  # Global state management
└── types/
    └── kanban.ts           # TypeScript type definitions
```

## 🎨 Design System

### Colors
- **Primary**: Blue tones for interactive elements
- **Success**: Green for positive actions
- **Danger**: Red for destructive actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Geist Sans (optimized for readability)
- **Scale**: Responsive typography using Tailwind CSS classes

### Spacing
- **Grid**: 8px base unit
- **Touch Targets**: Minimum 44x44px for accessibility
- **Mobile Breakpoints**: 640px, 768px, 1024px, 1280px

## 🔧 Technology Stack

- **Framework**: Next.js 15.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @hello-pangea/dnd
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Mobile**: React Swipeable
- **Accessibility**: React Focus Lock
- **Icons**: Heroicons

## ♿ Accessibility Features

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support for all features
- **Focus Management**: Proper focus trapping in modals
- **Screen Reader**: Comprehensive screen reader support
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects user's motion preferences

### Keyboard Shortcuts
- `Tab` / `Shift+Tab`: Navigate between elements
- `Enter` / `Space`: Activate buttons and controls
- `Escape`: Close modals and cancel actions
- `Arrow Keys`: Navigate within drag & drop operations

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Quality

The project uses:
- **ESLint**: Code linting and best practices
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (configured for consistent style)

### State Management

The application uses React Context API with useReducer for state management:

```typescript
// Access the Kanban context
const { state, addCard, editCard, moveCard, deleteCard } = useKanban();
```

### Adding New Features

1. **Define Types**: Add new types to `src/types/kanban.ts`
2. **Update Context**: Modify the context and reducer in `src/contexts/kanban-context.tsx`
3. **Create Components**: Add new components in `src/components/`
4. **Add Tests**: Write tests for new functionality (if testing is set up)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with default settings

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## 🐛 Known Issues

- Requires `--legacy-peer-deps` for npm installation due to React 19 compatibility
- Some animations may not work on older browsers without Framer Motion polyfills

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

---

Built with ❤️ using Next.js and TypeScript
