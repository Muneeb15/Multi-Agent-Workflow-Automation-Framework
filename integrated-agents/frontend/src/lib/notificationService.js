const EMAIL_STORAGE_KEY = 'integrated-agents.notificationEmail'

export function getStoredNotificationEmail() {
  if (typeof window === 'undefined') return ''

  try {
    return window.localStorage.getItem(EMAIL_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function storeNotificationEmail(email) {
  if (typeof window === 'undefined') return

  try {
    if (email.trim()) {
      window.localStorage.setItem(EMAIL_STORAGE_KEY, email.trim())
    } else {
      window.localStorage.removeItem(EMAIL_STORAGE_KEY)
    }
  } catch {
    // Storage can be unavailable in embedded preview contexts.
  }
}

export function getBrowserNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return window.Notification.permission
}

export async function requestBrowserNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  if (window.Notification.permission !== 'default') return window.Notification.permission

  try {
    return await window.Notification.requestPermission()
  } catch {
    return window.Notification.permission
  }
}

export function createTaskCompletionNotice({ task, agent, run, email }) {
  const cleanEmail = email.trim()
  const completedAt = new Date()
  const subject = `${agent.name} completed: ${task.slice(0, 72)}`
  const body = [
    `${agent.name} completed your task.`,
    '',
    `Task: ${task}`,
    `Run: ${run.title}`,
    `Status: ${run.status}`,
    `Progress: ${run.progress}%`,
    '',
    `Selected team: ${run.agentNetwork?.selectedTeam.map((member) => member.name).join(', ') || agent.name}`,
    '',
    'Open the AI Agent Platform chat to review the full output, acceptance checks, files, and execution command.',
  ].join('\n')

  return {
    id: `notice-${completedAt.getTime()}`,
    title: `${agent.name} completed the task`,
    message: `Finished "${task.slice(0, 92)}${task.length > 92 ? '...' : ''}" with ${run.progress}% progress.`,
    task,
    agentName: agent.name,
    agentInitials: agent.initials,
    createdAt: completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    email: cleanEmail,
    emailStatus: cleanEmail ? 'Email payload ready for backend delivery.' : 'Add an email to prepare completion delivery.',
    emailPayload: cleanEmail
      ? {
          to: cleanEmail,
          subject,
          body,
        }
      : null,
  }
}

export function sendBrowserCompletionNotification(notice) {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (window.Notification.permission !== 'granted') return false

  try {
    new window.Notification(notice.title, {
      body: notice.message,
      tag: notice.id,
    })
    return true
  } catch {
    return false
  }
}
