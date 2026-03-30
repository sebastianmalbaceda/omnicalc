# Security Policy

## Supported Versions

| Version | Supported         |
| ------- | ----------------- |
| 1.x.x   | ✅ Active support |
| 0.x.x   | ⚠️ Best effort    |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue,
please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email: **security@omnicalc.app** (or contact the maintainers privately)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Resolution Timeline:** Depends on severity
  - Critical: 24–72 hours
  - High: 1–2 weeks
  - Medium: 2–4 weeks
  - Low: Next release cycle

### Disclosure Policy

- We follow coordinated disclosure
- We will credit reporters (unless anonymity is requested)
- We will publish a security advisory after the fix is released

## Security Best Practices

### For Contributors

- Never commit secrets, API keys, or credentials
- Never commit `.env` files (use `.env.example` as template)
- Use parameterized queries (Prisma prevents SQL injection by default)
- Validate all user inputs with Zod schemas
- Follow the principle of least privilege for API permissions
- Keep dependencies updated (Dependabot enabled)

### Application Security

- JWT session management via Better Auth
- Stripe webhook signature verification
- RevenueCat webhook secret validation
- CORS restricted to known origins
- Rate limiting on all API endpoints
- HTTPS enforced in production
- Content Security Policy headers

---

_Thank you for helping keep OmniCalc and its users safe._
