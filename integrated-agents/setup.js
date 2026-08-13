#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import chalk from 'chalk';

console.log(chalk.cyan.bold('\n🤖 Integrated Agents Setup\n'));

const questions = [
  {
    type: 'list',
    name: 'provider',
    message: 'Which AI provider do you want to use?',
    choices: [
      { name: 'Claude (Anthropic) - Recommended', value: 'claude' },
      { name: 'OpenAI (GPT-4)', value: 'openai' },
      { name: 'Google (Gemini)', value: 'gemini' }
    ]
  },
  {
    type: 'password',
    name: 'apiKey',
    message: (answers) => `Enter your ${answers.provider === 'claude' ? 'Anthropic' : answers.provider === 'openai' ? 'OpenAI' : 'Google'} API key:`,
    validate: (input) => input.length > 0 || 'API key is required'
  },
  {
    type: 'confirm',
    name: 'saveOutput',
    message: 'Save task outputs to files?',
    default: true
  },
  {
    type: 'confirm',
    name: 'verbose',
    message: 'Enable verbose logging?',
    default: false
  }
];

inquirer.prompt(questions).then(async (answers) => {
  const envContent = `# AI Provider Configuration
DEFAULT_PROVIDER=${answers.provider}

# API Keys
${answers.provider === 'claude' ? `ANTHROPIC_API_KEY=${answers.apiKey}` : '# ANTHROPIC_API_KEY='}
${answers.provider === 'openai' ? `OPENAI_API_KEY=${answers.apiKey}` : '# OPENAI_API_KEY='}
${answers.provider === 'gemini' ? `GOOGLE_API_KEY=${answers.apiKey}` : '# GOOGLE_API_KEY='}

# Model Selection
CLAUDE_MODEL=claude-sonnet-4-20250514
OPENAI_MODEL=gpt-4
GEMINI_MODEL=gemini-2.0-flash-exp

# Orchestrator Settings
MAX_AGENTS_PER_TASK=10
TASK_TIMEOUT=300000
AUTO_RETRY=true
MAX_RETRIES=2

# Output Settings
OUTPUT_DIR=./output
SAVE_LOGS=${answers.saveOutput}
VERBOSE=${answers.verbose}
`;

  await fs.writeFile('.env', envContent);
  await fs.ensureDir('output');
  
  console.log(chalk.green('\n✅ Setup complete!\n'));
  console.log(chalk.white('Configuration saved to .env'));
  console.log(chalk.white('Output directory created: ./output\n'));
  console.log(chalk.yellow('Next steps:'));
  console.log(chalk.gray('  1. Run: npm install'));
  console.log(chalk.gray('  2. Run: node orchestrator.js "your task here"\n'));
});
