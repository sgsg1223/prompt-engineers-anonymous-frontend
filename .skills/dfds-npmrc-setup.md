---
name: dfds-npmrc-setup
description: |
  Configure GitHub Package Registry authentication for DFDS Navigator packages. Step-by-step guide to create Personal Access Token, generate .npmrc file, and troubleshoot common authentication issues.

  Use when setting up a new machine, encountering 401/404 errors installing @dfds-frontend packages, or helping team members configure their development environment. Prevents 5 common authentication errors.
user-invocable: true
allowed-tools: [Bash, Read, Write]
metadata:
  registry: "https://npm.pkg.github.com/"
  scope: "@dfds-frontend"
  organization: "dfds-frontend"
  last_verified: "2026-02-02"
  required_permissions: ["read:packages"]
---

# DFDS .npmrc Setup Skill

⚠️ **Critical for Development**

This skill guides you through configuring GitHub Package Registry authentication to install DFDS Navigator packages (`@dfds-frontend/*`). Without proper .npmrc configuration, you'll encounter 401 Unauthorized or 404 Not Found errors when installing Navigator packages.

**What You'll Configure:**
- GitHub Personal Access Token (classic) with `read:packages` permission
- .npmrc file in home directory (`~/.npmrc`)
- SSO authorization for `dfds-internal` organization

**Time Required:** 5-10 minutes (one-time setup per machine)

