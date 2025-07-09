# Complete Guide to Creating Sub-agents in Claude Code

## What are Sub-agents?

Sub-agents are lightweight instances of Claude Code that can run inside of tasks, and each agent has its own context window. The premise of this tool is to spin off a sub-agent that will have the same access to tools as your main agent (except that it cannot spawn another sub-task) and reports back the results.

## 🔧 How Sub-agents Work

Sub-agents in Claude Code are created using the **Task tool**, which allows you to:
- Run multiple tasks in parallel
- Each sub-agent gets its own context window
- Sub-agents have access to the same tools as the main agent
- Sub-agents **cannot spawn other sub-tasks** (no nested sub-agents)
- The max parallelism seems to be capped at 10

## 🚀 Basic Sub-agent Creation

### Simple Sub-agent Creation
Just ask Claude Code to create tasks or use sub-agents:

```
> Explore the codebase using 4 tasks in parallel. Each agent should explore different directories.
```

This will create output like:
```
● Task(Explore backend structure)
  ⎿ Done (17 tool uses · 29.9k tokens · 5m 47.6s)
● Task(Explore frontend structure)  
  ⎿ Done (15 tool uses · 22.1k tokens · 4m 12.3s)
● Task(Explore database structure)
  ⎿ Done (12 tool uses · 18.7k tokens · 3m 8.9s)
● Task(Explore configuration files)
  ⎿ Done (9 tool uses · 14.2k tokens · 2m 15.6s)
```

### Research with Multiple Perspectives
Here's a recent example of how I used this feature to do a deep-dive of the same problem with four different personas:

```
> Read files in the current directory to deduct a pattern for building Tailwind Plus components. You should spawn 4 sub-tasks with slightly different priorities (e.g. design color export, accessibility export, mobile/responsive expert, overall style expert) and compare their results.
```

## 🎯 Advanced Sub-agent Patterns

### 1. Parallel Development Tasks
```
> Create a new feature with 5 parallel tasks:
1. Task: Create main component file
2. Task: Create component styles/CSS  
3. Task: Create test files
4. Task: Create type definitions
5. Task: Update routing and integration
```

### 2. Code Review and Testing
A simple but effective approach is to have one Claude write code while another reviews or tests it:

```
> Use 2 sub-agents: one to write the authentication function, another to write comprehensive tests for it
```

### 3. Multi-angle Problem Solving
A common and useful pattern is to use multiple subagents to approach a problem from multiple angles simultaneously, then have the main agent compare notes and find the best solution with you:

```
> I want to refactor X to do Y. Can you research three separate ideas for how to do it? Do it in parallel. Use three agents to do it.
```

### 4. Large Codebase Analysis
Each subagent will have its own context window, so this is a neat way to gain additional context window for large codebases:

```
> Analyze this large codebase using 8 parallel tasks. Each should focus on different modules and report key findings.
```

## 📊 Sub-agent Limitations and Behavior

### Parallelism Limits
- The max parallelism seems to be capped at 10
- Claude Code can support large numbers of tasks, as demonstrated by the 100-task example
- When providing a parallelism level, Claude Code will execute the tasks in parallel but in batches

### Batch Processing Behavior
Claude Code created 10 tasks, and ran the first 4 tasks in parallel. However, it did not pull more tasks from the queue after a task was done. Instead, it waited for all 4 tasks to finish before starting the next 4 tasks.

However, newer versions show improved behavior:
I later tried various numbers of parallelism (10+) and interestingly Claude Code now pulls tasks from the queue as soon as one task is done.

### Sub-agent Capabilities
- ✅ Full access to all tools (file operations, web search, etc.)
- ✅ Independent context windows
- ✅ Can run in parallel (up to 10 simultaneously)
- ❌ Cannot spawn other sub-tasks
- ❌ Limited visibility from parent agent

## 🛠️ Maximizing Sub-agent Effectiveness

### 1. Explicit Task Delegation
To maximize sub-agent usage you have to provide Claude with explicit steps including details which steps will be delegated to sub-agents:

```
> Create a new React component with these explicit parallel tasks:
1. Task: Create component.tsx file with TypeScript interfaces
2. Task: Create component.test.tsx with unit tests
3. Task: Create component.stories.tsx for Storybook
4. Task: Create component.module.css with responsive styles
5. Task: Update index.ts exports and documentation
```

### 2. Structured Workflow in CLAUDE.md
Simplified Illustrative CLAUDE.md for task splitting:

```markdown
## Feature Implementation System Guidelines

### Parallel Feature Implementation Workflow
1. **Component**: Create main component file
2. **Styles**: Create component styles/CSS
3. **Tests**: Create test files
4. **Types**: Create type definitions
5. **Hooks**: Create custom hooks/utilities
6. **Integration**: Update routing, imports, exports
7. **Remaining**: Update package.json, documentation, configuration files
```

