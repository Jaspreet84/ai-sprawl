const SIGNAL_WEIGHTS = {
  additions: 1,
  changedFiles: 2,
  newDependencies: 8,
  secretFindings: 25,
  permissionChanges: 10,
  duplicateCodeMatches: 6,
};

export function scorePullRequest(pr) {
  const reasons = [];
  let score = 0;

  for (const [key, weight] of Object.entries(SIGNAL_WEIGHTS)) {
    const value = Number(pr[key] ?? 0);
    if (value <= 0) continue;

    const contribution = Math.min(value * weight, 40);
    score += contribution;
    reasons.push({
      signal: key,
      value,
      contribution,
    });
  }

  const normalizedScore = Math.min(Math.round(score), 100);

  return {
    repo: pr.repo,
    title: pr.title,
    score: normalizedScore,
    riskBand: bandForScore(normalizedScore),
    reasons,
    recommendation: recommendationForScore(normalizedScore),
  };
}

function bandForScore(score) {
  if (score >= 80) return "critical";
  if (score >= 55) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function recommendationForScore(score) {
  if (score >= 80) return "block merge until reviewed";
  if (score >= 55) return "require ownership check";
  if (score >= 25) return "surface for human review";
  return "no action needed";
}