This skill prevents **5 common authentication errors** and provides troubleshooting for package installation issues.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Process](#setup-process)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [Common Issues](#common-issues)

---

## Prerequisites

**What You Need:**
- GitHub account with access to `dfds-internal` organization
- Command line access (Terminal on Mac, PowerShell/Command Prompt on Windows)
- npm or pnpm installed

**Estimated Time:** 5-10 minutes

---

## Setup Process

### Step 0: Check for Existing .npmrc Files

Before creating a new .npmrc, check if you already have one to avoid overwriting important configurations.

**Check Home Directory:**

```bash
# View .npmrc in home directory
cat ~/.npmrc

# Or open in editor
open ~/.npmrc  # Mac
notepad ~/.npmrc  # Windows
```

**Check Project Directory:**

```bash
# View .npmrc in current project
cat ./.npmrc
```

**If .npmrc Files Exist:**
1. Copy the contents to a safe location (not in home folder or repo)
2. Delete the files
3. You'll recreate them with the correct configuration

**Show Hidden Files:**
- **Mac**: Press `Cmd + Shift + .` in Finder
- **Windows**: In File Explorer, View → Show → Hidden items

---

### Step 1: Create GitHub Personal Access Token

#### 1.1 Navigate to GitHub Settings

Go to: [GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens)

Or manually navigate:
1. Click your profile picture (top right)
2. Settings
3. Developer settings (bottom left)
4. Personal access tokens
5. Tokens (classic)

#### 1.2 Generate New Token

1. Click **"Generate new token"** → **"Generate new token (classic)"**

2. **Fill in token details:**
   - **Note**: `DFDS Package Registry Token` (or similar descriptive name)
   - **Expiration**: `No expiration` (recommended for development)
   - **Select scopes**: Check **`read:packages`** only

3. Click **"Generate token"** at bottom of page

#### 1.3 Save Your Token

⚠️ **Critical**: You'll only see this token once!

1. Copy the token to your clipboard immediately
2. Store in password manager (recommended: 1Password, LastPass, Bitwarden)
3. Keep the browser tab open until you've completed the next steps

**Token Format:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 1.4 Configure SSO Authorization

🔒 **Required for DFDS Internal Packages**

1. Find your newly created token in the list
2. Click **"Configure SSO"** button next to the token
3. Next to **`dfds-internal`**, click **"Authorize"**
4. Confirm authorization

**Without SSO authorization**, you'll get 404 errors even with a valid token.

---

### Step 2: Generate .npmrc File Automatically

#### 2.1 Run npm login Command

Paste this command into your terminal:

```bash
npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend
```

Press Enter. You'll be prompted for credentials.

#### 2.2 Enter Credentials

⚠️ **IMPORTANT**: This is NOT your GitHub password!

**Prompts and Responses:**

| Prompt | What to Enter |
|--------|---------------|
| `Username:` | Your GitHub username (e.g., `john.doe`) |
| `Password:` | The Personal Access Token from Step 1 (starts with `ghp_`) |
| `Email:` | Your email address (can be anything) |

**Example Session:**

```bash
$ npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend
Username: john.doe
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Email: john.doe@dfds.com
Logged in as john.doe on https://npm.pkg.github.com/.
```

**Result:** This creates `~/.npmrc` in your home directory.

---

### Step 3: Verify .npmrc Configuration

#### 3.1 Locate the File

```bash
# View the file
cat ~/.npmrc

# Or open in editor
code ~/.npmrc  # VS Code
nano ~/.npmrc  # Terminal editor
```

#### 3.2 Expected Content

Your `~/.npmrc` should contain exactly these two lines:

```bash
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
@dfds-frontend:registry=https://npm.pkg.github.com/
```

**Line Breakdown:**

1. `@dfds-frontend:registry=https://npm.pkg.github.com/`
   - Routes all `@dfds-frontend/*` packages to GitHub Package Registry
   - Other packages still use default npm registry (npmjs.com)

2. `//npm.pkg.github.com/:_authToken=ghp_xxx...`
   - Provides authentication token for GitHub Package Registry
   - Token is used automatically when installing `@dfds-frontend/*` packages

**Security Note:** This file contains secrets and should NEVER be committed to Git.

---

### Step 4: Test the Configuration

#### 4.1 Clear Cache and Reinstall

```bash
# For pnpm users
pnpm cache delete
rm -rf node_modules pnpm-lock.yaml
pnpm install

# For npm users
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4.2 Verify Installation

Check if Navigator packages installed correctly:

```bash
# Check if packages exist
ls node_modules/@dfds-frontend

# Should see packages like:
# navigator-components/
# navigator-styles/
# navigator-icons/
```

#### 4.3 Success Indicators

✅ **Installation succeeded if:**
- No 401 or 404 errors during install
- `node_modules/@dfds-frontend` directory exists
- Packages listed in `package.json` are present

❌ **Installation failed if:**
- `401 Unauthorized` errors
- `404 Not Found` errors
- Missing `@dfds-frontend` packages in `node_modules`

See [Common Issues](#common-issues) section for troubleshooting.

---

## Verification

### Quick Verification Checklist

Run through this checklist to ensure everything is configured correctly:

- [ ] Personal Access Token created with `read:packages` scope
- [ ] SSO authorized for `dfds-internal` organization
- [ ] `~/.npmrc` file exists in home directory
- [ ] `.npmrc` contains auth token line
- [ ] `.npmrc` contains registry scope line
- [ ] Token in `.npmrc` matches token from GitHub
- [ ] Successfully ran `pnpm install` or `npm install`
- [ ] `node_modules/@dfds-frontend` directory exists
- [ ] No 401 or 404 errors during installation

### Verification Command

Test authentication directly:

```bash
npm view @dfds-frontend/navigator-components
```

**Success:** Shows package information (version, description, etc.)

**Failure:** Shows 401 Unauthorized or 404 Not Found error

---

## Troubleshooting

### Issue #1: 401 Unauthorized Error

**Error Message:**
```
npm ERR! code E401
npm ERR! 401 Unauthorized - GET https://npm.pkg.github.com/@dfds-frontend/navigator-components
```

**Causes:**
1. Token not in `~/.npmrc`
2. Token expired or invalid
3. SSO not authorized for `dfds-internal`
4. Token lacks `read:packages` permission

**Solutions:**

1. **Verify token in .npmrc:**
   ```bash
   cat ~/.npmrc | grep authToken
   ```
   Should show: `//npm.pkg.github.com/:_authToken=ghp_xxx...`

2. **Check SSO authorization:**
   - Go to [GitHub Tokens](https://github.com/settings/tokens)
   - Find your token
   - Ensure `dfds-internal` is authorized

3. **Regenerate token:**
   - Delete old token
   - Create new token with `read:packages`
   - Authorize SSO
   - Update `~/.npmrc`

### Issue #2: 404 Not Found Error

**Error Message:**
```
npm ERR! code E404
npm ERR! 404 Not Found - GET https://npm.pkg.github.com/@dfds-frontend/navigator-components
```

**Causes:**
1. SSO not authorized (most common)
2. Package name misspelled
3. No access to `dfds-frontend` organization

**Solutions:**

1. **Authorize SSO (most common fix):**
   - Go to [GitHub Tokens](https://github.com/settings/tokens)
   - Find your token
   - Click "Configure SSO"
   - Authorize `dfds-internal`

2. **Verify package name:**
   - Check package.json for correct spelling
   - Should be `@dfds-frontend/navigator-components` (not `@dfds/` or other variations)

3. **Verify organization access:**
   - Go to [dfds-frontend packages](https://github.com/orgs/dfds-frontend/packages)
   - Can you see the packages? If not, request access

### Issue #3: Token in Plain Text in .npmrc

**Error:** Seeing `Password:` instead of token in .npmrc

**Cause:** Entered GitHub password instead of Personal Access Token during `npm login`

**Solution:**
1. Delete `~/.npmrc`
2. Run `npm login` again
3. **Important:** Enter Personal Access Token (starts with `ghp_`) for password, not your GitHub password

### Issue #4: .npmrc in Project vs Home Directory

**Issue:** Both `~/.npmrc` (home) and `./.npmrc` (project) exist

**Behavior:** Project `.npmrc` takes precedence over home `.npmrc`

**Solution:**

**Option 1 - Use Home .npmrc (Recommended):**
- Delete project `.npmrc`
- Keep `~/.npmrc` with authentication
- Add `.npmrc` to `.gitignore`

**Option 2 - Use Project .npmrc:**
- Delete `~/.npmrc`
- Keep project `.npmrc` with authentication
- ⚠️ **MUST** add `.npmrc` to `.gitignore` to avoid committing secrets

**Best Practice:** Use home directory `~/.npmrc` for personal tokens, keep project `.npmrc` out of Git.

### Issue #5: pnpm vs npm Differences

**Issue:** Configuration works for npm but not pnpm (or vice versa)

**Cause:** pnpm has stricter security and may cache differently

**Solution:**

```bash
# Clear pnpm cache completely
pnpm cache delete

# Remove node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# Reinstall with force
pnpm install --force
```

**pnpm-Specific Configuration:**

Add to `~/.npmrc` or project `.npmrc`:

```bash
# Existing lines
//npm.pkg.github.com/:_authToken=ghp_xxx...
@dfds-frontend:registry=https://npm.pkg.github.com/

# Add these for pnpm
auto-install-peers=true
strict-peer-dependencies=false
```

---

## Security Best Practices

### DO ✅

1. **Store tokens in password manager**
   - Use 1Password, LastPass, Bitwarden, etc.
   - Label clearly: "GitHub DFDS Package Registry Token"

2. **Add .npmrc to .gitignore**
   ```bash
   echo ".npmrc" >> .gitignore
   ```

3. **Use home directory for personal tokens**
   - `~/.npmrc` for authentication
   - Project `.npmrc` for registry config only (no tokens)

4. **Set descriptive token names**
   - "DFDS Package Registry Token - MacBook Pro"
   - Helps identify tokens when managing multiple

5. **Authorize SSO immediately**
   - Don't forget this step
   - Required for accessing `dfds-internal` packages

### DON'T ❌

1. **Never commit .npmrc to Git**
   - Contains authentication secrets
   - Can leak tokens to anyone with repo access

2. **Don't use "No expiration" for production**
   - OK for local development
   - Use expiration for CI/CD or production tokens

3. **Don't share tokens between team members**
   - Each developer should have their own token
   - Easier to revoke if compromised

4. **Don't store tokens in unencrypted files**
   - Never in plain text documents
   - Never in Slack/email
   - Use password manager or secure notes

5. **Don't skip SSO authorization**
   - 404 errors will persist without it
   - Common mistake that wastes time

---

## Common Issues

### Issue #1: "npm login" Not Found

**Error:** `command not found: npm`

**Cause:** npm not installed or not in PATH

**Solution:**
```bash
# Check if npm is installed
npm --version

# If not installed, install Node.js (includes npm)
# Mac: brew install node
# Windows: Download from nodejs.org
```

### Issue #2: Token Permissions Changed

**Error:** Previously working setup now fails with 401

**Cause:** GitHub token permissions or SSO authorization revoked

**Solution:**
1. Check token status: [GitHub Tokens](https://github.com/settings/tokens)
2. Verify `read:packages` permission still checked
3. Re-authorize SSO if needed

### Issue #3: Multiple GitHub Accounts

**Issue:** Using different GitHub accounts for work vs personal projects

**Solution:** Use project-specific `.npmrc` files:

```bash
# Work project .npmrc (in project directory)
//npm.pkg.github.com/:_authToken=ghp_work_token_here
@dfds-frontend:registry=https://npm.pkg.github.com/

# Personal project .npmrc (in home directory)
//npm.pkg.github.com/:_authToken=ghp_personal_token_here
@other-org:registry=https://npm.pkg.github.com/
```

Project `.npmrc` overrides home `~/.npmrc` when present.

### Issue #4: CI/CD Pipeline Failures

**Error:** CI/CD can install public packages but fails on `@dfds-frontend` packages

**Cause:** CI/CD environment doesn't have .npmrc configured

**Solution:** Add GitHub token as CI/CD secret:

**GitHub Actions:**
```yaml
# .github/workflows/build.yml
- name: Setup .npmrc
  run: |
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.GITHUB_TOKEN }}" >> .npmrc
    echo "@dfds-frontend:registry=https://npm.pkg.github.com/" >> .npmrc

- name: Install dependencies
  run: npm install
```

**GitLab CI:**
```yaml
before_script:
  - echo "//npm.pkg.github.com/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
  - echo "@dfds-frontend:registry=https://npm.pkg.github.com/" >> .npmrc
```

### Issue #5: Windows Line Endings

**Error:** .npmrc appears correct but authentication still fails on Windows

**Cause:** Windows CRLF line endings vs Unix LF

**Solution:**
```bash
# Convert line endings (Git Bash on Windows)
dos2unix ~/.npmrc

# Or recreate file with Unix line endings
rm ~/.npmrc
npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend
```

---

## Additional Resources

**Official Documentation:**
- [GitHub Packages Authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [npm .npmrc Documentation](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

**DFDS Resources:**
- [dfds-frontend Packages](https://github.com/orgs/dfds-frontend/packages)
- Internal Slack: #navigator-support

**Related Skills:**
- `navigator-ui` - Using Navigator components after authentication is configured
- `github-packages` - Advanced GitHub Package Registry usage

**Quick Reference Card:**

```bash
# Create token: https://github.com/settings/tokens
# Permissions: read:packages
# SSO: Authorize dfds-internal

# Login command:
npm login --registry=https://npm.pkg.github.com/ --scope=@dfds-frontend

# Verify:
cat ~/.npmrc

# Test:
npm view @dfds-frontend/navigator-components

# Reinstall:
pnpm cache delete && rm -rf node_modules pnpm-lock.yaml && pnpm install
```

---

**Last verified**: 2026-02-02 | **Skill version**: 1.0.0 | **Prevented errors**: 5 authentication and authorization issues | **Average setup time**: 5-10 minutes