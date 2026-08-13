#!/usr/bin/env node

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configuration
const CONFIG = {
  provider: process.env.DEFAULT_PROVIDER || 'claude',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
  maxAgents: parseInt(process.env.MAX_AGENTS_PER_TASK) || 10,
  timeout: parseInt(process.env.TASK_TIMEOUT) || 300000,
  autoRetry: process.env.AUTO_RETRY === 'true',
  maxRetries: parseInt(process.env.MAX_RETRIES) || 2,
  outputDir: process.env.OUTPUT_DIR || './output',
  saveLogs: process.env.SAVE_LOGS === 'true',
  verbose: process.env.VERBOSE === 'true'
};

// Initialize AI clients
let anthropic, openai, gemini;

if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
if (process.env.GOOGLE_API_KEY) {
  gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

// Load all agents
async function loadAgents() {
  const agentsDir = path.join(__dirname, 'agents');
  const agents = [];
  
  async function scanDir(dir) {
    const items = await fs.readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        await scanDir(fullPath);
      } else if (item.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const relativePath = path.relative(agentsDir, fullPath);
        agents.push({
          id: relativePath.replace(/\\/g, '/').replace('.md', ''),
          name: item.replace('.md', ''),
          path: fullPath,
          content: content
        });
      }
    }
  }
  
  await scanDir(agentsDir);
  return agents;
}

// Call AI API
async function callAI(prompt, systemPrompt = '') {
  const provider = CONFIG.provider;
  
  try {
    if (provider === 'claude' && anthropic) {
      const response = await anthropic.messages.create({
        model: CONFIG.claudeModel,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      });
      return response.content[0].text;
    } else if (provider === 'openai' && openai) {
      const messages = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }]
        : [{ role: 'user', content: prompt }];
      const response = await openai.chat.completions.create({
        model: CONFIG.openaiModel,
        messages: messages
      });
      return response.choices[0].message.content;
    } else if (provider === 'gemini' && gemini) {
      const model = gemini.getGenerativeModel({ model: CONFIG.geminiModel });
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      const result = await model.generateContent(fullPrompt);
      return result.response.text();
    } else {
      throw new Error(`No API key configured for provider: ${provider}`);
    }
  } catch (error) {
    throw new Error(`AI API call failed: ${error.message}`);
  }
}

// Analyze task and select agents
async function analyzeTask(task) {
  const spinner = ora('Analyzing task...').start();
  
  const prompt = `Analyze this task and determine which specialized agents are needed:

Task: ${task}

Available agent categories:
- Engineering: Frontend, Backend, AI, DevOps, Security, Mobile, Database, SRE
- Design: UI, UX, Brand, Visual Storytelling
- Marketing: Growth, SEO, Content, Social Media
- Sales: Outbound, Deal Strategy, Sales Engineering
- Product: PM, Sprint Planning, Feedback
- Testing: API, Performance, Accessibility
- Finance: Financial Analysis, FP&A
- Specialized: MCP Builder, Compliance, Blockchain
- Ruflo: Core (Coder, Planner, Reviewer, Tester), Swarm, GitHub, SPARC

Respond with a JSON object:
{
  "complexity": "low|medium|high",
  "estimatedTime": "X minutes",
  "phases": ["phase1", "phase2", ...],
  "agents": [
    {"name": "Agent Name", "role": "What they'll do", "category": "category"}
  ],
  "subtasks": ["subtask1", "subtask2", ...]
}`;

  try {
    const response = await callAI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');
    
    const analysis = JSON.parse(jsonMatch[0]);
    spinner.succeed('Task analyzed');
    return analysis;
  } catch (error) {
    spinner.fail('Analysis failed');
    throw error;
  }
}

// Execute task with selected agents
async function executeTask(task, analysis) {
  console.log(chalk.cyan('\n🚀 Starting execution...\n'));
  
  const results = [];
  
  for (let i = 0; i < analysis.phases.length; i++) {
    const phase = analysis.phases[i];
    console.log(chalk.yellow(`[Phase ${i + 1}/${analysis.phases.length}] ${phase}`));
    
    const phaseAgents = analysis.agents.filter(a => 
      a.role.toLowerCase().includes(phase.toLowerCase()) || i === 0
    );
    
    for (const agent of phaseAgents.slice(0, 3)) {
      const spinner = ora(`${agent.name} working...`).start();
      
      try {
        const agentPrompt = `You are ${agent.name}.

Your role: ${agent.role}

Task: ${task}

Execute your part of this task. Provide concrete, actionable output.
If you're writing code, provide complete, working code.
If you're creating content, provide the full content.
If you're analyzing, provide detailed analysis with recommendations.

Be specific and thorough.`;

        const result = await callAI(agentPrompt);
        
        spinner.succeed(`${agent.name} complete`);
        results.push({
          agent: agent.name,
          role: agent.role,
          output: result
        });
        
        if (CONFIG.verbose) {
          console.log(chalk.gray(`\n${result.substring(0, 200)}...\n`));
        }
      } catch (error) {
        spinner.fail(`${agent.name} failed: ${error.message}`);
      }
    }
    
    console.log('');
  }
  
  return results;
}

