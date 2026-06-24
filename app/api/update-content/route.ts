import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password, data, checkOnly } = body

    // Check admin password
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Just checking password, no save needed
    if (checkOnly) {
      return NextResponse.json({ success: true })
    }

    // GitHub API config from env vars
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_OWNER = process.env.GITHUB_OWNER
    const GITHUB_REPO = process.env.GITHUB_REPO
    const FILE_PATH = 'content/data.json'

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return NextResponse.json({ error: 'GitHub config missing in environment variables' }, { status: 500 })
    }

    // Get current file SHA (required for update)
    const getRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )

    const getJson = await getRes.json()
    const sha = getJson.sha

    // Update the file
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')

    const updateRes = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update portfolio content via admin panel',
          content,
          sha,
        }),
      }
    )

    if (!updateRes.ok) {
      const err = await updateRes.json()
      return NextResponse.json({ error: 'GitHub update failed', details: err }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Content updated! Vercel will redeploy in ~30s.' })
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: String(err) }, { status: 500 })
  }
}
