export async function runLocalTask({ task, agent, mode, attachments, email }) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task,
      agent,
      mode,
      attachments,
      email,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Local agent runner failed.')
  }

  return payload
}

export function createOfflineRunnerResult(error) {
  return {
    status: 'offline',
    error: error.message || 'Local agent runner is not available.',
    log: [
      'The frontend completed the planning run.',
      'The local code-writing worker did not respond.',
      'Start the full system with npm run dev:full to let agents write project files.',
    ],
    commands: ['npm run dev:full'],
    files: [],
  }
}