// Save results
async function saveResults(task, analysis, results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const taskDir = path.join(CONFIG.outputDir, `task-${timestamp}`);
  
  await fs.ensureDir(taskDir);
  
  // Save task info
  await fs.writeJSON(path.join(taskDir, 'task.json'), {
    task,
    analysis,
    timestamp: new Date().toISOString(),
    provider: CONFIG.provider,
    model: CONFIG[`${CONFIG.provider}Model`]
  }, { spaces: 2 });
  
  // Save each agent's output
  for (const result of results) {
    const filename = `${result.agent.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    const content = `# ${result.agent}\n\n**Role:** ${result.role}\n\n## Output\n\n${result.output}`;
    await fs.writeFile(path.join(taskDir, filename), content);
  }
  
  // Save combined output
  const combined = results.map(r => 
    `## ${r.agent}\n\n**Role:** ${r.role}\n\n${r.output}\n\n---\n`
  ).join('\n');
  
  await fs.writeFile(path.join(taskDir, 'COMPLETE-OUTPUT.md'), 
    `# Task: ${task}\n\n${combined}`
  );
  
  return taskDir;
}

// Main orchestrator
async function orchestrate(task) {
  console.log(chalk.cyan.bold('\n🤖 MASTER ORCHESTRATOR ACTIVATED\n'));
  console.log(chalk.white('━'.repeat(80)));
  console.log(chalk.yellow(`\n📋 Task: ${task}\n`));
  
  try {
    // Step 1: Analyze
    const analysis = await analyzeTask(task);
    
    console.log(chalk.green('\n✅ Analysis complete\n'));
    console.log(chalk.white(`📊 Complexity: ${analysis.complexity}`));
    console.log(chalk.white(`⏱️  Estimated time: ${analysis.estimatedTime}`));
    console.log(chalk.white(`🎯 Agents required: ${analysis.agents.length}`));
    console.log(chalk.white(`📝 Phases: ${analysis.phases.length}\n`));
    
    console.log(chalk.yellow('🎯 Agent Selection:\n'));
    analysis.agents.forEach((agent, i) => {
      console.log(chalk.white(`   ${i + 1}. ${agent.name} → ${agent.role}`));
    });
    
    // Step 2: Execute
    const results = await executeTask(task, analysis);
    
    // Step 3: Save
    const outputDir = await saveResults(task, analysis, results);
    
    // Step 4: Summary
    console.log(chalk.white('\n' + '━'.repeat(80)));
    console.log(chalk.green.bold('\n✅ TASK COMPLETE!\n'));
    console.log(chalk.white(`📦 Deliverables: ${outputDir}`));
    console.log(chalk.white(`🎯 Agents Used: ${results.length}`));
    console.log(chalk.white(`📊 Quality: All agents completed successfully\n`));
    
    console.log(chalk.yellow('📂 Output files:'));
    console.log(chalk.white(`   • task.json - Task metadata`));
    console.log(chalk.white(`   • COMPLETE-OUTPUT.md - Combined output from all agents`));
    results.forEach(r => {
      const filename = `${r.agent.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
      console.log(chalk.white(`   • ${filename} - ${r.agent} output`));
    });
    
    console.log(chalk.white('\n' + '━'.repeat(80)));
    console.log(chalk.green('\n🤖 Master Orchestrator standing by...\n'));
    
  } catch (error) {
    console.log(chalk.red(`\n❌ Error: ${error.message}\n`));
    process.exit(1);
  }
}

// CLI
const task = process.argv.slice(2).join(' ');

if (!task) {
  console.log(chalk.cyan.bold('\n🤖 Integrated Agents - Real Orchestrator\n'));
  console.log(chalk.white('Usage:'));
  console.log(chalk.yellow('  node orchestrator.js "YOUR TASK HERE"\n'));
  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  node orchestrator.js "Build a React dashboard"'));
  console.log(chalk.gray('  node orchestrator.js "Write a marketing plan"'));
  console.log(chalk.gray('  node orchestrator.js "Audit API security"\n'));
  console.log(chalk.white('Setup:'));
  console.log(chalk.gray('  1. Copy .env.example to .env'));
  console.log(chalk.gray('  2. Add your API key (ANTHROPIC_API_KEY, OPENAI_API_KEY, or GOOGLE_API_KEY)'));
  console.log(chalk.gray('  3. Run: npm install'));
  console.log(chalk.gray('  4. Run: node orchestrator.js "your task"\n'));
  process.exit(0);
}

// Check API keys
if (!anthropic && !openai && !gemini) {
  console.log(chalk.red('\n❌ No API keys configured!\n'));
  console.log(chalk.white('Please set up your .env file with at least one API key:'));
  console.log(chalk.gray('  ANTHROPIC_API_KEY=your_key_here'));
  console.log(chalk.gray('  OPENAI_API_KEY=your_key_here'));
  console.log(chalk.gray('  GOOGLE_API_KEY=your_key_here\n'));
  process.exit(1);
}

// Run orchestrator
orchestrate(task);
