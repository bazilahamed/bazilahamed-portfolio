# Ahamed Bazil — Portfolio

A dark, cyberpunk-aesthetic portfolio with a built-in Admin CMS that updates content live via GitHub.

## 🚀 Quick Deploy

1. **Push to GitHub**: Upload this folder to your GitHub repo
2. **Connect Vercel**: Import repo at vercel.com
3. **Add Environment Variables** in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `ADMIN_PASSWORD` | Your chosen admin password |
| `GITHUB_TOKEN` | GitHub Personal Access Token (repo scope) |
| `GITHUB_OWNER` | Your GitHub username |
| `GITHUB_REPO` | Your repository name |

4. **Deploy** — your site goes live at your domain!

## 🔑 Admin Panel

Visit `ahamedbazil.com/admin` to:
- Edit hero text, bio, contact info
- Add/remove/edit skills with icons and tech tags
- Update job experience and achievements
- Manage certifications with categories

Clicking **SAVE & DEPLOY** pushes changes to GitHub → Vercel auto-redeploys in ~30s.

## 🔐 GitHub Token Setup

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Give it a name like "portfolio-cms"
4. Check the **repo** scope (or `public_repo` if your repo is public)
5. Copy the token and add to Vercel env vars

## 📁 Content

All content lives in `content/data.json`. You can edit this directly in GitHub or via the admin panel.

## 🎨 Design

- Typography: Syne (display) + IBM Plex Mono (code) + Outfit (body)
- Color: Void black + acid green + deep navy
- Custom cursor, glitch text effects, terminal animation
- Scanline overlay for that cyberpunk CRT feel

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
