# Odyssey: Business Tourism Web App

<h3>Live Demo: <a href="https://gray-hill-0950dc200.6.azurestaticapps.net">Business Odyssey</a></h3> 

## Overview

Odyssey is a modern tourism web application designed as a college project to help users explore, plan, and navigate tourist destinations with real-time directions and a beautiful, responsive interface. Built with a robust tech stack and deployed on Azure, Odyssey delivers a seamless and interactive experience for travelers.

---

## Features

- **Real-Time Location Tracking:** Effortlessly navigate and get directions to your selected places.
- **Interactive Map:** Powered by Leaflet and OpenStreetMap for accurate, open-source mapping.
- **Itinerary Planning:** Add, view, and manage your travel plans.
- **Place Search & Details:** Search for destinations and view detailed information.
- **Responsive UI:** Mobile-friendly and desktop-optimized layouts.
- **Modern UI Components:** Consistent, accessible, and customizable interface using shadcn-ui and Tailwind CSS.
- **Persistent Storage:** Save your itinerary and preferences locally.
- **Fast Performance:** Instant feedback and smooth navigation with Vite and React.
- **CI/CD & Version Control:** Automated deployments and code management with GitHub Actions and Git.
- **Cloud Deployment:** Hosted on Azure Static Web Apps for global availability and scalability.

---

## Tech Stack

- **Frontend:**
  - [React](https://react.dev/) (with TypeScript)
  - [Vite](https://vitejs.dev/) (build tool)
  - [shadcn-ui](https://ui.shadcn.com/) (UI components)
  - [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS)
  - [Leaflet](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/) (maps & directions)
  - [React Router](https://reactrouter.com/) (routing)
  - [Zod](https://zod.dev/) (validation)
  - [React Hook Form](https://react-hook-form.com/) (forms)
  - [Recharts](https://recharts.org/) (charts)
- **State & Data:**
  - React Context API
  - Local Storage
- **DevOps & Deployment:**
  - [Git](https://git-scm.com/) & [GitHub](https://github.com/)
  - [GitHub Actions](https://github.com/features/actions) (CI/CD)
  - [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static/) (hosting)
- **Other Tools:**
  - [ESLint](https://eslint.org/) (linting)
  - [TypeScript](https://www.typescriptlang.org/) (type safety)
  - [PostCSS](https://postcss.org/)
  - [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)

---

## Project Structure

```
/ (root)
├── public/                # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Main app pages (Home, Explore, Itinerary, etc.)
│   ├── services/          # API and local storage logic
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── .github/workflows/     # CI/CD workflows
├── package.json           # Project metadata and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── ...                    # Other config and documentation files
```

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/MohitSutharOfficial/Odyssey-Tourism.git
cd Odyssey-Tourism
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Start the Development Server

```sh
npm run dev
```

### 4. Build for Production

```sh
npm run build
```

---

## Development Options

- **Local Development:** Use your favorite IDE with Node.js and npm.
- **GitHub:** Edit files directly in the GitHub web interface.
- **GitHub Codespaces:** Launch a cloud-based dev environment instantly.

---

## Deployment

- **CI/CD:** Automated with GitHub Actions.
- **Hosting:** Deployed to Azure Static Web Apps for fast, global delivery.
- **Custom Domain:** Not supported yet. For custom domains, consider Netlify or similar platforms.

---

## Credits

- **Maps:** [Leaflet](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/)
- **UI:** [shadcn-ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Cloud:** [Microsoft Azure](https://azure.microsoft.com/)

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or contributions, open an issue or pull request on [GitHub](https://github.com/MohitSutharOfficial/Odyssey-Tourism).
