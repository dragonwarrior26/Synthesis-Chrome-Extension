# Chrome Web Store Submission Guide

This guide details the steps to submit the fixed version of **Synthesis** to the Chrome Web Store to resolve the privacy policy violation.

## Prerequisites

1.  **Updated Build**: We have already updated the code and verified the build. The production files are in `synthesis/apps/extension/dist`.
2.  **Privacy Policy Text**: The updated text is in `synthesis/PRIVACY_POLICY.md`.

## Step 1: Privacy Policy URL

You have already hosted the policy. **Use this specific link**:

`https://gistcdn.githack.com/dragonwarrior26/d303acb8cdd834b3f0c81caf9eef4e2c/raw/ce69221409f19a3898dd66451268ca28b9b57631/privacypolicy.html`

> [!IMPORTANT]
> Use the link above (the **githack** link), NOT the "Raw" Gist link. The githack link renders the HTML correctly as a webpage, whereas the raw Gist link often shows up as plain text code, which looks unprofessional.

## Step 2: Update Store Listing

1.  Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard).
2.  Click on **Synthesis - Intelligent Tab Manager** (Item ID: `kipmpmfnhahfeggkbfjoedpbdecpojef`).
3.  Navigate to the **Privacy** tab in the left menu.
4.  **Privacy Policy**: Paste the **Raw Gist URL** from Step 1 into the "Privacy policy" field.
5.  **Save Draft**.

## Step 3: Upload New Package

1.  Navigate to the **Package** tab.
2.  Click **Upload new package**.
3.  Select the `dist` folder from your project:
    *   Path: `.../Synthesis - Chrome Extension/synthesis/apps/extension/dist`
    *   *Tip*: You may need to zip the `dist` folder first if the dashboard requires a zip file. Run `zip -r extension.zip dist` inside `apps/extension` if needed, or right-click `dist` -> Compress on Mac.
4.  Wait for the upload to complete.

## Step 4: Submit for Review

1.  Once uploaded, you might see a "Submit for Review" button.
2.  In the "Review notes" (if available) or if responding to the violation email/notification:
    *   Mention: *"Added a prominent disclosure screen on first launch to ensure user consent. Updated Privacy Policy link to be publicly accessible."*
3.  Submit.

> [!NOTE]
> Detailed walkthrough of changes is available in `walkthrough.md`.
