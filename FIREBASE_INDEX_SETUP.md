# Firebase Index Setup Guide

## Quick Fix - Create Required Indexes

Your Firestore queries need composite indexes to work properly. Follow these steps:

### Option 1: Firebase CLI (Recommended - Fast)

```bash
# 1. Login to Firebase (one-time only)
npx firebase-tools login

# 2. Deploy the indexes
npx firebase-tools deploy --only firestore:indexes

# 3. Wait 1-5 minutes for indexes to build
```

### Option 2: Firebase Console (Manual)

**For Completed Collection:**
1. Click this link: https://console.firebase.google.com/v1/r/project/flix-app-96eb4/firestore/indexes?create_composite=ClBwcm9qZWN0cy9mbGl4LWFwcC05NmViNC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvQ29tcGxldGVkL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
2. Click **"Create Index"**
3. Wait for it to finish building

**For Watchlists Collection:**
1. Go to: [Firebase Console → Firestore → Indexes](https://console.firebase.google.com/project/flix-app-96eb4/firestore/indexes)
2. Click **"Create Index"**
3. Set up:
   - **Collection ID**: `Watchlists`
   - **Field 1**: `userId` - Ascending
   - **Field 2**: `createdAt` - Descending
   - **Query scope**: Collection
4. Click **"Create"**
5. Wait for it to finish building

## Verify Indexes

After creating, check status at:
https://console.firebase.google.com/project/flix-app-96eb4/firestore/indexes

Status should change from "Building..." to "Enabled" (usually takes 1-5 minutes).

## What's Fixed

- ✅ Error handling added to prevent crashes
- ✅ App works without real-time updates until indexes are created
- ✅ Clear console warnings instead of errors
- ✅ Graceful degradation

The page will work, but real-time updates will be disabled until you create the indexes.
