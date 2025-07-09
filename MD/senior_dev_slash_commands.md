# Senior Developer's Essential Claude Code Slash Commands

## 📁 File Structure for Commands

```
.claude/
├── commands/
│   ├── architecture/
│   │   ├── review.md
│   │   ├── refactor.md
│   │   └── design.md
│   ├── development/
│   │   ├── feature.md
│   │   ├── bugfix.md
│   │   ├── hotfix.md
│   │   └── tdd.md
│   ├── quality/
│   │   ├── review.md
│   │   ├── security.md
│   │   ├── performance.md
│   │   └── test.md
│   ├── deployment/
│   │   ├── deploy.md
│   │   ├── rollback.md
│   │   └── health.md
│   └── team/
│       ├── onboard.md
│       ├── document.md
│       └── mentor.md
```

## 🏗️ Architecture & Design Commands

### `/architecture:review` - Architecture Review
```markdown
# Architecture Review Command

You are a senior software architect. Review the current codebase architecture and provide:

## Analysis Steps:
1. **Structural Analysis**: Examine the overall project structure, module organization, and dependency relationships
2. **Design Patterns**: Identify design patterns used and evaluate their appropriateness
3. **SOLID Principles**: Assess adherence to SOLID principles
4. **Scalability**: Evaluate system scalability and performance implications
5. **Security**: Review security considerations and potential vulnerabilities

## Deliverables:
- Architecture diagram (ASCII or Mermaid)
- Strengths and weaknesses analysis
- Refactoring recommendations with priority levels
- Technical debt assessment
- Migration strategy for improvements

## Output Format:
Generate a comprehensive architecture review document with actionable recommendations.

Context: $ARGUMENTS
```

### `/architecture:refactor` - Smart Refactoring
```markdown
# Smart Refactoring Command

You are a senior developer specializing in code refactoring. Execute a comprehensive refactoring of the specified component/module.

## Refactoring Process:
1. **Analysis**: Analyze current code structure and identify refactoring opportunities
2. **Plan**: Create a step-by-step refactoring plan with risk assessment
3. **Backup**: Ensure proper Git commits before changes
4. **Execute**: Implement refactoring in small, testable increments
5. **Validate**: Run tests and ensure functionality remains intact

## Focus Areas:
- Code duplication elimination
- Method extraction and simplification
- Class responsibility optimization
- Performance improvements
- Readability enhancements

## Safety Measures:
- Maintain existing API contracts
- Preserve all existing functionality
- Create comprehensive tests if missing
- Document all changes

Target: $ARGUMENTS
```

### `/architecture:design` - System Design
```markdown
# System Design Command

You are a senior system architect. Design a robust, scalable system for the specified requirements.

## Design Process:
1. **Requirements Analysis**: Break down functional and non-functional requirements
2. **System Architecture**: Design high-level system architecture
3. **Component Design**: Design individual components and their interactions
4. **Data Design**: Design data models and database schema
5. **API Design**: Design REST/GraphQL APIs with proper versioning
6. **Security Design**: Implement security considerations
7. **Scalability Plan**: Design for horizontal and vertical scaling

## Deliverables:
- System architecture diagram
- Component specifications
- Database schema
- API documentation
- Security implementation plan
- Deployment strategy

Requirements: $ARGUMENTS
```

## 🚀 Development Workflow Commands

### `/development:feature` - Feature Development
```markdown
# Feature Development Command

You are a senior full-stack developer. Implement a complete feature following enterprise best practices.

## Implementation Process:
1. **Planning**: Create detailed implementation plan with sub-agents
2. **Architecture**: Design feature architecture and integration points
3. **Development**: Implement using parallel sub-agents:
   - Frontend components
   - Backend services
   - Database changes
   - API endpoints
   - Tests (unit, integration, e2e)
4. **Quality**: Code review, security check, performance optimization
5. **Documentation**: API docs, user guides, technical specs

## Parallel Tasks (use 7 sub-agents):
1. **Frontend**: Create React components with TypeScript
2. **Backend**: Create API endpoints and business logic
3. **Database**: Create migrations and models
4. **Testing**: Create comprehensive test suite
5. **Integration**: Connect frontend to backend
6. **Documentation**: Create technical documentation
7. **Deployment**: Create deployment configurations

## Standards:
- Follow existing code patterns
- Implement proper error handling
- Add logging and monitoring
- Ensure accessibility compliance
- Follow security best practices

Feature Requirements: $ARGUMENTS
```

