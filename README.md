# Monster Memory Tracker (MMT)

A web application helping Yu-Gi-Oh! players track monster effect memory states for temporary banishment and face-down scenarios.
The information are generated from the memory case files in [`monster-memory-cases`](https://github.com/satellaa/monster-memory-cases).

## Local Development

### Prerequisites
First, clone these two repositories:
```bash
git clone https://github.com/Satellaa/monster-memory-cases.git
git clone https://github.com/Satellaa/monster-memory-tracker.git
```

### Installation & Configuration
1. Navigate to the `monster-memory-tracker directory`:
```bash
cd monster-memory-tracker
```

2. Install dependencies and generate memory cases:
```bash
npm install
npx bitron --input-dir path/to/monster-memory-cases/cases
```

### Development
- Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production
- Build the project:
```bash
npm run build
```
This will generate production-ready files for deployment.