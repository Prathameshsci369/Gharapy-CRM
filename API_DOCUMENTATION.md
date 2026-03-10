# API Documentation

Complete API reference for Gharpayy CRM endpoints.

**Base URL**: `http://localhost:3200` (local) or `https://your-domain.com` (production)

**Authentication**: Currently uses Firebase Auth (add custom auth as needed)

---

## Table of Contents
- [Leads API](#leads-api)
- [Agents API](#agents-api)
- [Events API](#events-api)
- [Reminders API](#reminders-api)
- [Webhook API](#webhook-api)
- [Webhook Logs API](#webhook-logs-api)
- [Error Handling](#error-handling)

---

## Leads API

### GET /api/leads
Get all leads in the system.

**Query Parameters**:
- `stage` (optional): Filter by pipeline stage
- `agentId` (optional): Filter by assigned agent
- `source` (optional): Filter by lead source

**Example**:
```bash
GET /api/leads?stage=New%20Lead&agentId=agent-001
```

**Response** (200 OK):
```json
[
  {
    "id": "lead-001",
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "stage": "New Lead",
    "assignedAgentId": "agent-001",
    "assignedAgentName": "Neha Gupta",
    "source": "Website Form",
    "budget": 5000000,
    "preferredLocation": "Mumbai",
    "notes": "Interested in 3BHK apartments",
    "createdAt": "2026-03-10T10:00:00Z",
    "updatedAt": "2026-03-10T10:00:00Z"
  }
]
```

**Error Response** (500):
```json
{
  "error": "Failed to fetch leads"
}
```

---

### POST /api/leads
Create a new lead.

**Request Body**:
```json
{
  "name": "Jane Smith",
  "phone": "+919876543210",
  "email": "jane@example.com",
  "source": "Website Form",
  "budget": 5000000,
  "preferredLocation": "Mumbai",
  "notes": "Looking for 2BHK"
}
```

**Required Fields**:
- `name` (string, max 100 chars)
- `phone` (string, valid format)

**Optional Fields**:
- `email` (string, valid email)
- `source` (string): "Website Form", "WhatsApp", "Phone Call", "Social Media", "Tally Form"
- `budget` (number): in rupees
- `preferredLocation` (string)
- `notes` (string)

**Response** (201 Created):
```json
{
  "id": "lead-002"
}
```

**Error Response** (400):
```json
{
  "error": "name and phone are required"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3200/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phone": "+919876543210",
    "email": "jane@example.com",
    "source": "Website Form",
    "budget": 5000000,
    "preferredLocation": "Mumbai"
  }'
```

**JavaScript Example**:
```javascript
const newLead = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    phone: '+919876543210',
    email: 'jane@example.com',
    source: 'Website Form',
    budget: 5000000
  })
}).then(r => r.json());

console.log('Lead created:', newLead);
```

---

### PATCH /api/leads/[id]
Update an existing lead.

**Path Parameters**:
- `id` (string): Lead ID

**Request Body** (any field to update):
```json
{
  "stage": "Property Suggested",
  "budget": 5500000,
  "assignedAgentId": "agent-002",
  "notes": "Updated notes"
}
```

**Updatable Fields**:
- `name`
- `phone`
- `email`
- `stage`
- `assignedAgentId`
- `assignedAgentName`
- `budget`
- `preferredLocation`
- `notes`
- `propertyId`

**Response** (200 OK):
```json
{
  "success": true
}
```

**Example**:
```bash
curl -X PATCH http://localhost:3200/api/leads/lead-001 \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "Contacted",
    "notes": "Called at 2pm"
  }'
```

---

### DELETE /api/leads/[id]
Delete a lead.

**Path Parameters**:
- `id` (string): Lead ID

**Response** (200 OK):
```json
{
  "success": true
}
```

**Example**:
```bash
curl -X DELETE http://localhost:3200/api/leads/lead-001
```

---

## Agents API

### GET /api/agents
Get all agents.

**Response** (200 OK):
```json
[
  {
    "id": "agent-001",
    "name": "Neha Gupta",
    "email": "neha@gharpy.com",
    "phone": "+919876543210",
    "isActive": true,
    "createdAt": "2026-03-01T10:00:00Z"
  }
]
```

---

### POST /api/agents
Create a new agent.

**Request Body**:
```json
{
  "name": "Raj Patel",
  "email": "raj@gharpy.com",
  "phone": "+919876543210",
  "isActive": true
}
```

**Response** (201 Created):
```json
{
  "id": "agent-002"
}
```

---

## Events API

### GET /api/events
Get all events (lead interactions).

**Query Parameters**:
- `leadId` (optional): Filter by lead
- `type` (optional): Filter by event type

**Event Types**:
- `created`: Lead created
- `contacted`: Lead contacted
- `stage_changed`: Pipeline stage changed
- `note_added`: Note added
- `visit_scheduled`: Visit scheduled
- `reminder_set`: Reminder created

**Example**:
```bash
GET /api/events?leadId=lead-001&type=contacted
```

**Response** (200 OK):
```json
[
  {
    "id": "event-001",
    "leadId": "lead-001",
    "type": "contacted",
    "description": "Called the lead",
    "createdBy": "agent-001",
    "createdByName": "Neha Gupta",
    "createdAt": "2026-03-10T14:30:00Z"
  }
]
```

---

### POST /api/events
Create a new event.

**Request Body**:
```json
{
  "leadId": "lead-001",
  "type": "contacted",
  "description": "Called at 2pm",
  "createdBy": "agent-001",
  "createdByName": "Neha Gupta"
}
```

**Response** (201 Created):
```json
{
  "id": "event-002"
}
```

---

### DELETE /api/events/[id]
Delete an event.

**Response** (200 OK):
```json
{
  "success": true
}
```

---

## Reminders API

### GET /api/reminders
Get all reminders.

**Query Parameters**:
- `agentId` (optional): Filter by agent
- `status` (optional): "pending" or "completed"

**Response** (200 OK):
```json
[
  {
    "id": "reminder-001",
    "leadId": "lead-001",
    "agentId": "agent-001",
    "dueDate": "2026-03-15T10:00:00Z",
    "description": "Follow up with John Doe",
    "status": "pending",
    "createdAt": "2026-03-10T10:00:00Z"
  }
]
```

---

### POST /api/reminders
Create a new reminder.

**Request Body**:
```json
{
  "leadId": "lead-001",
  "agentId": "agent-001",
  "dueDate": "2026-03-15T10:00:00Z",
  "description": "Follow up with lead",
  "status": "pending"
}
```

**Response** (201 Created):
```json
{
  "id": "reminder-001"
}
```

---

### PATCH /api/reminders/[id]
Update a reminder.

**Request Body**:
```json
{
  "status": "completed",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "success": true
}
```

---

### DELETE /api/reminders/[id]
Delete a reminder.

**Response** (200 OK):
```json
{
  "success": true
}
```

---

## Webhook API

### POST /api/webhook
Receive webhook data from external sources.

**Headers**:
```
Content-Type: application/json
X-Webhook-Secret: your-webhook-secret
```

**Request Body**:
```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "source": "Tally Form",
  "notes": "Interested in properties"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "leadId": "lead-123",
  "assignedAgent": "Neha Gupta"
}
```

**Error Response** (400):
```json
{
  "error": "name and phone are required"
}
```

**Error Response** (401):
```json
{
  "error": "Unauthorized"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:3200/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "source": "Tally Form",
    "notes": "Interested in 2BHK"
  }'
```

### GET /api/webhook
Get webhook endpoint information.

**Response** (200 OK):
```json
{
  "status": "ok",
  "endpoint": "Gharpayy CRM Webhook Handler",
  "usage": "POST /api/webhook with x-webhook-secret header",
  "payload": {
    "name": "string (required)",
    "phone": "string (required)",
    "email": "string",
    "source": "string",
    "notes": "string"
  }
}
```

---

## Webhook Logs API

### GET /api/webhook-logs
Get all webhook logs (audit trail).

**Query Parameters**:
- `source` (optional): Filter by source (e.g., "Tally Form", "WhatsApp")
- `status` (optional): "success" or "failed"

**Example**:
```bash
GET /api/webhook-logs?source=Tally%20Form&status=success
```

**Response** (200 OK):
```json
[
  {
    "id": "log-001",
    "source": "Tally Form",
    "payload": {
      "name": "John Doe",
      "phone": "+919876543210",
      "email": "john@example.com"
    },
    "status": "success",
    "createdAt": "2026-03-10T10:00:00Z"
  },
  {
    "id": "log-002",
    "source": "WhatsApp",
    "payload": {},
    "status": "failed",
    "error": "Invalid phone number",
    "createdAt": "2026-03-10T10:05:00Z"
  }
]
```

---

### DELETE /api/webhook-logs/[id]
Delete a webhook log.

**Response** (200 OK):
```json
{
  "success": true
}
```

---

## Error Handling

### Error Response Format
All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (auth error) |
| 500 | Server Error |
| 503 | Service Unavailable (Firebase not initialized) |

### Common Errors

**Firebase Not Initialized** (503):
```json
{
  "error": "Firebase not initialized"
}
```
**Solution**: Ensure `service-account.json` is in project root

**Missing Required Fields** (400):
```json
{
  "error": "name and phone are required"
}
```
**Solution**: Check request body includes all required fields

**Unauthorized** (401):
```json
{
  "error": "Unauthorized"
}
```
**Solution**: Verify webhook secret header matches `WEBHOOK_SECRET` env var

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:

1. Implement API rate limiting (100 req/min per IP)
2. Use Redis for rate limit tracking
3. Return 429 Too Many Requests when limit exceeded

Example:
```json
{
  "error": "Rate limit exceeded. Try again in 60 seconds"
}
```

---

## Authentication (Future)

Add JWT or API key authentication for production:

```bash
curl -X GET http://localhost:3200/api/leads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing APIs

### Using Postman
1. Import collection
2. Set base URL
3. Add headers:
   - `Content-Type: application/json`
   - `X-Webhook-Secret: your-secret` (for webhook)
4. Test endpoints

### Using Thunder Client (VS Code Extension)
1. Install Thunder Client
2. Create new request
3. Add URL and headers
4. Send request

### Using REST Client (VS Code Extension)

Create `api-test.http`:
```http
### Get all leads
GET http://localhost:3200/api/leads

### Create lead
POST http://localhost:3200/api/leads
Content-Type: application/json

{
  "name": "Test Lead",
  "phone": "+919876543210",
  "email": "test@example.com",
  "source": "Website Form"
}

### Update lead
PATCH http://localhost:3200/api/leads/lead-001
Content-Type: application/json

{
  "stage": "Contacted"
}
```

---

## Version

**API Version**: 1.0.0
**Last Updated**: March 10, 2026

For support or questions, check the main [README.md](./README.md)
