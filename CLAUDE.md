# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is sota411's personal portfolio website (sota411.github.io) featuring an AI-powered activity analysis system. The site displays personal information, skills, certifications, projects, and dynamically updated social media activity analysis using Twitter API and Google's Gemini AI.

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Update activity data manually
npm run update-activity
```

### Activity System
The portfolio includes an automated system that fetches Twitter data and generates AI-powered activity summaries:

- **Automatic Updates**: Runs every 15 days via cron job at 8:00 AM JST
- **Manual Updates**: Available via API endpoint `/api/update-activity` (POST)
- **Data Storage**: Activity data stored in `data/activity.json`

## Architecture Overview

### Core Components

**Frontend (Static Website)**
- `index.html`: Main portfolio page with modern responsive design
- `css/style.css`: Comprehensive styling with CSS variables, glassmorphism effects, and responsive breakpoints
- `js/script.js`: Client-side interactions, animations, and API integration

**Backend (Node.js Server)**
- `server.js`: Express server serving static files and activity API endpoints
- Automated cron scheduling for periodic updates
- CORS-enabled API for activity data consumption

**Activity Analysis System**
- `scripts/updateActivity.js`: Main orchestrator with dual environment support (local/GitHub Actions)
- `scripts/twitterService.js`: Twitter API v2 integration for tweet fetching
- `scripts/geminiService.js`: Google Gemini AI service for content analysis
- Configuration supports both environment variables and local settings file

### Data Flow
1. **Twitter API** fetches recent tweets (15-day window)
2. **Gemini AI** analyzes content for summary, topics, mood, technologies
3. **Statistics calculation** processes engagement metrics
4. **JSON storage** in `data/activity.json` for frontend consumption
5. **Live updates** displayed in Activities section of portfolio

### Environment Configuration
- **Local Development**: Uses `settings.json` (not tracked in git)
- **Production/GitHub Actions**: Uses environment variables
  - `X_API_BEARER_TOKEN`: Twitter API access
  - `GEMINI_API_KEY`: Google Gemini AI access

## Key Design Patterns

**Responsive Design System**
- CSS custom properties for theming
- Mobile-first approach with breakpoints at 480px, 768px, 1024px
- Glassmorphism effects with backdrop filters

**Error Handling Strategy**
- Graceful fallbacks for API failures
- Different behavior for local vs production environments
- Comprehensive logging throughout the system

**Modern UI Components**
- Activities section features live analytics dashboard
- GitHub repository showcase with hover animations
- Particle.js background effects
- AOS (Animate On Scroll) library integration

## File Structure Notes

- **Static Assets**: `img/` contains profile pictures and project screenshots
- **Configuration**: `package.json` defines scripts, `settings.json` for local API keys
- **Data**: `data/activity.json` is generated/updated by the activity system
- **Deployment**: Configured for GitHub Pages with `CNAME` file

## API Integration Details

The portfolio integrates with external services:
- **Twitter API v2**: Retrieves tweet data using bearer token authentication
- **Google Gemini AI**: Processes natural language analysis of social media content
- **Express Server**: Provides local development environment and API endpoints

This architecture enables the portfolio to automatically reflect the owner's recent activities and technical interests through AI-powered content analysis.

## Implementation Guidelines

### Code Changes and Backup Protocol

**IMPORTANT**: When implementing new features or making significant changes, always follow this backup protocol:

1. **Before Implementation**:
   ```bash
   # Check current status
   git status
   
   # Create a backup commit with current state
   git add -A
   git commit -m "backup: Save current state before [feature name] implementation"
   ```

2. **After Implementation**:
   ```bash
   # Commit the changes with descriptive message
   git add [modified files]
   git commit -m "[type]: [description]
   
   🤖 Generated with [Claude Code](https://claude.ai/code)
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

3. **Rollback if Needed**:
   ```bash
   # To revert to previous commit
   git reset --hard HEAD~1
   
   # To revert to specific commit
   git reset --hard [commit-hash]
   ```

**Commit Types**: Use `feat:`, `fix:`, `update:`, `cleanup:`, `backup:` prefixes for clarity.

**Recovery Commands**: Always note the commit hash after successful implementations so user can easily return to any state.