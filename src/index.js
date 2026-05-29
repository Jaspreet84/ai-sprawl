import { scorePullRequest } from "./risk/score.js";

const samplePullRequest = {
  repo: "acme/web",
  title: "Add agent-driven checkout flow",
  additions: 420,
  changedFiles: 18,
  newDependencies: 4,
  secretFindings: 0,
  permissionChanges: 1,
  duplicateCodeMatches: 2,
};

const result = scorePullRequest(samplePullRequest);

console.log("ai-sprawl");
console.log(JSON.stringify(result, null, 2));
