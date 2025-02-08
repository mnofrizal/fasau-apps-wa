# FASAU WhatsApp Bot

## Project Overview

A WhatsApp bot application with dual functionality:

1. Monitors messages with specific prefixes, processes them, and forwards structured data to a configured webhook endpoint
2. Provides a REST API for sending WhatsApp messages programmatically through HTTP POST requests

## Tech Stack & Dependencies

- **Runtime:** Node.js
- **Core Dependencies:**
  - `whatsapp-web.js` (v1.23.0) - WhatsApp Web API client
  - `express` - Web framework for REST API
  - `cloudinary` (v2.5.1) - Cloud media storage
  - `axios` (v1.6.7) - HTTP client for webhook communication
  - `qrcode-terminal` (v0.12.0) - QR code generation for authentication
  - `dotenv` (v16.4.7) - Environment variables management
- **Development Dependencies:**
  - `nodemon` (v3.0.3) - Development server with hot reload

## Core Features

### WhatsApp Bot Features

1. **WhatsApp Integration**

   - Local authentication strategy
   - QR code-based initial setup
   - Real-time message monitoring
   - Automatic session management

2. **Message Processing**

   - Prefix-based message filtering (.l1 -> CM, .l3 -> PM)
   - Group and direct message support
   - Media handling (image processing)
   - Message age validation (< 60 seconds)

3. **Media Management**

   - Automatic image upload to Cloudinary
   - Secure URL generation for uploaded media
   - Support for various image formats

4. **Data Forwarding**
   - Structured message formatting
   - Webhook integration
   - Error handling and logging
   - Automatic response generation

### REST API Features

1. **Message Sending**

   - Send WhatsApp messages via HTTP POST requests
   - Phone number validation and formatting
   - Error handling and status codes
   - Success/failure response formatting

2. **Status Monitoring**
   - Health check endpoint
   - WhatsApp client status verification
   - Connection state monitoring

## Architecture & Components

### 1. Main Application (index.js)

- Express server initialization
- WhatsApp client setup and event handling
- Message processing pipeline
- Media upload management
- Global error handling
- API routes integration

### 2. API Components

- **Routes** (src/routes)
  - Message routing
  - Status endpoint routing
  - Express router configuration
- **Controllers** (src/controllers)
  - Message sending logic
  - Request validation
  - Response formatting
  - Error handling
- **Services** (src/services)
  - WhatsApp client management
  - Message sending implementation
  - Client status monitoring

### 3. Configuration (config.js)

- Environment-based configuration
- Webhook URL settings
- Cloudinary credentials
- Message type mappings
- Client options
- Response message templates

## Configuration

The application uses the following configuration points:

- `WEBHOOK_URL`: Endpoint for forwarding processed messages
- `CLOUDINARY`: Cloud storage configuration
  - `cloud_name`
  - `api_key`
  - `api_secret`
- `MESSAGE_TYPES`: Prefix mappings for message categorization
- `CLIENT_OPTIONS`: WhatsApp client configuration
- `RESPONSE_MESSAGES`: Array of customizable response templates
- `PORT`: Express server port (default: 3000)

## Setup & Usage

### Prerequisites

- Node.js installed
- WhatsApp account for bot
- Cloudinary account
- Webhook endpoint ready

### Environment Variables Required

```env
PORT=3000
WEBHOOK_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Development mode:

   ```bash
   npm run dev
   ```

3. Production mode:
   ```bash
   npm start
   ```

### First-time Setup

1. Run the application
2. Scan the QR code with WhatsApp
3. Wait for "WhatsApp client is ready!" message

### Using the REST API

#### Send a Message

```http
POST /api/messages
Content-Type: application/json

{
  "phoneNumber": "1234567890",
  "message": "Hello from API!"
}
```

#### Check Status

```http
GET /api/status
```

### WhatsApp Message Format

Messages should follow the format:

```
[prefix] [description]
```

Example:

```
.l1 Customer complaint about service
.l3 Product maintenance report
```
