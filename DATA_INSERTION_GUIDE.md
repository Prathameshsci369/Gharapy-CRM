# Data Insertion Guide

Complete guide on how to insert leads into Gharpayy CRM from different sources.

---

## Table of Contents
- [Overview](#overview)
- [Website Form (Tally)](#website-form-tally)
- [WhatsApp Integration](#whatsapp-integration)
- [Direct API Integration](#direct-api-integration)
- [Phone Call Logs](#phone-call-logs)
- [Social Media Messages](#social-media-messages)
- [Webhook Testing](#webhook-testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The system supports 5 data sources for lead insertion:

| Source | Method | Status | Setup Time |
|--------|--------|--------|-----------|
| Website Form (Tally) | Webhook | ✅ Ready | 5 min |
| WhatsApp | Webhook | ✅ Ready | 30 min |
| Direct API | REST API | ✅ Ready | 10 min |
| Phone Calls | Manual/API | ✅ Ready | 5 min |
| Social Media | Manual/API | ✅ Ready | 5 min |

---

## Website Form (Tally)

### Overview
Automatically capture leads from your website using Tally.so form builder.

**Current Form**: https://tally.so/r/m66B1A

### Setup Instructions

#### Step 1: Access Tally Form Settings
1. Go to https://tally.so/r/m66B1A
2. Click "Settings" (gear icon, top right)
3. Click "Integrations"

#### Step 2: Add Webhook Integration
1. Click "Add Integration" → "Webhook"
2. Fill in webhook details:
   - **Webhook URL**: `https://your-domain.com/api/webhook`
   - **Method**: POST
   - **Headers**: 
     ```
     Content-Type: application/json
     X-Webhook-Secret: your-webhook-secret
     ```

#### Step 3: Configure Form Fields
Ensure Tally form captures these fields (map to Gharpayy):

| Tally Field | Gharpayy Field | Required | Type |
|-------------|----------------|----------|------|
| Full Name | name | Yes | Text |
| Phone Number | phone | Yes | Text |
| Email Address | email | No | Email |
| Message/Notes | notes | No | Text |
| Budget | budget | No | Number |
| Location | preferredLocation | No | Text |

**Tally Form Structure** (current):
```
Full Name* → name
Phone Number* → phone
Email Address → email
Message → notes
(Optional: Budget, Location fields)
```

#### Step 4: Test Integration
1. Fill out the form on https://tally.so/r/m66B1A
2. Submit the form
3. Check Dashboard → Leads to verify lead was created
4. Check webhook logs: Dashboard → Webhook Logs

### How It Works (Data Flow)
```
User fills Tally form
        ↓
Tally collects data
        ↓
Webhook sends to /api/webhook
        ↓
System validates & auto-assigns to agent
        ↓
Lead appears in Dashboard
        ↓
Event logged in Activity Timeline
```

### Example Webhook Payload (Auto-sent by Tally)
```json
{
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "message": "Interested in 2BHK apartments in Mumbai",
  "source": "Tally Form"
}
```

### Response from /api/webhook
```json
{
  "success": true,
  "leadId": "lead-123",
  "assignedAgent": "Neha Gupta"
}
```

---

## WhatsApp Integration

### Overview
Automatically capture leads from WhatsApp Business messages.

### Prerequisites
- WhatsApp Business Account (free)
- WhatsApp Business API access
- Webhook URL ready

### Setup Instructions

#### Step 1: Get WhatsApp Business API Access
1. Visit https://business.facebook.com
2. Sign in with your Facebook account
3. Go to WhatsApp Business → API Settings
4. Create an app or use existing

#### Step 2: Configure Webhook in WhatsApp Manager
1. In WhatsApp manager, go to "Webhooks"
2. Add new webhook:
   - **Webhook URL**: `https://your-domain.com/api/webhook`
   - **Verify Token**: `your-webhook-secret`

#### Step 3: Subscribe to Events
Enable message received events:
```
messages.incoming
messages.status_update
```

#### Step 4: Test
1. Send message to your WhatsApp Business number
2. Message should create lead automatically
3. Verify in Dashboard → Leads

### How It Works (Data Flow)
```
Customer sends WhatsApp message
        ↓
WhatsApp API sends webhook
        ↓
System extracts name/phone from WhatsApp contact
        ↓
Creates lead with source: "WhatsApp"
        ↓
Auto-assigns to agent
        ↓
Responds with lead confirmation
```

### WhatsApp Message Parsing
The system extracts:
- **name**: WhatsApp contact name
- **phone**: WhatsApp phone number (with country code)
- **message**: Actual message text
- **source**: Automatically set to "WhatsApp"

### Example WhatsApp Webhook Payload
```json
{
  "entry": [
    {
      "messaging": [
        {
          "sender": {
            "id": "+919876543210",
            "name": "John Doe"
          },
          "message": {
            "text": "Hi, I'm interested in 2BHK apartments"
          },
          "timestamp": "2026-03-10T10:30:00Z"
        }
      ]
    }
  ]
}
```

### cURL Test Example
```bash
curl -X POST https://your-domain.com/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "name": "Rajesh Kumar",
    "phone": "+919876543210",
    "message": "Looking for 3BHK in Andheri",
    "source": "WhatsApp"
  }'
```

---

## Direct API Integration

### Overview
Send lead data directly via REST API from your website, app, or custom system.

### Best For
- Custom website forms
- CRM integrations
- Programmatic lead creation
- Third-party app integrations

### Endpoint
```
POST /api/leads
```

### Implementation

#### JavaScript (Frontend Form)
```javascript
// On form submit
async function submitLead(formData) {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        source: 'Website Form',
        budget: parseInt(formData.budget) || 0,
        preferredLocation: formData.location,
        notes: formData.message
      })
    });

    const result = await response.json();
    
    if (result.id) {
      console.log('Lead created:', result.id);
      alert('Thank you! We will contact you soon.');
      // Optionally clear form
      document.getElementById('leadForm').reset();
    } else {
      console.error('Error:', result.error);
      alert('Error creating lead. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please try again.');
  }
}
```

#### Node.js (Backend)
```javascript
const express = require('express');
const app = express();

app.post('/contact', async (req, res) => {
  const { name, phone, email, message } = req.body;

  try {
    const response = await fetch('https://your-domain.com/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        source: 'Website Form',
        notes: message
      })
    });

    const data = await response.json();
    res.json({ success: true, leadId: data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### PHP (Backend)
```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $payload = json_encode([
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'source' => 'Website Form',
        'notes' => $message
    ]);

    $ch = curl_init('https://your-domain.com/api/leads');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $data = json_decode($response, true);

    if (!empty($data['id'])) {
        echo json_encode(['success' => true, 'leadId' => $data['id']]);
    } else {
        echo json_encode(['error' => 'Failed to create lead']);
    }
}
?>
```

#### Python (Backend)
```python
import requests
import json

def create_lead(name, phone, email, message):
    url = 'https://your-domain.com/api/leads'
    
    payload = {
        'name': name,
        'phone': phone,
        'email': email,
        'source': 'Website Form',
        'notes': message
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        return {'success': True, 'leadId': data['id']}
    else:
        return {'error': response.json()['error']}

# Usage
result = create_lead(
    name='Jane Smith',
    phone='+919876543210',
    email='jane@example.com',
    message='Interested in 2BHK'
)
print(result)
```

### Form HTML Example
```html
<form id="leadForm" onsubmit="submitLead(event)">
  <input type="text" name="fullName" placeholder="Full Name" required>
  <input type="tel" name="phone" placeholder="Phone" required>
  <input type="email" name="email" placeholder="Email">
  <input type="number" name="budget" placeholder="Budget (optional)">
  <input type="text" name="location" placeholder="Preferred Location">
  <textarea name="message" placeholder="Message (optional)"></textarea>
  <button type="submit">Submit</button>
</form>

<script>
async function submitLead(event) {
  event.preventDefault();
  const formData = new FormData(document.getElementById('leadForm'));
  
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData))
  });
  
  const result = await response.json();
  if (result.id) {
    alert('Lead created successfully!');
    document.getElementById('leadForm').reset();
  } else {
    alert('Error: ' + result.error);
  }
}
</script>
```

---

## Phone Call Logs

### Method 1: Manual Entry (Quickest)
1. Open Dashboard
2. Click "Leads" → "Add Lead"
3. Fill form:
   - Name
   - Phone
   - Email (optional)
   - Budget (optional)
   - Location (optional)
4. Select source: "Phone Call"
5. Add notes: "Called regarding X"
6. Click "Create"
7. System auto-assigns to agent

### Method 2: API Integration (Automated)

#### Setup Phone Call Logging System
```javascript
// When agent logs call completion
async function logPhoneCall(agentId, leadData) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      source: 'Phone Call',
      notes: `Called by ${agentId} on ${new Date().toLocaleString()}`,
      budget: leadData.budget,
      preferredLocation: leadData.location
    })
  });

  const lead = await response.json();
  
  // Log call event
  await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      leadId: lead.id,
      type: 'contacted',
      description: 'Inbound phone call',
      createdBy: agentId,
      createdByName: agentId // Get from your system
    })
  });

  return lead;
}
```

#### CRM Integration (From Your Phone System)
```bash
# If using Twilio or similar
curl -X POST https://your-domain.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incoming Call",
    "phone": "+919876543210",
    "source": "Phone Call",
    "notes": "Missed call from this number",
    "budget": 0
  }'