### 3. Task Grouping Strategy
Grouping related tasks together is often more efficient than creating separate agents for every operation:

```
> Use 3 parallel tasks for this feature:
1. Task: Handle all component creation (main file, types, hooks)
2. Task: Handle all testing (unit tests, integration tests, stories)
3. Task: Handle all integration (routing, exports, documentation)
```

## 🔄 Practical Sub-agent Workflows

### Test-Driven Development
You can even have your Claude instances communicate with each other by giving them separate working scratchpads and telling them which one to write to and which one to read from:

```
> Use TDD with 2 sub-agents:
1. Task: Write comprehensive tests for user authentication feature
2. Task: Write code that passes all the tests from agent 1
```

### Research and Implementation
```
> Research the best approach for state management in our app:
1. Task: Research Redux Toolkit approach with pros/cons
2. Task: Research Zustand approach with pros/cons  
3. Task: Research React Context approach with pros/cons
4. Task: Create implementation recommendation based on our specific needs
```

### Code Review Process
```
> Review this pull request using 3 parallel tasks:
1. Task: Review code quality, patterns, and architecture
2. Task: Review security implications and potential vulnerabilities
3. Task: Review performance implications and optimization opportunities
```

## 📈 Performance Optimization Tips

### 1. Strategic Task Distribution
Like programming with threads, explicit orchestration of which steps get delegated to sub-agents yields the best results.

### 2. Context Window Management
Each task handles ONLY specified files or file types to optimize context usage.

### 3. Efficient Task Sizing
Task 7 combines small config/doc updates to prevent over-splitting.

## 🎨 Creative Sub-agent Use Cases

### 1. Multi-Perspective Analysis
```
> Analyze this business proposal using 4 different perspectives:
1. Task: Financial analyst perspective
2. Task: Technical feasibility perspective  
3. Task: Market opportunity perspective
4. Task: Risk assessment perspective
```

### 2. Documentation Generation
```
> Create comprehensive documentation using parallel tasks:
1. Task: Generate API documentation from code
2. Task: Create user guide with examples
3. Task: Create developer setup instructions
4. Task: Create troubleshooting guide
```

### 3. Quality Assurance
```
> Perform comprehensive QA using 5 parallel tasks:
1. Task: Code quality and style review
2. Task: Security vulnerability assessment
3. Task: Performance bottleneck analysis
4. Task: Accessibility compliance check
5. Task: Cross-browser compatibility review
```

## 🚨 Current Limitations & Workarounds

### 1. Limited Parent-Child Communication
When a Claude instance spawns sub-agents using the Task tool, the parent has no visibility into sub-agent activities until completion.

**Workaround**: Use explicit reporting mechanisms:
```
> Each sub-agent should write progress updates to a shared status.md file
```

### 2. No Nested Sub-agents
Sub-agents cannot create their own sub-agents.

**Workaround**: Plan task hierarchy at the main agent level:
```
> Create 6 parallel tasks instead of 2 tasks with 3 sub-tasks each
```

### 3. Batch Processing Delays
It doesn't seem that I can make this more efficient with the current implementation of Claude Code's Task Tool.

**Workaround**: Use optimal batch sizes (4-6 tasks) for better flow.

## 🎯 Best Practices Summary

### ✅ Do's
- **Be explicit** about task delegation and responsibilities
- **Use parallel tasks** for independent operations
- **Group related tasks** to avoid over-splitting
- **Provide clear context** for each sub-agent
- **Use sub-agents** for research, analysis, and code review
- **Leverage separate context windows** for large codebases

### ❌ Don'ts
- **Don't create too many small tasks** (causes overhead)
- **Don't expect nested sub-agents** (not supported)
- **Don't assume real-time communication** between sub-agents
- **Don't use for dependent sequential tasks**
- **Don't ignore the 10-agent parallelism limit**

## 🚀 Future Enhancements

The Claude Code team is working on improvements including:
- Parent-Child Agent Communication and Monitoring
- Better task coordination and state management
- Enhanced error handling and recovery
- Real-time progress visibility

## 📚 Example Commands to Try

### Basic Parallel Exploration
```bash
"Explore this project using 4 parallel tasks, each focusing on different aspects"
```

### Feature Development
```bash
"Create a user dashboard feature using 5 parallel tasks for components, styles, tests, types, and integration"
```

### Code Analysis
```bash
"Analyze code quality using 3 parallel tasks: performance, security, and maintainability"
```

### Research Tasks
```bash
"Research the best database solution using 4 parallel tasks for PostgreSQL, MongoDB, Redis, and SQLite"
```

Sub-agents in Claude Code represent a powerful paradigm shift toward true multi-agent development workflows. By understanding their capabilities and limitations, you can significantly accelerate your development process and tackle complex problems more effectively.