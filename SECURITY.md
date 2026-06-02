# Security

Do not commit secrets to this repository.

If you find a leaked token, private key, customer data, or project-specific credential, rotate the credential immediately and open a private security report with the repository maintainers.

Recommended checks before every release:

```bash
npm run secret-scan
npm test
```
