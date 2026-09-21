# DevSecOps Pipeline

**Cloud Application Security**
Student project developed for the Cloud Application Security course of the Master's programme.

## Practical assignment

**Basic DevSecOps Pipeline**

Configure a CI/CD pipeline (GitHub Actions) that includes SAST, dependency scanning and Docker image scanning.<br>
Personal touch: The student integrates the pipeline into a personal project.

---

## About the project

I configured a CI/CD pipeline with GitHub Actions that integrates automated security checks on a front-end application, a Student Portal - UPT, built with the Angular v.18 framework, with automatic deployment to Render.com after all security scans pass successfully.

```

DevSecOps PIPELINE — GitHub Actions (10 stages)

  push → install ──┬── quality-gate    (ESLint + Karma + ng build)
                   ├── SAST            (Semgrep)
                   ├── SCA             (Trivy + npm)
                   └── IaC             (Trivy config)

         secrets-scan (Gitleaks) ── runs independently ────┐
                                                           │
         Docker-build-scan ◄── waits for ALL 5 ────────────┘
            │         │
         Publish   Deploy - Render
                      │
                   DAST - OWASP ZAP

```

**Secret scanning** - Gitleaks scans the entire Git history to catch passwords or API keys committed by accident.

**Quality Gate** - ESLint, Karma and ng build check that the code meets quality standards, the tests pass and the application compiles correctly before any other stage.

**SAST - Static Application Security Testing** - Semgrep, which analyzes the source code without running it and looks for known vulnerability patterns, such as eval, XSS or injection.

**SCA - Software Composition Analysis or dependency scanning** I used two tools: Trivy and npm audit, which check whether the libraries I use have known vulnerabilities, i.e. CVEs.

**IaC** - Infrastructure as Code - Trivy scans the infrastructure configuration files to detect misconfigurations that could expose the system to attacks.

**Docker** is the technology that packages the application into a single portable image. After building the image, I scan it with Trivy. Trivy checks all the packages in the image's operating system and tells me whether any of them has known vulnerabilities.

**DAST - Dynamic Application Security Testing** - Tests the application while it is running, attacking it from the outside like a real hacker, without looking at the source code.

---

## Cloud project

This project demonstrates cloud application security on multiple levels:

1. **The pipeline runs in the cloud** — GitHub Actions spins up containers on Microsoft Azure servers on every push
2. **The Docker image** is built and scanned in the cloud, then deployed to Render
3. **Supply Chain Security** — I check every npm dependency and every package in the Docker image before it reaches production
4. **Secrets in the cloud** — Gitleaks prevents accidental exposure of credentials in code that is publicly hosted on GitHub

---

## Shift-Left vs Shift-Right

In traditional software security, testing was done after deployment. **DevSecOps** moves the checks **as early as possible** in the pipeline; this approach is called **Shift-Left**.

The two important concepts are:<br>
**Shift-Left** = find vulnerabilities **before** they reach production (in code, dependencies, configurations).<br>
**Shift-Right** = test the application **after deployment**, on the live environment, the way a real attacker sees it.

```
                    SOURCE CODE                            PRODUCTION
                        │                                      │
    ◄───── SHIFT-LEFT ──┼──────────── DEPLOY ──────────────────┼── SHIFT-RIGHT ────►
                        │                                      │
    Gitleaks (secrets)  │                                      │  OWASP ZAP (DAST)
    ESLint (lint+sec)   │                                      │  Live monitoring
    Semgrep (SAST)      │     Vulnerabilities found            │
    Trivy SCA (deps)    │     here do NOT reach production     │  Vulnerabilities
    Trivy IaC (config)  │                                      │  found here are
    Trivy Docker (img)  │                                      │  already in production
                        │                                      │
```

**Why it matters:** A vulnerability found in code (shift-left) costs 10x less
to fix than one discovered in production (shift-right). My pipeline
combines both approaches for complete coverage.

## Security components

### Shift-Left

These scans run on every push/PR, on the source code, dependencies and configurations.

|     | Component | Tool              | What it scans                            | What it finds                                  |
| --- | --------- | ----------------- | ---------------------------------------- | ---------------------------------------------- |
| 1   | Secrets   | Gitleaks          | Entire Git history + current code        | Exposed API keys, PATs, private keys           |
| 2   | SAST      | Semgrep           | TypeScript/Angular source code           | Hardcoded secrets (JWT, passwords, keys)       |
| 3   | Quality   | ESLint + Karma    | Source code + unit tests                 | `eval()`, `new Function()`, bugs               |
| 4   | SCA       | Trivy + npm audit | `package-lock.json` + `node_modules/`    | CVEs in npm libraries (Angular, rxjs)          |
| 5   | IaC       | Trivy config      | `Dockerfile`, `nginx.conf`, YAML files   | Misconfigurations (root user, missing headers) |
| 6   | Container | Trivy image       | Final Docker image (`nginx:1.27-alpine`) | CVEs in the container's OS packages            |

### Shift-Right

This scan runs against the live application deployed on Render, simulating an external attacker.

|     | Component | Tool      | What it scans                       | What it finds                            |
| --- | --------- | --------- | ----------------------------------- | ---------------------------------------- |
| 7   | DAST      | OWASP ZAP | Live application on Render (HTTP/S) | XSS - Cross-Site Scripting, clickjacking |

