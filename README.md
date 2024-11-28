# Bird Monitoring System

This project is a Bird Monitoring System, consisting of a frontend built with React and Firebase, and a backend built with Node.js, Express, and Firebase Admin SDK.

## Project Structure

- `frontend/`: Contains the frontend code.
- `backend/`: Contains the backend code.

## Getting Started

To get started with this project, please refer to the `README.md` files in the respective directories:

### Frontend

The frontend is located in the `frontend` directory. For setup and installation instructions, please refer to the [frontend README](./frontend/README.md).

### Backend

The backend is located in the `backend` directory. For setup and installation instructions, please refer to the [backend README](./backend/README.md).

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/bird-monitoring-system.git
   cd bird-monitoring-system
   ```

2. Install the dependencies for both the frontend and backend:

   ```sh
   cd frontend
   npm install
   cd ../backend
   npm install
   cd ..
   ```

3. Create a `.env` file in both the `frontend` and `backend` directories and add the necessary environment variables as specified in their respective `README.md` files.

## Running the Application

1. To start both the frontend and backend servers concurrently, run the following command in the root directory:

    ```
    npm start
    ```

    This will start the backend server on `http://localhost:3001` and the frontend server on `http://localhost:3000`.

2. Alternatively, you can start both backend and frontend seperately by running the following command in 

    Backend 

    ```sh
    node server.js
    ```

    This will start the backend server on `http://localhost:3001`

    Frontend

    ```sh
    npm start
    ```

    This will start the frontend server on `http://localhost:3000`.

## License

This project is licensed under the MIT License.