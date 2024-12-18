# Bird Monitoring System Frontend

This project is the frontend for the Bird Monitoring System, built with React and Firebase.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```
   git clone https://github.com/your-username/bird-monitoring-system.git
   cd bird-monitoring-system/frontend
```

2. Install the dependencies:

```
   npm install
```

3. Create a .env file in the root of the frontend directory and add the following environment variables:

```
    # Backend Configuration
    REACT_APP_BACKEND_URL=http://localhost:3001

    #Camera Stream
    REACT_APP_CAMERA_STREAM_URL="url to livestream"   
   ```

Available Scripts
In the project directory, you can run:

```
npm start
```

Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

```
npm test
```

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

```
npm run build
```

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!