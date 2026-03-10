#!/usr/bin/env node

/**
 * Firebase Data Seeding Script
 * This script populates Firebase Firestore with sample data for the Gharpayy CRM
 * 
 * Usage: node scripts/seed-firebase.js
 * 
 * The script uses service-account.json for authentication
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load service account credentials
const serviceAccountPath = path.join(__dirname, '../service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ service-account.json not found at:', serviceAccountPath);
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Sample data
const SAMPLE_AGENTS = [
    {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@gharpayy.com',
        phone: '9876543210',
        role: 'agent',
        isActive: true,
    },
    {
        name: 'Anita Desai',
        email: 'anita.desai@gharpayy.com',
        phone: '9123456780',
        role: 'agent',
        isActive: true,
    },
    {
        name: 'Deepak Singh',
        email: 'deepak.singh@gharpayy.com',
        phone: '8234567890',
        role: 'agent',
        isActive: true,
    },
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@gharpayy.com',
        phone: '9345678901',
        role: 'agent',
        isActive: true,
    },
];

const SAMPLE_LEADS = [
    {
        name: 'Arjun Mehta',
        phone: '9123456780',
        email: 'arjun.mehta@email.com',
        source: 'WhatsApp',
        stage: 'Contacted',
        assignedAgentName: 'Ravi Kumar',
        notes: 'Interested in 2BHK near Sector 15',
        budget: 50000,
        preferredLocation: 'Sector 15, Noida',
    },
    {
        name: 'Sneha Rajan',
        phone: '8234567890',
        email: 'sneha.rajan@email.com',
        source: 'Tally Webhook',
        stage: 'Visit Scheduled',
        assignedAgentName: 'Anita Desai',
        notes: 'Scheduled visit for Saturday 3 PM',
        budget: 45000,
        preferredLocation: 'Greater Noida',
    },
    {
        name: 'Karan Verma',
        phone: '7345678901',
        email: 'karan.verma@email.com',
        source: 'Phone Call',
        stage: 'Booked',
        assignedAgentName: 'Anita Desai',
        notes: 'Confirmed booking for 1BHK, move-in next month',
        budget: 35000,
        preferredLocation: 'Noida City Center',
    },
    {
        name: 'Meena Pillai',
        phone: '9456789012',
        email: 'meena.pillai@email.com',
        source: 'Social Media',
        stage: 'Visit Completed',
        assignedAgentName: 'Deepak Singh',
        notes: 'Visited 2 properties, interested in Sector 62',
        budget: 55000,
        preferredLocation: 'Sector 62, Noida',
    },
    {
        name: 'Rahul Nair',
        phone: '8567890123',
        email: 'rahul.nair@email.com',
        source: 'WhatsApp',
        stage: 'Lost',
        assignedAgentName: 'Deepak Singh',
        notes: 'Budget exceeded, moved to Bangalore',
        budget: 60000,
        preferredLocation: 'Sector 18',
    },
    {
        name: 'Pooja Iyer',
        phone: '7678901234',
        email: 'pooja.iyer@email.com',
        source: 'Website',
        stage: 'Requirement Collected',
        assignedAgentName: 'Ravi Kumar',
        notes: '3BHK, family of 4, looking for furnished',
        budget: 70000,
        preferredLocation: 'South Delhi',
    },
    {
        name: 'Vijay Reddy',
        phone: '9789012345',
        email: 'vijay.reddy@email.com',
        source: 'Referral',
        stage: 'Property Suggested',
        assignedAgentName: 'Anita Desai',
        notes: 'Referred by Karan Verma, looking for 2BHK',
        budget: 52000,
        preferredLocation: 'Sector 50, Noida',
    },
    {
        name: 'Rohan Das',
        phone: '8801234567',
        email: 'rohan.das@email.com',
        source: 'Phone Call',
        stage: 'New Lead',
        assignedAgentName: 'Priya Sharma',
        notes: 'First-time caller, looking for PG',
        budget: 15000,
        preferredLocation: 'Sector 137, Noida',
    },
    {
        name: 'Ritika Shah',
        phone: '9988776655',
        email: 'ritika.shah@email.com',
        source: 'Referral',
        stage: 'Contacted',
        assignedAgentName: 'Priya Sharma',
        notes: 'Looking for girls PG near Delhi University',
        budget: 20000,
        preferredLocation: 'North Delhi',
    },
    {
        name: 'Priya Sharma',
        phone: '9876543210',
        email: 'priya@email.com',
        source: 'Website',
        stage: 'New Lead',
        assignedAgentName: 'Ravi Kumar',
        notes: 'Website inquiry form submission',
        budget: 48000,
        preferredLocation: 'Sector 15, Noida',
    },
];

const SAMPLE_PROPERTIES = [
    {
        name: 'Royal PG Sector 15',
        location: 'Sector 15, Noida',
        rent: 12000,
        bedsAvailable: 5,
        amenities: ['WiFi', 'Mess', 'Laundry', 'AC', 'Shared Kitchen'],
    },
    {
        name: 'Green Valley 2BHK',
        location: 'Greater Noida',
        rent: 45000,
        bedsAvailable: 2,
        amenities: ['Parking', 'Lift', 'Security', 'Water Supply'],
    },
    {
        name: 'City Center Apartment',
        location: 'Noida City Center',
        rent: 35000,
        bedsAvailable: 1,
        amenities: ['AC', 'WiFi', 'Parking', 'Gated Community'],
    },
    {
        name: 'Sector 62 Residency',
        location: 'Sector 62, Noida',
        rent: 55000,
        bedsAvailable: 3,
        amenities: ['Pool', 'Gym', 'Parking', 'Security', 'Maintenance'],
    },
    {
        name: 'Delhi University PG',
        location: 'North Delhi',
        rent: 18000,
        bedsAvailable: 8,
        amenities: ['Mess', 'WiFi', 'Laundry', 'Study Room'],
    },
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting Firebase database seeding...\n');

        // Clear existing collections (optional - uncomment to clear)
        // await clearCollections(['agents', 'leads', 'properties']);

        // Seed Agents
        console.log('📝 Seeding Agents...');
        const agentRefs = [];
        for (const agent of SAMPLE_AGENTS) {
            const docRef = await db.collection('agents').add({
                ...agent,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            agentRefs.push({ id: docRef.id, name: agent.name });
            console.log(`   ✅ Added agent: ${agent.name}`);
        }

        // Seed Properties
        console.log('\n🏠 Seeding Properties...');
        const propertyRefs = [];
        for (const property of SAMPLE_PROPERTIES) {
            const docRef = await db.collection('properties').add({
                ...property,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            propertyRefs.push({ id: docRef.id, name: property.name });
            console.log(`   ✅ Added property: ${property.name}`);
        }

        // Seed Leads (with agent references)
        console.log('\n👤 Seeding Leads...');
        for (const lead of SAMPLE_LEADS) {
            // Find agent ID by name
            const agent = agentRefs.find(a => a.name === lead.assignedAgentName);
            const leadData = {
                ...lead,
                assignedAgentId: agent?.id || '',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            const docRef = await db.collection('leads').add(leadData);
            console.log(`   ✅ Added lead: ${lead.name} (${lead.stage})`);
        }

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   • Agents: ${SAMPLE_AGENTS.length}`);
        console.log(`   • Leads: ${SAMPLE_LEADS.length}`);
        console.log(`   • Properties: ${SAMPLE_PROPERTIES.length}`);
        console.log('\n🎉 Your Firebase database is now populated with sample data!');
        console.log('Run: npm run dev');
        console.log('Then visit: http://localhost:3000\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

async function clearCollections(collections) {
    console.log('🗑️  Clearing collections...');
    for (const collectionName of collections) {
        const querySnapshot = await db.collection(collectionName).get();
        const batch = db.batch();
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`   ✅ Cleared ${collectionName}`);
    }
}

// Run the seeding
seedDatabase().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
