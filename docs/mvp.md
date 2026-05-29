# MVP

## Wedge

Build a GitHub app that scores pull requests for sprawl and security risk.

## Core signals

- large code additions
- copy-paste similarity
- new dependencies
- secrets
- policy violations
- suspicious permission changes

## Workflow

1. Connect a GitHub org
2. Scan pull requests
3. Show a risk score with reasons
4. Require lightweight human ownership on high-risk changes
5. Send a weekly summary of the noisiest repos and riskiest patterns

## Non-goals

- perfect AI-authorship detection
- replacing existing SAST tools
- endpoint inventory
- deep enterprise workflow orchestration

## Success criteria

- teams trust the alerts
- teams use it in their review flow
- teams are willing to keep it on after a pilot
