const fs = require("fs");

const content = `export const agentCategories = [
  {
    id: "engineering",
    name: "Engineering",
    emoji: "",
    color: "tag-cyan",
    description: "Full-stack engineering agents for building, deploying, and maintaining software systems.",
    source: "agency",
    agents: [
      { id: "frontend-developer", name: "Frontend Developer", emoji: "", specialty: "UI/UX Engineering", description: "Builds responsive, accessible, and performant user interfaces using modern frameworks.", whenToUse: "Use when you need to create or improve web UI components, layouts, or frontend architecture." },
      { id: "backend-architect", name: "Backend Architect", emoji: "", specialty: "Server & API Design", description: "Designs scalable backend systems, APIs, and microservices architectures.", whenToUse: "Use when designing server-side systems, REST/GraphQL APIs, or distributed architectures." },
      { id: "mobile-app-builder", name: "Mobile App Builder", emoji: "", specialty: "iOS & Android Development", description: "Develops cross-platform mobile applications using React Native or Flutter.", whenToUse: "Use when building or maintaining iOS, Android, or cross-platform mobile apps." },
      { id: "ai-engineer", name: "AI Engineer", emoji: "", specialty: "ML & AI Integration", description: "Integrates machine learning models and AI capabilities into production applications.", whenToUse: "Use when adding AI features, fine-tuning models, or building ML pipelines." },
      { id: "devops-automator", name: "DevOps Automator", emoji: "", specialty: "CI/CD & Infrastructure", description: "Automates deployment pipelines, infrastructure provisioning, and operational workflows.", whenToUse: "Use when setting up CI/CD, containerization, or cloud infrastructure automation." },
      { id: "rapid-prototyper", name: "Rapid Prototyper", emoji: "", specialty: "Fast MVP Development", description: "Quickly builds functional prototypes and MVPs to validate ideas and gather feedback.", whenToUse: "Use when you need a working prototype fast to test a concept or demo to stakeholders." },
      { id: "senior-developer", name: "Senior Developer", emoji: "", specialty: "Full-Stack Expertise", description: "Provides senior-level guidance on architecture decisions, code quality, and best practices.", whenToUse: "Use for complex technical decisions, code reviews, or mentoring on best practices." },
      { id: "security-engineer", name: "Security Engineer", emoji: "", specialty: "Application Security", description: "Identifies vulnerabilities, implements security controls, and ensures secure coding practices.", whenToUse: "Use when auditing code for security issues, implementing auth, or hardening systems." },
      { id: "embedded-firmware-engineer", name: "Embedded Firmware Engineer", emoji: "", specialty: "Embedded Systems", description: "Develops firmware and low-level software for embedded systems and IoT devices.", whenToUse: "Use when working with microcontrollers, RTOS, or hardware-level programming." },
      { id: "incident-response-commander", name: "Incident Response Commander", emoji: "", specialty: "Incident Management", description: "Coordinates rapid response to production incidents, outages, and critical system failures.", whenToUse: "Use during production incidents to coordinate response, triage, and resolution." },
      { id: "solidity-engineer", name: "Solidity Smart Contract Engineer", emoji: "", specialty: "Blockchain Development", description: "Writes, audits, and deploys smart contracts on Ethereum and EVM-compatible chains.", whenToUse: "Use when building DeFi protocols, NFT contracts, or any on-chain business logic." },
      { id: "codebase-onboarding-engineer", name: "Codebase Onboarding Engineer", emoji: "", specialty: "Code Navigation", description: "Helps developers quickly understand large codebases through guided exploration and documentation.", whenToUse: "Use when joining a new project or onboarding team members to an existing codebase." },
      { id: "technical-writer", name: "Technical Writer", emoji: "", specialty: "Documentation", description: "Creates clear, comprehensive technical documentation, API references, and developer guides.", whenToUse: "Use when writing docs, READMEs, API references, or developer onboarding materials." },
      { id: "code-reviewer", name: "Code Reviewer", emoji: "", specialty: "Code Quality", description: "Performs thorough code reviews focusing on correctness, performance, and maintainability.", whenToUse: "Use when you need a detailed review of a PR or want to improve code quality." },
      { id: "database-optimizer", name: "Database Optimizer", emoji: "", specialty: "Database Performance", description: "Optimizes database schemas, queries, and indexing strategies for maximum performance.", whenToUse: "Use when dealing with slow queries, schema design, or database scaling challenges." },
      { id: "git-workflow-master", name: "Git Workflow Master", emoji: "", specialty: "Version Control", description: "Designs and enforces Git branching strategies, commit conventions, and merge workflows.", whenToUse: "Use when setting up Git workflows, resolving conflicts, or improving team VCS practices." },
      { id: "software-architect", name: "Software Architect", emoji: "", specialty: "System Architecture", description: "Designs high-level software architectures that balance scalability, maintainability, and performance.", whenToUse: "Use when making major architectural decisions or designing new systems from scratch." },
      { id: "sre", name: "SRE", emoji: "", specialty: "Site Reliability", description: "Ensures system reliability through SLOs, error budgets, monitoring, and chaos engineering.", whenToUse: "Use when improving system reliability, setting up monitoring, or defining SLAs." },
      { id: "data-engineer", name: "Data Engineer", emoji: "", specialty: "Data Pipelines", description: "Builds and maintains data pipelines, ETL processes, and data warehouse architectures.", whenToUse: "Use when building data ingestion, transformation, or analytics infrastructure." },
      { id: "cms-developer", name: "CMS Developer", emoji: "", specialty: "Content Management", description: "Implements and customizes content management systems for editorial and marketing teams.", whenToUse: "Use when building or customizing CMS platforms like WordPress, Contentful, or Sanity." }
    ]
  }
];`;

fs.writeFileSync("integrated-agents/frontend/src/data/agents.js", content, "utf8");
console.log("Written", content.length, "chars");
