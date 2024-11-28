# Bird Monitoring System Backend

This project is the backend for the Bird Monitoring System, built with Node.js, Express, and Firebase Admin SDK.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```
   git clone https://github.com/your-username/bird-monitoring-system.git
   cd bird-monitoring-system/backend
```

2. Install the dependencies:

```
   npm install
```

3. Create a .env file in the root of the backend directory and add the following environment variables:

```
    # Firebase Service Account Configuration
    TYPE=service_account
    PROJECT_ID=your-project-id
    PRIVATE_KEY_ID=your-private-key-id
    PRIVATE_KEY="your-private-key"
    CLIENT_EMAIL=your-client-email
    CLIENT_ID=your-client-id
    AUTH_URI=https://accounts.google.com/o/oauth2/auth
    TOKEN_URI=https://oauth2.googleapis.com/token
    AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
    CLIENT_X509_CERT_URL=your-client-x509-cert-url
    UNIVERSE_DOMAIN=googleapis.com

    # Firebase Database Configuration
    DATABASE_URL=your-database-url

    # Server Configuration
    PORT=3001
```

Available Scripts
In the project directory, you can run:

```
node server.js
```

To start the backend server
The server will reload when you make changes.

Learn More
You can learn more about Express in the Express documentation.

To learn more about Firebase Admin SDK, check out the Firebase Admin SDK documentation.

Deployment
To deploy the backend, you can use any cloud service provider like Heroku, AWS, or Google Cloud. Make sure to set the environment variables in your deployment environment.

