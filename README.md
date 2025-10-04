# Opɛsu bere - Extreme Weather Companion

A modern, clean web application built with Next.js 14 that provides personalized extreme weather insights using NASA Earth observation data.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

### 📍 Landing/Input Section
- Interactive glassmorphism input form with smooth animations
- Location search with autocomplete support
- Purpose/Event selection with preset options
- Multi-select weather conditions (Very Hot, Very Cold, Very Windy, Very Wet, Very Uncomfortable)
- Date selector for planned activities

### 📊 Dashboard Features

#### 1. **Compound Extreme Analysis**
- Statistical probability analysis of extreme weather conditions
- Interactive probability distribution charts
- Color-coded severity indicators (Low, Moderate, High, Extreme)
- Real-time threshold visualization

#### 2. **Elder's Wisdom**
- AI-powered contextual weather advice using Gemini AI
- Typewriter animation effect
- Cultural and location-specific recommendations
- Animated avatar with personality

#### 3. **Geospatial Segmentation**
- Interactive dark-themed map (Leaflet)
- Color-coded risk zones around selected location
- Risk probability visualization for nearby areas
- Custom markers and overlays

#### 4. **Weather Charts**
- Multiple interactive time-series visualizations
- Temperature, Wind Speed, Rainfall, and Humidity tracking
- Responsive Recharts with custom tooltips
- 14-day historical and forecast data

#### 5. **Summary Section**
- Comprehensive weather outlook
- Statistical summaries (avg, min, max values)
- Planning recommendations
- Data export (CSV and JSON formats)

## 🎨 Design Features

- **Dark Modern Theme**: Black/dark grey base with violet/blue accents
- **Glassmorphism**: Reflection effects on cards and modals
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper labels and focus states

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **UI Components**: ShadCN/UI
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Charts**: Recharts
- **Maps**: Leaflet + React-Leaflet
- **AI**: Google Gemini AI
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd op3su-bere-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://ai.google.dev/

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
op3su-bere-frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css            # Global styles
│   ├── components/
│   │   ├── ui/                    # ShadCN UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── CompoundExtremeAnalysis.tsx
│   │   ├── ElderAdvice.tsx
│   │   ├── GeospatialSegmentation.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Map.tsx
│   │   ├── Navbar.tsx
│   │   ├── ServiceWorkerRegistration.tsx
│   │   ├── SummarySection.tsx
│   │   ├── WeatherCharts.tsx
│   │   └── WeatherInputForm.tsx
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── store/
│       ├── chat.ts                # Chat store (existing)
│       └── weather.ts             # Weather state management
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Usage

### 1. Enter Your Details
- Input your location (city name or coordinates)
- Select or enter your activity purpose
- Choose weather conditions you're concerned about
- Pick your planned date

### 2. View Dashboard
- Analyze extreme weather probabilities
- Read AI-generated advice
- Explore interactive maps
- Review detailed charts
- Download data for offline use

## 🔧 Configuration

### Customizing Colors
Edit `src/app/globals.css` to customize the color scheme:
```css
:root {
  --background: #0B0F19;
  --foreground: #ffffff;
}
```

### Adding More Weather Conditions
Edit `src/components/WeatherInputForm.tsx`:
```typescript
const weatherConditions: WeatherCondition[] = [
  'Very Hot',
  'Very Cold',
  // Add more conditions here
]
```

## 📱 Progressive Web App

This app includes PWA support with:
- Service Worker registration
- Offline capabilities
- App manifest
- Install prompt support

## 🌐 API Integration

To integrate with real NASA data:

1. Update `src/app/dashboard/page.tsx`
2. Replace mock data generation with API calls
3. Use NASA's POWER API or other Earth observation APIs

Example:
```typescript
// Replace the mock data section with:
const response = await fetch(`https://power.larc.nasa.gov/api/...`)
const data = await response.json()
```

## 🎨 Animations

Key animation features:
- Page transitions
- Card hover effects
- Loading skeletons
- Typewriter effects
- Micro-interactions
- Gradient animations

## 📊 Data Export

Users can download their weather data in:
- **CSV**: For spreadsheet analysis
- **JSON**: For programmatic use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NASA for Earth observation data
- Google for Gemini AI
- OpenStreetMap contributors
- ShadCN for UI components
- The open-source community

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using Next.js and NASA data
