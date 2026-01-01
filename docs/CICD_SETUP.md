# Chrome Web Store CI/CD Setup Guide

This guide explains how to set up automated deployments to the Chrome Web Store.

## Prerequisites

1. Extension is already published to Chrome Web Store
2. GitHub repository with Actions enabled

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Navigate to **APIs & Services** → **Library**
4. Search for and enable **Chrome Web Store API**
5. Go to **APIs & Services** → **Credentials**
6. Click **Create Credentials** → **OAuth client ID**
7. **Crucial:** Select **Web application** as application type (NOT Desktop app)
8. Name it "Chrome Web Store CI"
9. Under **Authorized redirect URIs**, click **Add URI** and paste:
   ```
   https://developers.google.com/oauthplayground
   ```
10. Click **Create**
11. Note down your `Client ID` and `Client Secret`

## Step 1.5: Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Ensure **User Type** is set to **External** (or keep as is if created)
3. **Crucial:** Under **Test users**, click **Add Users**
4. Enter your own email address (`aayushsharma0426@gmail.com`)
5. Click **Save**
*(This fixes the "App not verified" / "Access denied" error)*

## Step 2: Get Refresh Token

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in top-right
3. Check **Use your own OAuth credentials**
4. Enter your `Client ID` and `Client Secret`
5. Click **Close**
6. In the left panel, input your own scopes field, enter:
   ```
   https://www.googleapis.com/auth/chromewebstore
   ```
7. Click **Authorize APIs** and sign in with the Google Account that owns the extension
8. **Note:** If you see "Google hasn’t verified this app", click **Advanced** -> **Go to Chrome Web Store CI (unsafe)** or click **Continue**. This is normal for your own internal app.
9. Click **Allow** to grant access.
10. Click **Exchange authorization code for tokens**
11. Copy the `Refresh token`

## Step 3: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `EXTENSION_ID` | `kipmpmfnhahfeggkbfjoedpbdecpojef` |
| `CHROME_CLIENT_ID` | Your OAuth Client ID |
| `CHROME_CLIENT_SECRET` | Your OAuth Client Secret |
| `CHROME_REFRESH_TOKEN` | Your Refresh Token |
| `VITE_SUPABASE_URL` | Your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

## Step 4: Trigger a Deployment

### Option A: Tag-based deployment
```bash
# Update version in manifest.json first
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push && git push --tags
```

### Option B: Manual dispatch
1. Go to **Actions** tab in GitHub
2. Select **Deploy to Chrome Web Store**
3. Click **Run workflow**

## Workflow Behavior

- **On tag push**: Automatically builds and publishes
- **Manual dispatch**: Can optionally skip publish (upload only)
- Artifacts are saved for each deployment