### `/development:bugfix` - Systematic Bug Fixing
```markdown
# Systematic Bug Fixing Command

You are a senior developer specializing in debugging. Fix the reported bug following systematic debugging approach.

## Debugging Process:
1. **Reproduce**: Reproduce the bug consistently
2. **Analyze**: Use debugging tools and logs to understand root cause
3. **Research**: Check similar issues, documentation, and stack traces
4. **Fix**: Implement minimal, targeted fix
5. **Test**: Create regression tests to prevent future occurrences
6. **Validate**: Ensure fix doesn't break other functionality

## Investigation Steps:
- Check error logs and stack traces
- Review recent changes that might have introduced the bug
- Test edge cases and boundary conditions
- Verify fix across different environments

## Deliverables:
- Root cause analysis
- Minimal fix implementation
- Regression test cases
- Documentation update if needed

Bug Details: $ARGUMENTS
```

### `/development:tdd` - Test-Driven Development
```markdown
# Test-Driven Development Command

You are a senior developer practicing TDD. Implement the feature using strict TDD methodology.

## TDD Process:
1. **Red**: Write failing tests based on requirements
2. **Green**: Write minimal code to make tests pass
3. **Refactor**: Improve code while keeping tests green
4. **Repeat**: Continue cycle for each requirement

## Test Strategy:
- Unit tests for individual functions/methods
- Integration tests for component interactions
- End-to-end tests for user workflows
- Performance tests for critical paths

## Implementation Rules:
- No production code without failing test
- Write only enough code to pass tests
- Refactor mercilessly while keeping tests green
- Use sub-agents for parallel test/code development

## Parallel Sub-agents:
1. **Test Writer**: Create comprehensive test suite
2. **Code Implementer**: Write minimal code to pass tests
3. **Refactor Agent**: Improve code quality while maintaining tests

Requirements: $ARGUMENTS
```

## 🔍 Quality Assurance Commands

### `/quality:review` - Comprehensive Code Review
```markdown
# Comprehensive Code Review Command

You are a senior code reviewer. Perform a thorough code review of the specified changes.

## Review Criteria:
1. **Code Quality**: Readability, maintainability, and style consistency
2. **Architecture**: Proper design patterns and architectural principles
3. **Performance**: Potential bottlenecks and optimization opportunities
4. **Security**: Vulnerability assessment and security best practices
5. **Testing**: Test coverage and quality of test cases
6. **Documentation**: Code comments and documentation completeness

## Review Process:
- Check for code smells and anti-patterns
- Verify error handling and edge cases
- Assess performance implications
- Review security considerations
- Validate test coverage
- Check documentation quality

## Output Format:
Provide structured feedback with:
- **Approve/Request Changes/Comment**
- **Critical Issues** (must fix)
- **Suggestions** (should consider)
- **Nitpicks** (minor improvements)
- **Praise** (good practices to reinforce)

Target: $ARGUMENTS
```

### `/quality:security` - Security Audit
```markdown
# Security Audit Command

You are a senior security engineer. Perform a comprehensive security audit of the codebase.

## Security Assessment Areas:
1. **Authentication & Authorization**: JWT handling, session management, RBAC
2. **Input Validation**: SQL injection, XSS, CSRF protection
3. **Data Protection**: Encryption, PII handling, secure storage
4. **API Security**: Rate limiting, input sanitization, output encoding
5. **Infrastructure**: Container security, secrets management
6. **Dependencies**: Vulnerable packages and supply chain security

## Audit Process:
- Static code analysis for security vulnerabilities
- Review authentication and authorization flows
- Check input validation and sanitization
- Verify secure data handling practices
- Assess API security measures
- Review dependency security

## Deliverables:
- Security vulnerability report
- Risk assessment with severity levels
- Remediation recommendations
- Security best practices documentation

Scope: $ARGUMENTS
```

