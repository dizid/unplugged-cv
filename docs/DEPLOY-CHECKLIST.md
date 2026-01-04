# Deployment Checklist

## Pre-Deploy (Netlify Setup)

- [ ] Go to [app.netlify.com/start](https://app.netlify.com/start)
- [ ] Import from GitHub → Select `dizid/unplugged-cv`
- [ ] Verify build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`
- [ ] Add environment variables in Netlify dashboard:
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET` (update after creating production webhook)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL` (set to your Netlify URL)
- [ ] Deploy

## Post-Deploy

### 1. Supabase Auth Configuration

After getting your Netlify URL (e.g., `https://your-site.netlify.app`):

- [ ] Go to [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Select project → **Authentication** → **URL Configuration**
- [ ] Set **Site URL** to: `https://your-site.netlify.app`
- [ ] Add to **Redirect URLs**: `https://your-site.netlify.app/**`

### 2. Stripe Webhook (Production)

- [ ] Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- [ ] Click **Add endpoint**
- [ ] Set endpoint URL: `https://your-site.netlify.app/api/webhook`
- [ ] Select event: `checkout.session.completed`
- [ ] Create endpoint
- [ ] Copy the new **Signing secret** (`whsec_...`)
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Netlify env vars with new secret
- [ ] Redeploy (Netlify → Deploys → Trigger deploy)

### 3. Test the Flow

- [ ] Visit your live site
- [ ] Test login/signup
- [ ] Paste sample career info and generate CV
- [ ] Test Stripe checkout (use [test cards](https://stripe.com/docs/testing#cards))
- [ ] Verify webhook receives payment confirmation

## Your URLs

| Service | URL |
|---------|-----|
| Live Site | `https://_____.netlify.app` |
| Netlify Dashboard | `https://app.netlify.com/sites/_____` |
| Supabase Dashboard | `https://supabase.com/dashboard/project/aajllpghqmeulnvlruaj` |
| Stripe Dashboard | `https://dashboard.stripe.com` |
| GitHub Repo | `https://github.com/dizid/unplugged-cv` |
