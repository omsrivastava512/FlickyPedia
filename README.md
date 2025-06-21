# 🍿 FlickyPedia


> **A feature-rich movie discovery and tracking application showcasing advanced React development skills, including TypeScript integration, API handling, custom component development, and modern UI/UX patterns.**




[![FlickyPedia Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://flickypedia.netlify.app/) [![React](https://img.shields.io/badge/React-18-blue)]() [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)]() [![Vite](https://img.shields.io/badge/Vite-Latest-purple)]() [![X (Twitter)](https://img.shields.io/badge/X-000?logo=x&logoColor=white)](https://x.com/notomsrivastava/status/1932534174994538516)


## 🛠️ Technical Highlights
- **React Hooks**: useState, useEffect, useRef, useMemo, custom hooks
- **TypeScript**: Full type safety with custom interfaces
- **API Integration**: RESTful API calls with error handling
- **Performance**: Debounced search, memoization
- **UX**: Keyboard shortcuts, auto-focus, loading states

## ✨ Features

### 🚀 **Core Features Highlights**

| Feature | Technical Implementation | Business Value |
|---------|-------------------------|----------------|
| **Smart Search** | Debounced input, regex validation, dual search modes | Real-time user experience without performance loss |
| **Year Filtering** | Material-UI DatePicker integration with custom theming | Advanced filtering demonstrates complex component integration |
| **Watchlist Management** | LocalStorage API with CRUD operations | Data persistence shows full-stack thinking |
| **Rating System** | Custom StarRating component with event handling | Interactive UI components, highly customizable |


### ☁️**Production-Ready Architecture**
- **Full TypeScript Integration** with custom interfaces, type guards, and strict typing
- **Component Composition** following React best practices and separation of concerns
- **Error Boundary Implementation** with graceful fallbacks and user-friendly error states
- **Environment Variable Management** for secure API key handling across environments

### 🔍 **Smart Search**
- **Instant Search**: Real-time movie search with 700ms debounce
- **Auto-focus**: Start typing anywhere on the page to search
- **Dual Search Modes**: 
  - Partial match for broader results
  - Exact match for precise searches
- **Year Filtering**: Filter movies by release year (1900-current)
- **Input Validation**: Minimum 3 characters for partial search

### 🎬 **Movie Details**
- **Complete Information**: Plot, cast, director, runtime, ratings
- **IMDb Integration**: Real-time data from OMDB API
- **Expandable Text**: Click to read full movie plots
- **High-Quality Posters**: Crisp movie artwork display

### ⭐ **Personal Watchlist**
- **Custom Ratings**: Rate movies with interactive star component
- **Edit Ratings**: Double-click to modify your ratings
- **Smart Statistics**: Average ratings and runtime calculations
- **Persistent Storage**: Your data saves automatically
- **Quick Actions**: Double-click to reopen movie details

### 🎨 **User Experience**
- **Responsive Design**: Works perfectly on desktops and tabs
- **Dark Theme**: Easy on the eyes along with Material-UI theming
- **Keyboard Navigation**: Full keyboard support including Escape to close and hotkeys to switch result pages
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error messages and recovery
- **Tooltips**: Helpful hints throughout the interface


## 🎪 **Portfolio Impact**

**Demonstrates Ability To:**
- ✅ Build complex, interactive web applications from scratch
- ✅ Integrate third-party APIs and handle real-world data
- ✅ Implement modern React patterns and TypeScript best practices
- ✅ Create responsive, accessible user interfaces
- ✅ Deploy and maintain production applications
- ✅ Write clean, maintainable, and well-documented code

**Solves Real Development Challenges:**
- API rate limiting and request optimization
- Complex state management across components
- User experience design for data-heavy applications
- Cross-browser compatibility and responsive design
- Production deployment with environment security

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OMDB API key (free at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flickypedia.git
   cd flickypedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in project root
   echo "VITE_OMDB_API_KEY=your_api_key_here" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Environment Setup

Create a `.env` file in your project root:

```env
VITE_OMDB_API_KEY=your_omdb_api_key_here
```

> **Note**: Get your free API key from [OMDB API](http://www.omdbapi.com/apikey.aspx). The free tier includes 1,000 requests per day.

## 📱 Usage Guide

### Searching Movies
1. **Type anywhere** on the page to start searching
2. **Use the year picker** 📅 to filter by release year
3. **Toggle word match** 🔍 for exact vs. partial matching
4. **View results** instantly as you type

### Managing Your Watchlist
1. **Click any movie** to view detailed information
2. **Rate with stars** ⭐ to add to your watchlist
3. **Double-click watched movies** to edit ratings
4. **Delete movies** with the X button

### Keyboard Shortcuts
- **Type anywhere**: Focus search input
- **Escape**: Close movie details
- **Tab**: Navigate through interface
- **Shift + Arrow keys** to navigate through pages

## 🛠️ Built With

### Core Technologies
- **[React 18](https://reactjs.org/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server

### UI & Styling
- **[Material-UI](https://mui.com/)** - Component library
- **[Material-UI Date Pickers](https://mui.com/x/react-date-pickers/)** - Date selection
- **[Day.js](https://day.js.org/)** - Date manipulation
- **Custom CSS** - Responsive design and animations

### Data & APIs
- **[OMDB API](http://www.omdbapi.com/)** - Movie database
- **LocalStorage** - Persistent data storage

## 📁 Project Structure

```src/
├── App.tsx                # Main application component
├── index.css              # Global styles
├── main.tsx               # Application entry point
├── types.tsx              # TypeScript types and interfaces
├── vite-env.d.ts          # TypeScript environment types
├── assets/                # Static assets (icons, images)
│   ├── react.svg
│   ├── w2.png
│   └── w3.png
├── components/            # All UI components
│   ├── Box.tsx
│   ├── ErrorMessage.tsx
│   ├── index.tsx
│   ├── Loader.tsx
│   ├── Logo.tsx
│   ├── MovieDetails.tsx
│   ├── MovieList.tsx
│   ├── NavBar.tsx
│   ├── StarRating.tsx
│   ├── TextExpander.tsx
│   ├── WatchedMoviesList.tsx
│   ├── WatchedSummary.tsx
│   └── ... (other components)
├── hooks/                 # Custom React hooks
│   ├── useLocalStorage.tsx
│   └── ... (other hooks)

public/
├── logo.png               # Application logo
└── favicon files          # Browser icons (e.g., favicon.ico)
```

## 🔄 Component Architecture

```
App
├── NavBar
│   ├── Logo
│   ├── Search (with DatePicker)
│   └── NumResults
└── Main
    ├── Box (Movie List)
    │   ├── MovieList
    │       └── Movie Items
    └── Box (Watchlist/Details)
        ├── MovieDetails (when selected)
        │   └── StarRating
        └── WatchedMovies (default)
            ├── WatchedSummary
            └── WatchedMoviesList
                └── Movie Items
```

## 🌐 Deployment

### Netlify (Recommended)

1. **Connect to GitHub**: Link your repository in Netlify dashboard
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add `VITE_OMDB_API_KEY` in site settings
4. **Deploy**: Automatic deployment on every push

### Manual Deployment

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OMDB_API_KEY` | OMDB API key for movie data | Yes |

## 🐛 Troubleshooting

### Common Issues

**Movies not loading?**
- Check your OMDB API key in `.env`
- Verify internet connection
- Check browser console for errors

**Search not working?**
- Ensure minimum 3 characters for partial search
- Try exact match mode for specific titles
- Check year filter isn't too restrictive

**Build failing?**
- Run `npm install` to update dependencies
- Check TypeScript errors with `npm run type-check`
- Verify environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **[OMDB API](http://www.omdbapi.com/)** for providing movie data
- **[Jonas Schmedtmann ](https://jonas.io/)** for providing with most of the CSS and inspiring to build this app
- **[Material-UI](https://mui.com/)** for beautiful components
- **[React Community](https://reactjs.org/community/support.html)** for excellent documentation

## 📞 Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/yourusername/flickypedia/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/flickypedia/discussions)
- 📧 **Contact**: your.email@example.com

---

<p align="center">Made with ❤️ and lots of 🕚</p>

<p align="center">
  <a href="https://flickypedia.netlify.app">🚀 Live Demo</a> •
  <a href="#features">✨ Features</a> •
  <a href="#quick-start">🚀 Quick Start</a> •
  <a href="#contributing">🤝 Contributing</a>
</p>