```

---

## Social Media Messages

### Method 1: Manual Entry
1. Open Dashboard → Conversations
2. Create new conversation
3. Link to lead or create new
4. Add message details
5. Tag source: Facebook, Instagram, LinkedIn, Twitter

### Method 2: API Integration

#### Facebook Messenger Setup
1. Get Facebook API credentials
2. Configure webhook:
   ```
   https://your-domain.com/api/webhook
   ```
3. Send webhook data:
```bash
curl -X POST https://your-domain.com/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-secret" \
  -d '{
    "name": "Social Media User",
    "phone": "+919876543210",
    "message": "Interested in property at Mumbai",
    "source": "Facebook Messenger"
  }'
```

#### Instagram DM Setup
1. Get Instagram Business API access
2. Configure webhook endpoint
3. Parse incoming DMs:
```json
{
  "name": "Instagram Follower",
  "phone": "+919988776655",
  "message": "Hi, interested in your listings",
  "source": "Instagram DM"
}
```

#### LinkedIn Integration
1. Setup LinkedIn webhooks
2. Parse connection requests and messages
3. Send to webhook with source: "LinkedIn"

#### Twitter/X Setup
1. Setup Twitter API v2 webhooks
2. Monitor mentions and DMs
3. Create leads from relevant interactions

---

## Webhook Testing

### Using cURL

#### Test Webhook Success
```bash
curl -X POST http://localhost:3200/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "name": "Test Lead",
    "phone": "+919876543210",
    "email": "test@example.com",
    "source": "Test",
    "notes": "Testing webhook"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "leadId": "lead-xyz",
  "assignedAgent": "Agent Name"
}
```

#### Test Webhook Failure (Missing Secret)
```bash
curl -X POST http://localhost:3200/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "phone": "+919876543210"
  }'
