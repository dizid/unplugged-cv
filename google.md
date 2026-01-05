# Google Cloud Setup for unplugged.cv

## Step 1: Enable Required APIs

Go to **APIs & Services** in the left menu, then **Library**, and enable these two APIs:

1. **Google Docs API** - Search for "Google Docs API" and click Enable
2. **Google Picker API** - Search for "Google Picker API" and click Enable

## Step 2: Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the **OAuth consent screen** first:
   - User Type: **External**
   - App name: `unplugged.cv`
   - User support email: your email
   - Developer contact: your email
   - Save and continue through Scopes (no changes needed)
   - Add yourself as a test user
   - Save

4. Back to Credentials → Create OAuth client ID:
   - Application type: **Web application**
   - Name: `unplugged.cv Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://unplugged.cv` (or your production domain)
   - Leave Authorized redirect URIs empty (we use implicit flow)
   - Click **Create**

5. Copy the **Client ID** (looks like `xxxxx.apps.googleusercontent.com`)

## Step 3: Create API Key

1. Still in **Credentials**, click **+ CREATE CREDENTIALS** → **API key**
2. Copy the API key
3. (Optional but recommended) Click on the key to restrict it:
   - Application restrictions: **HTTP referrers**
   - Add: `localhost:3000/*` and `unplugged.cv/*`
   - API restrictions: Restrict to **Google Docs API** and **Google Picker API**

## Step 4: Update Credentials

Update `.env.local`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_API_KEY=your-api-key
```

Update Netlify env vars:
```bash
netlify env:set NEXT_PUBLIC_GOOGLE_CLIENT_ID "your-client-id.apps.googleusercontent.com"
netlify env:set NEXT_PUBLIC_GOOGLE_API_KEY "your-api-key"
```
