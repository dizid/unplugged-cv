# Deployment Checklist

## Pre-Deploy (Netlify Setup)

- [ ] Go to [app.netlify.com/start](https://app.netlify.com/start)
- [ ] Import from GitHub → Select `dizid/unplugged-cv`
- [ ] Verify build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`
- [ ] Add environment variables in Netlify dashboard:
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `DATABASE_URL` (Neon connection string)
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET` (update after creating production webhook)
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `NEXT_PUBLIC_APP_URL` (set to your Netlify URL)
- [ ] Deploy

## Post-Deploy

### 1. Neon Auth Configuration

After getting your Netlify URL (e.g., `https://your-site.netlify.app`):

- [ ] Go to [Neon Console](https://console.neon.tech)
- [ ] Select project → **Auth** tab
- [ ] Update **Redirect URLs** to include your production domain

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
- [ ] Test login/signup with Neon Auth
- [ ] Paste sample career info and generate CV
- [ ] Test Stripe checkout (use [test cards](https://stripe.com/docs/testing#cards))
- [ ] Verify webhook receives payment confirmation

## Your URLs

| Service | URL |
|---------|-----|
| Live Site | `https://unplugged.cv` |
| Netlify Dashboard | `https://app.netlify.com/sites/unplugged-cv` |
| Neon Console | `https://console.neon.tech` |
| Stripe Dashboard | `https://dashboard.stripe.com` |
| GitHub Repo | `https://github.com/dizid/unplugged-cv` |