```

**Expected Response** (401):
```json
{
  "error": "Unauthorized"
}
```

#### Test Webhook Failure (Missing Fields)
```bash
curl -X POST http://localhost:3200/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected Response** (400):
```json
{
  "error": "name and phone are required"
}
```

### Using Postman
1. Create new POST request
2. URL: `http://localhost:3200/api/webhook`
3. Headers:
   - `Content-Type: application/json`
   - `X-Webhook-Secret: your-webhook-secret`
4. Body (JSON):
   ```json
   {
     "name": "Test Lead",
     "phone": "+919876543210",
     "email": "test@example.com",
     "source": "Postman Test",
     "notes": "Testing webhook"
   }
   ```
5. Click "Send"

### Using VS Code REST Client
Create `webhook-test.http`:
```http
### Test webhook
POST http://localhost:3200/api/webhook
Content-Type: application/json
X-Webhook-Secret: your-webhook-secret

{
  "name": "Test Lead",
  "phone": "+919876543210",
  "email": "test@example.com",
  "source": "Website Form",
  "notes": "Test webhook"
}

### Test API directly
POST http://localhost:3200/api/leads
Content-Type: application/json

{
  "name": "Direct API Test",
  "phone": "+919876543211",
  "email": "direct@example.com",
  "source": "Direct API",
  "budget": 5000000
}
```

---

## Troubleshooting

### Issue: Webhook receives 503 error
**Problem**: Firebase not initialized

**Solution**:
1. Verify `service-account.json` exists in project root
2. Check file has correct permissions: `chmod 644 service-account.json`
3. Verify environment variables in `.env.local`
4. Restart dev server: `npm run dev`

### Issue: Webhook receives 401 Unauthorized
**Problem**: Wrong webhook secret

**Solution**:
1. Check header: `X-Webhook-Secret` matches `WEBHOOK_SECRET` in `.env.local`
2. Verify exact spelling and capitalization
3. Make sure header is passed in request

### Issue: Webhook receives 400 Bad Request
**Problem**: Missing required fields

**Solution**:
1. Ensure request includes `name` and `phone`
2. Check data format: phone should be string (e.g., "+919876543210")
3. Name should be non-empty string

### Issue: Lead created but not showing in Dashboard
**Problem**: Data sync delay

**Solution**:
1. Refresh browser (F5)
2. Wait 2-3 seconds for real-time sync
3. Check browser console for errors
4. Check Firebase Firestore in console for lead document

### Issue: Lead assigned to wrong agent
**Problem**: Auto-assignment algorithm

**Solution**:
1. Check agent availability status
2. Verify agents have `isActive: true` in database
3. Update agent assignment manually in Dashboard
4. Check Firebase Firestore security rules

### Issue: No webhook logs appearing
**Problem**: Logs not being saved

**Solution**:
1. Check endpoint: `GET /api/webhook-logs`
2. Verify Firestore has `webhook_logs` collection
3. Check Firebase rules allow write to `webhook_logs`
4. Check browser console for errors

### Issue: Form submission hangs
**Problem**: Network or API timeout

**Solution**:
1. Check internet connection
2. Verify Firebase connection: `npm run build`
3. Check backend logs in terminal
4. Try with shorter timeout: 30 seconds
5. Check for CORS issues in console

---

## Best Practices

1. **Always include phone number**: System requires it for identification
2. **Use consistent phone format**: Include country code (e.g., +91 for India)
3. **Test integrations first**: Use testing endpoints before going live
4. **Monitor webhook logs**: Regular check Dashboard → Webhook Logs for failures
5. **Handle errors gracefully**: Show user-friendly messages on errors
6. **Validate data**: Check data format before sending to API
7. **Log all integrations**: Keep audit trail in webhook_logs
8. **Keep secrets secure**: Never expose `WEBHOOK_SECRET` in code
9. **Set up monitoring**: Alert on failed webhooks
10. **Test with real data**: Use actual leads during testing

---

## Version

**Guide Version**: 1.0.0
**Last Updated**: March 10, 2026

For more details, see [README.md](./README.md) and [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
