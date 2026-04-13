# Pipeline DevSecOps

## Tema practica SAC

**6. Pipeline DevSecOps de Baza**

Configureaza un pipeline CI/CD (GitHub Actions) care include SAST, scanare dependente si scanare imagini Docker. Tenta personala: Studentul integreaza pipeline-ul pe un proiect personal sau de la facultate.

## Despre proiect

Pipeline CI/CD cu GitHub Actions care integreaza verificari de securitate
automate pe o aplicatie front-end, Portal Studenti - UPT, dezvoltata cu framework-ul Angular v.18, cu deploy automat pe Render.com
doar dupa ce toate scanarile de securitate trec cu succes.

```

PIPELINE DevSecOps — (10 etape)

  push → install ──┬── quality-gate    (ESLint + Karma + ng build)
                   ├── SAST            (Semgrep)
                   ├── SCA             (Trivy + npm)
                   └── IaC             (Trivy config)

      secrets-scan (Gitleaks) ── ruleaza independent ──┐
                                                       │
      Docker-build-scan ◄── asteapta TOATE 5 ──────────┘
                 │
      Publish + Deploy - Render (https://student-portal.onrender.com)
                 │
      DAST - OWASP ZAP

```

---

## Proiect cloud

Acest proiect demonstreaza securitatea aplicatiilor cloud pe mai multe niveluri:

1. **Pipeline-ul ruleaza in cloud** — GitHub Actions porneste containere efemere
   pe servere Microsoft Azure la fiecare push
2. **Imaginea Docker** este construita si scanata in cloud, publicata in GHCR,
   apoi deployata pe Render
3. **Supply Chain Security** — verific fiecare dependenta npm si fiecare pachet
   din imaginea Docker inainte sa ajunga in productie
4. **Secretele in cloud** — Gitleaks previne expunerea accidentala de credentiale
   in cod care e hostat public pe GitHub

---

## Shift-Left vs Shift-Right

In securitatea software traditionala, testarea se facea dupa deploy.

**DevSecOps** muta verificarile **cat mai devreme** in pipeline, aceasta abordare se numeste **Shift-Left**.

**Shift-Left** = gaseste vulnerabilitati **inainte** sa ajunga in productie (in cod, dependente, config).

**Shift-Right** = testeaza aplicatia **dupa deploy**, pe mediul live, asa cum o vede un atacator real.

```
                    COD SURSA                              PRODUCTIE
                        │                                      │
    ◄───── SHIFT-LEFT ──┼──────────── DEPLOY ──────────────────┼── SHIFT-RIGHT ────►
                        │                                      │
    Gitleaks (secrete)  │                                      │  OWASP ZAP (DAST)
    ESLint (lint+sec)   │                                      │  Monitorizare live
    Semgrep (SAST)      │     Vulnerabilitatile gasite         │
    Trivy SCA (deps)    │     aici NU ajung in productie       │  Vulnerabilitatile
    Trivy IaC (config)  │                                      │  gasite aici sunt
    Trivy Docker (img)  │                                      │  deja in productie
                        │                                      │
```

**De ce conteaza:** O vulnerabilitate gasita in cod (shift-left) costa 10x mai putin
de remediat decat una descoperita in productie (shift-right). Pipeline-ul meu
combina ambele abordari pentru acoperire completa.

## Componente de securitate

### Shift-Left

Aceste scanari ruleaza la fiecare push/PR, pe codul sursa, dependente si configurari.
Daca gasesc probleme, deploy-ul este blocat automat.

|     | Componenta | Instrument        | Ce Scaneaza                                  | Ce Gaseste                                |
| --- | ---------- | ----------------- | -------------------------------------------- | ----------------------------------------- |
| 1   | Secrete    | Gitleaks          | Tot istoricul Git + codul curent             | API keys, PAT-uri, private keys expuse    |
| 2   | SAST       | Semgrep           | Codul sursa TypeScript/Angular               | Secrets hardcodate (JWT, parole, chei)    |
| 3   | Quality    | ESLint + Karma    | Codul sursa + teste unitare                  | `eval()`, `new Function()`, bug-uri       |
| 4   | SCA        | Trivy + npm audit | `package-lock.json` + `node_modules/`        | CVE-uri in librarii npm (Angular, rxjs)   |
| 5   | IaC        | Trivy config      | `Dockerfile`, `nginx.conf`, fisiere YAML     | Misconfigurari (root user, headers lipsa) |
| 6   | Container  | Trivy image       | Imaginea Docker finala (`nginx:1.27-alpine`) | CVE-uri in pachetele OS din container     |

### Shift-Right

Aceasta scanare ruleaza pe aplicatia live deployata pe Render, simuland un atacator extern.

|     | Componenta | Instrument | Ce Scaneaza                       | Ce Gaseste                                 |
| --- | ---------- | ---------- | --------------------------------- | ------------------------------------------ |
| 7   | DAST       | OWASP ZAP  | Aplicatia live pe Render (HTTP/S) | XSS reflectat, headers lipsa, clickjacking |

### Vulnerabilitati plantate

Proiectul contine 7 vulnerabilitati intentionate distribuite in mai multe fisiere,
fiecare detectata de un scanner din pipeline:

