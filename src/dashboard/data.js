import { scorePullRequest } from "../risk/score.js";

const SAMPLE_PULL_REQUESTS = [
  {
    repo: "acme/web",
    title: "Add agent-driven checkout flow",
    additions: 420,
    changedFiles: 18,
    newDependencies: 4,
    secretFindings: 0,
    permissionChanges: 1,
    duplicateCodeMatches: 2,
  },
  {
    repo: "acme/payments",
    title: "Refactor billing retry worker",
    additions: 126,
    changedFiles: 6,
    newDependencies: 1,
    secretFindings: 0,
    permissionChanges: 0,
    duplicateCodeMatches: 1,
  },
  {
    repo: "acme/platform",
    title: "Introduce internal chatbot automation",
    additions: 68,
    changedFiles: 4,
    newDependencies: 0,
    secretFindings: 1,
    permissionChanges: 0,
    duplicateCodeMatches: 0,
  },
  {
    repo: "acme/infra",
    title: "Provision new agent runner permissions",
    additions: 52,
    changedFiles: 3,
    newDependencies: 0,
    secretFindings: 0,
    permissionChanges: 2,
    duplicateCodeMatches: 0,
  },
];

export function buildDashboardData() {
  const scoredPullRequests = SAMPLE_PULL_REQUESTS.map((pullRequest) => {
    const scored = scorePullRequest(pullRequest);
    return {
      ...pullRequest,
      ...scored,
    };
  });

  const totals = scoredPullRequests.reduce(
    (acc, item) => {
      acc.pullRequests += 1;
      acc.score += item.score;
      acc.bands[item.riskBand] += 1;
      acc.highRisk += item.riskBand === "high" || item.riskBand === "critical" ? 1 : 0;
      acc.needReview += item.score >= 55 ? 1 : 0;
      return acc;
    },
    {
      pullRequests: 0,
      score: 0,
      highRisk: 0,
      needReview: 0,
      bands: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
    }
  );

  const averageScore = Math.round(totals.score / scoredPullRequests.length);

  return {
    generatedAt: new Date().toISOString(),
    organization: "acme",
    installUrl: `https://github.com/apps/${process.env.GITHUB_APP_SLUG || "ai-sprawl"}/installations/new`,
    metrics: {
      averageScore,
      highRiskPullRequests: totals.highRisk,
      requireReview: totals.needReview,
      connectedRepos: 4,
    },
    bands: totals.bands,
    pullRequests: scoredPullRequests,
    governance: [
      {
        label: "Ownership checks",
        value: "Required on high-risk diffs",
        status: "live",
      },
      {
        label: "Secret detection",
        value: "Webhook-ready",
        status: "ready",
      },
      {
        label: "Weekly digest",
        value: "Pending design partner rollout",
        status: "planned",
      },
    ],
  };
}
