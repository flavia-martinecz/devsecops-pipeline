# Security Policy

## Versiuni suportate

| Versiune | Suportata |
| -------- | --------- |
| 1.x      | Da        |

## Raportare vulnerabilitati

Daca descoperi o vulnerabilitate in cod, deschide un **GitHub Issue** cu eticheta `security`.

## Instrumente de securitate active

Acest repository are urmatoarele mecanisme de securitate automate,
integrate in pipeline-ul CI/CD (GitHub Actions):

### Shift-Left

| Instrument        | Tip scanare | Ce detecteaza                                    | Frecventa          |
| ----------------- | ----------- | ------------------------------------------------ | ------------------ |
| **ESLint**        | Linting     | `eval()`, `new Function()`, `no-script-url`      | La fiecare push/PR |
| **Karma/Jasmine** | Teste       | Regresii functionale (29 teste unitare, Chrome)  | La fiecare push/PR |
| **Semgrep**       | SAST        | Secrets hardcodate, XSS, injection in cod TS     | La fiecare push/PR |
| **Trivy fs**      | SCA         | CVE-uri in dependente npm (package-lock.json)    | La fiecare push/PR |
| **npm audit**     | SCA         | Advisory database npm (severitate HIGH+)         | La fiecare push/PR |
| **Gitleaks**      | Secrete     | API keys, PAT-uri, private keys in istoricul Git | La fiecare push/PR |
| **Trivy config**  | IaC         | Misconfigurari Dockerfile, nginx, YAML           | La fiecare push/PR |
| **Trivy image**   | Container   | CVE-uri in imaginea Docker (nginx:1.27-alpine)   | La fiecare push/PR |

### Shift-Right

| Instrument    | Tip scanare | Ce detecteaza                              | Frecventa             |
| ------------- | ----------- | ------------------------------------------ | --------------------- |
| **OWASP ZAP** | DAST        | XSS reflectat, headers lipsa, clickjacking | Dupa deploy pe Render |

### Vulnerabilitati intentionate

Proiectul contine 7 vulnerabilitati plantate pentru a demonstra detectia scannerelor:

| ID     | Tip                        | Fisier               | CWE     | Detectat de       |
| ------ | -------------------------- | -------------------- | ------- | ----------------- |
| VULN-1 | Hardcoded API Key          | `student.service.ts` | CWE-798 | Gitleaks, Semgrep |
| VULN-2 | `new Function()` pe input  | `student.service.ts` | CWE-94  | ESLint            |
| VULN-3 | `eval()` pe date externe   | `student.service.ts` | CWE-94  | ESLint            |
| VULN-4 | GitHub PAT hardcodat       | `student.service.ts` | CWE-798 | Gitleaks          |
| VULN-5 | JWT token hardcodat        | `auth.service.ts`    | CWE-798 | Semgrep           |
| VULN-6 | RSA private key hardcodata | `environment.dev.ts` | CWE-321 | Gitleaks          |
| VULN-7 | Parola admin hardcodata    | `auth.service.ts`    | CWE-798 | Semgrep           |
