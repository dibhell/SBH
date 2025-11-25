<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1CcbRK82SnyarNXhSMfnt9pX3eOzsCf6w

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## How to approve and merge when you are the only reviewer

GitHub does not allow authors to approve their own pull requests, so you have a few options when you are the only collaborator:

1. **Remove the required-review rule** – If your repository has branch protection requiring PR reviews, disable that rule (Settings → Branches → Branch protection rule → edit → uncheck "Require a pull request before merging"). Afterward you can merge directly without a reviewer.
2. **Use an admin override** – If you are an admin and the rule allows it, enable "Allow administrators to bypass" in the branch protection rule, then merge the PR without an approval.
3. **Merge without a PR** – Push changes straight to the branch (e.g., `main`) if your workflow permits skipping pull requests.
4. **Use a second account** – Create a second GitHub account, add it as a collaborator, and have that account review and approve.

These approaches avoid the "Pull request authors can't approve their own pull request" limitation shown in the GitHub review dialog.