### Planted vulnerabilities

The project contains 7 intentional vulnerabilities spread across several files,
each detected by a scanner in the pipeline:

| ID     | Type                      | File                 | CWE     | Detected by       |
| ------ | ------------------------- | -------------------- | ------- | ----------------- |
| VULN-1 | Hardcoded API Key         | `student.service.ts` | CWE-798 | Gitleaks, Semgrep |
| VULN-2 | `new Function()` on input | `student.service.ts` | CWE-94  | ESLint            |
| VULN-3 | `eval()` on external data | `student.service.ts` | CWE-94  | ESLint            |
| VULN-4 | Hardcoded GitHub PA Token | `student.service.ts` | CWE-798 | Gitleaks          |
| VULN-5 | Hardcoded JWT token       | `auth.service.ts`    | CWE-798 | Semgrep           |
| VULN-6 | Hardcoded RSA private key | `environment.dev.ts` | CWE-321 | Gitleaks          |
| VULN-7 | Hardcoded admin password  | `auth.service.ts`    | CWE-798 | Semgrep           |

---

## Project structure

```
devsecops-pipeline/
├── .github/workflows/
│   └── devsecops-pipeline.yml      ← Full pipeline (10 stages)
├── .gitleaks.toml                  ← Secret scanning configuration
├── nginx/
│   ├── nginx.conf
│   ├── default.conf
│   └── default.conf.template
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/          ← General statistics
│   │   │   ├── student-list/       ← Students and grades table
│   │   │   ├── student-search/     ← Student search
│   │   │   ├── add-student/        ← Add student form
│   │   │   ├── login/              ← Mock authentication (uses VULN-5, VULN-7)
│   │   │   └── grades-report/      ← Grades report with filtering
│   │   ├── models/
│   │   │   └── student.model.ts    ← Student, Grade, DashboardStats interfaces
│   │   ├── services/
│   │   │   ├── student.service.ts  ← HTTP service + VULN-1, 2, 3, 4
│   │   │   └── auth.service.ts     ← Mock auth + VULN-5, VULN-7
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.dev.ts      ← VULN-6 (hardcoded RSA private key)
│   │   └── environment.prod.ts
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── Dockerfile                      ← Multi-stage build: node:20-alpine → nginx:1.27-alpine
├── render.yaml                     ← Render
├── angular.json                    ← Angular CLI config
├── eslint.config.js                ← ESLint + security rules (no-eval, no-new-func)
├── karma.conf.js                   ← Karma (unit tests)
├── tsconfig.json                   ← TypeScript strict mode
├── SECURITY.md                     ← Security policy + tool inventory
└── package.json                    ← Angular 18.2, npm dependencies
```

---

## GitHub

### Security

```
Repository → Security and quality
```

The SARIF results uploaded by the pipeline appear here:

- **Semgrep** (`sast-semgrep`) — hardcoded secrets in the TypeScript code (API key, JWT token, admin password)
- **Trivy filesystem scan** (`sca-trivy`) — CVEs in npm dependencies
- **Trivy config** (`iac-trivy`) — misconfigurations in Dockerfile, nginx, YAML configs
- **Trivy image** (`docker-trivy`) — CVEs in the packages of the nginx:1.27-alpine Docker image
- **Gitleaks** (`secrets-gitleaks`) — exposed secrets (API key, GitHub PAT, RSA private key) in the source code and Git history

Each alert shows the file, the line, the severity (Critical/High/Medium/Low) and
the remediation recommendation.

### Actions

```
Repository → Actions
```

- Status of each job (green = success, red = failure)
- Detailed logs per step
- Generated artifacts:<br>
  `sast-report`, `dependency-reports`, `gitleaks-report`, `iac-report`, `dast-report`, `quality-reports`

### Issues

```
Repository → Issues
```

For each relevant vulnerability detected by the tools (Semgrep, Gitleaks, Trivy, etc.) a remediation issue is created manually, linked to the corresponding finding in the Security tab.

The issue contains the problem description, the severity, the affected file and line, plus the remediation steps. It can be assigned to an owner and tracked until it is resolved.

---

## Tools used

| Tool                                                           | Role                                             | Cost |
| -------------------------------------------------------------- | ------------------------------------------------ | ---- |
| [Semgrep CE](https://semgrep.dev)                              | SAST (p/security-audit, p/typescript, p/secrets) | Free |
| [Trivy](https://trivy.dev)                                     | SCA filesystem + IaC config + Container scanning | Free |
| [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) | SCA npm advisory database                        | Free |
| [Gitleaks](https://gitleaks.io)                                | Secret detection (entire Git history)            | Free |
| [OWASP ZAP](https://www.zaproxy.org)                           | DAST (baseline scan of the live application)     | Free |
| [ESLint](https://eslint.org)                                   | Linting + security rules (no-eval etc.)          | Free |
| [Karma](https://karma-runner.github.io)                        | Unit tests                                       | Free |
| [GitHub Actions](https://github.com/features/actions)          | CI/CD (10 automated stages)                      | Free |
| [Render](https://render.com)                                   | Cloud Deploy PaaS                                | Free |