### `/quality:performance` - Performance Optimization
```markdown
# Performance Optimization Command

You are a senior performance engineer. Analyze and optimize system performance.

## Performance Analysis:
1. **Profiling**: Use appropriate profiling tools to identify bottlenecks
2. **Metrics**: Collect performance metrics (response time, throughput, resource usage)
3. **Database**: Query optimization, indexing strategy
4. **Frontend**: Bundle optimization, lazy loading, caching
5. **Backend**: Algorithm optimization, caching strategy
6. **Infrastructure**: Scaling recommendations

## Optimization Process:
- Benchmark current performance
- Identify performance bottlenecks
- Implement optimizations incrementally
- Measure improvement after each change
- Document performance improvements

## Parallel Sub-agents:
1. **Frontend Performance**: Bundle analysis, lazy loading, caching
2. **Backend Performance**: Algorithm optimization, database queries
3. **Infrastructure**: Scaling and caching strategies

## Deliverables:
- Performance analysis report
- Optimization recommendations
- Implementation plan with expected improvements
- Performance monitoring setup

Target: $ARGUMENTS
```

## 🚀 Deployment & Operations Commands

### `/deployment:deploy` - Smart Deployment
```markdown
# Smart Deployment Command

You are a senior DevOps engineer. Execute a safe, monitored deployment to the specified environment.

## Deployment Process:
1. **Pre-deployment**: Health checks, dependency verification
2. **Staging**: Deploy to staging environment first
3. **Testing**: Run automated tests in staging
4. **Production**: Blue-green or canary deployment
5. **Monitoring**: Real-time health monitoring
6. **Rollback Plan**: Prepare rollback strategy

## Safety Measures:
- Database migration safety checks
- Feature flag configuration
- Health endpoint monitoring
- Rollback procedures ready
- Team notifications

## Deployment Steps:
- Validate environment readiness
- Execute deployment strategy
- Monitor application health
- Verify functionality post-deployment
- Document deployment notes

Environment: $ARGUMENTS
```

### `/deployment:rollback` - Emergency Rollback
```markdown
# Emergency Rollback Command

You are a senior DevOps engineer handling a production incident. Execute immediate rollback procedures.

## Rollback Process:
1. **Assess**: Quickly assess the severity and impact
2. **Communicate**: Notify team and stakeholders
3. **Rollback**: Execute immediate rollback to last known good state
4. **Verify**: Confirm system stability after rollback
5. **Post-mortem**: Prepare for incident analysis

## Immediate Actions:
- Stop current deployment
- Revert to previous version
- Clear caches if necessary
- Restart services if needed
- Monitor system recovery

## Communication:
- Incident status updates
- ETA for resolution
- Post-rollback confirmation

Incident Details: $ARGUMENTS
```

## 👥 Team & Mentoring Commands

### `/team:onboard` - Developer Onboarding
```markdown
# Developer Onboarding Command

You are a senior developer responsible for onboarding new team members. Create a comprehensive onboarding plan.

## Onboarding Process:
1. **Environment Setup**: Development environment configuration
2. **Codebase Tour**: Architecture overview and key components
3. **Development Workflow**: Git flow, CI/CD, code review process
4. **First Tasks**: Beginner-friendly tasks to get started
5. **Mentoring Plan**: Pairing sessions and learning objectives

## Deliverables:
- Development environment setup guide
- Codebase architecture documentation
- First week task assignments
- Mentoring schedule
- Resource links and documentation

## Onboarding Tasks:
- Create step-by-step setup instructions
- Identify good first issues for new developer
- Set up mentoring schedule
- Create knowledge transfer sessions

New Developer: $ARGUMENTS
```

### `/team:document` - Technical Documentation
```markdown
# Technical Documentation Command

You are a senior developer creating comprehensive technical documentation. Generate production-ready documentation.

## Documentation Types:
1. **API Documentation**: OpenAPI/Swagger specifications
2. **Architecture Documentation**: System design and component interactions
3. **Developer Guide**: Setup, development workflow, best practices
4. **User Guide**: Feature usage and configuration
5. **Troubleshooting**: Common issues and solutions

## Documentation Process:
- Analyze current codebase and identify documentation needs
- Create structured documentation with clear navigation
- Include code examples and practical usage
- Add diagrams and visual aids where helpful
- Ensure documentation is maintainable and up-to-date

## Parallel Sub-agents:
1. **API Docs**: Generate OpenAPI specifications
2. **Architecture**: Create system architecture documentation
3. **User Guide**: Create end-user documentation
4. **Developer Guide**: Create development setup and workflow docs

Topic: $ARGUMENTS
```

