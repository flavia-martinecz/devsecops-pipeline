# Security Policy

## Supported versions

| Version  | Supported |
| -------- | --------- |
| 1.x      | Yes       |

## Reporting vulnerabilities

If you discover a vulnerability in the code, open a **GitHub Issue** with the `security` label.

## Active security tools

This repository has the following automated security mechanisms,
integrated into the CI/CD pipeline (GitHub Actions):

### Shift-Left

| Tool              | Scan type   | What it detects                                  | Frequency          |
| ----------------- | ----------- | ------------------------------------------------ | ------------------ |
| **ESLint**        | Linting     | `eval()`, `new Function()`, `no-script-url`      | On every push/PR   |
| **Karma/Jasmine** | Tests       | Functional regressions (29 unit tests, Chrome)   | On every push/PR   |
| **Semgrep**       | SAST        | Hardcoded secrets, XSS, injection in TS code     | On every push/PR   |
| **Trivy fs**      | SCA         | CVEs in npm dependencies (package-lock.json)     | On every push/PR   |
| **npm audit**     | SCA         | npm advisory database (HIGH+ severity)           | On every push/PR   |
| **Gitleaks**      | Secrets     | API keys, PATs, private keys in the Git history  | On every push/PR   |
| **Trivy config**  | IaC         | Dockerfile and YAML misconfigurations            | On every push/PR   |
| **Trivy image**   | Container   | CVEs in the Docker image (nginx:1.27-alpine)     | On every push/PR   |

### Shift-Right

| Tool          | Scan type   | What it detects                              | Frequency               |
| ------------- | ----------- | -------------------------------------------- | ----------------------- |
| **OWASP ZAP** | DAST        | Missing/misconfigured headers, CSP, cookies  | After deploy to Render  |

### Intentional vulnerabilities

The project contains 7 planted vulnerabilities to demonstrate scanner detection:

| ID     | Type                        | File                 | CWE     | Detected by       |
| ------ | --------------------------- | -------------------- | ------- | ----------------- |
| VULN-1 | Hardcoded API Key           | `student.service.ts` | CWE-798 | Gitleaks, Semgrep |
| VULN-2 | `new Function()` on input   | `student.service.ts` | CWE-94  | ESLint            |
| VULN-3 | `eval()` on external data   | `student.service.ts` | CWE-94  | ESLint, Semgrep   |
| VULN-4 | Hardcoded GitHub PAT        | `student.service.ts` | CWE-798 | Gitleaks          |
| VULN-5 | Hardcoded JWT token         | `auth.service.ts`    | CWE-798 | Semgrep           |
| VULN-6 | Hardcoded RSA private key   | `environment.dev.ts` | CWE-321 | Gitleaks          |
| VULN-7 | Hardcoded admin password    | `auth.service.ts`    | CWE-798 | Semgrep           |
