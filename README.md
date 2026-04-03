# Finance Data Processing and Access Control Backend

## Overview
This backend application handles secure data processing and access control for financial data. It provides APIs for data ingestion, processing, and controlled access, ensuring compliance with financial regulations.

## Features
- Secure data ingestion and validation
- Role-based access control (RBAC)
- Data encryption and audit logging
- RESTful API endpoints
- Integration with financial databases

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

## Role Permissions
#### Viewer
- View dashboard summary only
#### Analyst
- View financial records
- Access dashboard insights
#### Admin
- Full access (users + records management)

## Installation
1. Clone the repository:
    ```
    git clone https://github.com/yourusername/Finance_Data_Processing_and_Access_Control_Backend.git
2. Install dependencies:
    ```
    npm install
    ```
4. Set up environment variables (see `.env.example`).

## Usage
1. Start the server:
    ```
    npm start
    ```
2. Access the API at `http://localhost:PORT`.

3. Make a admin:
    ```
    node seedAdmin.js
    ```
    This makes an admin user so that you can assign roles to other users