### `/team:mentor` - Code Mentoring
```markdown
# Code Mentoring Command

You are a senior developer providing mentoring to junior developers. Provide educational guidance and code improvement suggestions.

## Mentoring Approach:
1. **Assessment**: Evaluate current skill level and code quality
2. **Education**: Explain concepts and best practices
3. **Guidance**: Provide step-by-step improvement suggestions
4. **Practice**: Suggest exercises and learning resources
5. **Review**: Regular progress check and feedback

## Teaching Focus:
- Code quality and best practices
- Design patterns and architecture
- Testing strategies
- Performance considerations
- Security awareness

## Mentoring Style:
- Socratic questioning to encourage thinking
- Practical examples and hands-on exercises
- Progressive complexity in learning tasks
- Positive reinforcement and constructive feedback

Developer Question/Code: $ARGUMENTS
```

## 🎯 Specialized Commands

### `/analyze:dependencies` - Dependency Analysis
```markdown
# Dependency Analysis Command

Analyze project dependencies for security, performance, and maintainability issues.

## Analysis Areas:
1. **Security**: Scan for known vulnerabilities
2. **Licensing**: Check license compatibility
3. **Performance**: Identify heavy dependencies
4. **Maintenance**: Check for outdated packages
5. **Alternatives**: Suggest better alternatives

## Process:
- Scan package.json/requirements.txt/pom.xml
- Check for security vulnerabilities
- Analyze bundle size impact
- Recommend updates and alternatives
- Create dependency upgrade plan

Scope: $ARGUMENTS
```

### `/generate:api` - API Generation
```markdown
# API Generation Command

Generate complete REST API with OpenAPI specification, validation, and documentation.

## API Generation Process:
1. **Schema Design**: Create data models and relationships
2. **Endpoint Design**: RESTful endpoint structure
3. **Validation**: Request/response validation
4. **Documentation**: OpenAPI specification
5. **Testing**: API test suite
6. **Security**: Authentication and authorization

## Deliverables:
- OpenAPI specification
- API implementation
- Validation schemas
- Test suite
- Documentation

API Requirements: $ARGUMENTS
```

## 🔧 Usage Examples

### Project Commands (stored in `.claude/commands/`)
```bash
# Architecture review
/project:architecture:review "Review the user authentication system"

# Feature development
/project:development:feature "Create user profile management system"

# Code review
/project:quality:review "Review the payment processing module"

# Performance optimization
/project:quality:performance "Optimize the search functionality"

# Deployment
/project:deployment:deploy "staging"
```

### User Commands (stored in `~/.claude/commands/`)
```bash
# Personal productivity commands
/user:analyze:dependencies "Check for vulnerable packages"
/user:generate:api "Create REST API for blog system"
/user:team:mentor "Explain async/await patterns"
```

## 📋 Command Management Best Practices

### 1. Organization
- Use hierarchical folder structure
- Group related commands together
- Use descriptive names

### 2. Parameterization
- Use `$ARGUMENTS` for flexible inputs
- Support multiple argument patterns
- Provide usage examples

### 3. Documentation
- Include command descriptions
- Add usage examples
- Document expected inputs/outputs

### 4. Team Standards
- Establish team-wide command conventions
- Share useful commands via git
- Regular review and updates

### 5. Testing
- Test commands with various inputs
- Validate outputs match expectations
- Update commands as tools evolve

## 🚀 Advanced Integration

### Git Integration
```markdown
# Commands can integrate with Git
git status
git log --oneline -10
git diff HEAD~1
```

### CI/CD Integration
```markdown
# Commands can trigger CI/CD
gh workflow run deploy --ref main
kubectl get pods
docker ps
```

### Database Integration
```markdown
# Commands can interact with databases
# Use MCP servers for database connections
```

These slash commands transform Claude Code into a comprehensive development platform that handles everything from architecture design to deployment, making senior developers significantly more productive while maintaining high code quality standards.