| ID     | Tip                        | Fisier               | CWE     | Detectat de       |
| ------ | -------------------------- | -------------------- | ------- | ----------------- |
| VULN-1 | Hardcoded API Key          | `student.service.ts` | CWE-798 | Gitleaks, Semgrep |
| VULN-2 | `new Function()` pe input  | `student.service.ts` | CWE-94  | ESLint            |
| VULN-3 | `eval()` pe date externe   | `student.service.ts` | CWE-94  | ESLint            |
| VULN-4 | GitHub PAT hardcodat       | `student.service.ts` | CWE-798 | Gitleaks          |
| VULN-5 | JWT token hardcodat        | `auth.service.ts`    | CWE-798 | Semgrep           |
| VULN-6 | RSA private key hardcodata | `environment.dev.ts` | CWE-321 | Gitleaks          |
| VULN-7 | Parola admin hardcodata    | `auth.service.ts`    | CWE-798 | Semgrep           |

In plus, **Trivy** si **npm audit** detecteaza CVE-uri in dependintele npm (Angular 18, zone.js etc.).

---

## Structura proiectului

```
angular-devsecops-pipeline/
├── .github/workflows/
│   └── devsecops-pipeline.yml      ← Pipeline complet (10 etape)
├── .gitleaks.toml                  ← Configuratie secret scanning
├── nginx/
│   ├── nginx.conf
│   └── default.conf.template
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/          ← Statistici generale
│   │   │   ├── student-list/       ← Tabel studenti si note
│   │   │   ├── student-search/     ← Cautare studenti
│   │   │   ├── add-student/        ← Formular adaugare student
│   │   │   ├── login/              ← Autentificare mock (VULN-5, VULN-7)
│   │   │   └── grades-report/      ← Raport note cu filtrare
│   │   ├── models/
│   │   │   └── student.model.ts    ← Interfete Student, Note, DashboardStats
│   │   ├── services/
│   │   │   ├── student.service.ts  ← HTTP service + VULN-1, 2, 3, 4
│   │   │   └── auth.service.ts     ← Auth mock + VULN-5, VULN-7
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── index.html
│   └── main.ts
├── Dockerfile                      ← Multi-stage build: node:20-alpine → nginx:1.27-alpine
├── render.yaml                     ← Render
├── angular.json                    ← Angular CLI config
├── eslint.config.js                ← ESLint + reguli securitate (no-eval, no-new-func)
├── karma.conf.js                   ← Karma (teste unitare)
├── tsconfig.json                   ← TypeScript strict mode
└── package.json                    ← Angular 18.2, dependente npm
```

---

## GitHub

### Security → Code scanning alerts

```
Repository → Security (tab) → Code scanning
```

Apar rezultatele SARIF incarcate de pipeline:

- **Semgrep** (`sast-semgrep`) — secrets hardcodate in codul TypeScript (API key, JWT token, parola admin)
- **Trivy fs** (`sca-trivy`) — CVE-uri din dependentele npm
- **Trivy config** (`iac-trivy`) — misconfigurari in Dockerfile, nginx, YAML configs
- **Trivy image** (`docker-trivy`) — CVE-uri din pachetele imaginii Docker nginx:1.27-alpine
- **Gitleaks** (`secrets-gitleaks`) — secrete expuse (API key, GitHub PAT, RSA private key) in codul sursa si istoricul Git

Fiecare alerta arata fisierul, linia, severitatea (Critical/High/Medium/Low) si
recomandarea de remediere.

### Security → Secret scanning

```
Repository → Security (tab) → Secret scanning
```

GitHub Secret Scanning nativ detecteaza automat tokeni si chei expuse la fiecare push.

### Actions — Logs si artefacte

```
Repository → Actions → ultimul workflow run
```

- Status fiecare job (verde = succes, rosu = esec)
- Log-uri detaliate per step
- Artefacte generate: `sast-report`, `dependency-reports`, `gitleaks-report`, `iac-report`, `zap_scan`, `quality-reports`

---

## Instrumente folosite

| Instrument                                                     | Rol                                              | Cost                |
| -------------------------------------------------------------- | ------------------------------------------------ | ------------------- |
| [Semgrep CE](https://semgrep.dev)                              | SAST (p/security-audit, p/typescript, p/secrets) | Gratuit             |
| [Trivy](https://trivy.dev)                                     | SCA filesystem + IaC config + Container scanning | Gratuit             |
| [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit) | SCA npm advisory database                        | Gratuit             |
| [Gitleaks](https://gitleaks.io)                                | Secret detection (tot istoricul Git)             | Gratuit             |
| [OWASP ZAP](https://www.zaproxy.org)                           | DAST (baseline scan aplicatie live)              | Gratuit             |
| [ESLint](https://eslint.org)                                   | Linting + reguli securitate (no-eval etc.)       | Gratuit             |
| [Karma](https://karma-runner.github.io)                        | Teste unitare                                    | Gratuit             |
| [GitHub Actions](https://github.com/features/actions)          | CI/CD (10 etape automate)                        | Gratuit             |
| [GHCR](https://ghcr.io)                                        | Container Registry                               | Gratuit             |
| [Render](https://render.com)                                   | Cloud Deploy PaaS                                | Gratuit (free tier) |

---

## Licenta

Proiect educational | UPT - Master SISC | Securitatea Aplicatiilor Cloud
