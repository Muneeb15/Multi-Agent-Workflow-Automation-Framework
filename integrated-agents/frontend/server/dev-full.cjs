const { spawn } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function start(name, command, args) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`)
    }
  })

  return child
}

const worker = start('agent-runner', 'node', [path.join(root, 'server', 'agent-runner.cjs')])
const vite = start('vite', npmCommand, ['run', 'dev'])

function shutdown() {
  worker.kill()
  vite.kill()
}

process.on('SIGINT', () => {
  shutdown()
  process.exit(0)
})

process.on('SIGTERM', () => {
  shutdown()
  process.exit(0)
})
