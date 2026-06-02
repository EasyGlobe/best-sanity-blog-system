# Privacy Checklist

Run this checklist before publishing a release or pushing a new example.

## Must Not Appear

- Sanity API tokens
- GitHub tokens
- Cloudflare tokens
- Private keys
- Production `.env` files
- Real project IDs copied from private sites
- Analytics IDs copied from private sites
- Customer data

## Commands

```bash
npm run secret-scan
npm test
```

`npm run secret-scan` should return no matches.

## Manual Review

- Check README links for private dashboards.
- Check examples for placeholder domains.
- Check schema examples for hardcoded project IDs.
- Check commit history before making the repository public.
