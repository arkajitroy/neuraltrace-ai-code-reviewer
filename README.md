# Neuraltrace AI Code Reviewer

It is an intellegentm, AI powered code review platform that automatically analysis github PR (Pull Request) and provides context-aware feedback. It combines mordern web technologies with advance AI capabilities to deliver a premium developer experience.

---

### 📌 Features

1. Automated AI Review : Instant, intellegent code analysis google's gemini AI
2. Context Aware : Uses RAG to understand your codebase
3. Github Integrations: Integrations with github webhooks and api's
4. Tiered Pricing: Free and Pro plans with usage based limits
5. Real Time dashboard: Track Reviews, Repositories and contributions

---

### Starting the project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Github Actions and there workings

1. Authentication check
2. Fetch github username
3. Fetch github commits
   - Gets your contribution calendar
   - counts how many commits you have made each month
4. Fetch Code Reviews
   - Grouping by 6 months
5. Fetch PR
   - All PRS in last 6 months
   - Counts how many PRs has been raised each months

Incorporated Webhooks to connect the repositories with the dashboard
