# Team Lead's Claude Code Hooks Implementation Strategy

## 🎯 Hook Types Overview

Claude Code provides 5 critical hooks for team workflow management:
- **pre-tool use**: Safety gate before any tool execution
- **post-tool use**: Logging and monitoring after tool execution
- **notification**: Real-time alerts when Claude needs input
- **stop**: Session completion and transcript analysis
- **sub agent stop**: Sub-agent completion monitoring

## 🛡️ Pre-tool Use Hooks (Safety Gates)

### 1. **Dangerous Command Prevention**
```json
// settings.json
{
  "hooks": {
    "pre-tool": {
      "script": "python hooks/safety_gate.py",
      "enabled": true
    }
  }
}
```

```python
# hooks/safety_gate.py
import sys
import json
import re
import logging

DANGEROUS_COMMANDS = [
    r'rm\s+-rf\s+/',
    r'sudo\s+rm',
    r'DROP\s+DATABASE',
    r'DELETE\s+FROM\s+\w+\s*;?\s*$',
    r'truncate\s+table',
    r'format\s+[c-z]:',
    r'del\s+/[sqf]',
    r'rmdir\s+/s',
    r'npm\s+publish',
    r'git\s+push\s+--force',
    r'docker\s+system\s+prune\s+-a',
    r'kubectl\s+delete\s+namespace',
    r'terraform\s+destroy'
]

PRODUCTION_PATTERNS = [
    r'production',
    r'prod',
    r'live',
    r'master',
    r'main.*deploy'
]

def check_safety(tool_name, tool_input):
    """Safety checks before tool execution"""
    
    # Parse tool input
    command = ""
    if tool_name == "execute_command":
        command = tool_input.get("command", "")
    elif tool_name == "edit_block":
        command = tool_input.get("new_string", "")
    
    # Check for dangerous commands
    for pattern in DANGEROUS_COMMANDS:
        if re.search(pattern, command, re.IGNORECASE):
            return {
                "allow": False,
                "reason": f"Blocked dangerous command pattern: {pattern}",
                "severity": "CRITICAL"
            }
    
    # Check for production operations
    if any(re.search(pattern, command, re.IGNORECASE) for pattern in PRODUCTION_PATTERNS):
        # Require explicit confirmation for production
        return {
            "allow": False,
            "reason": "Production operation requires manual approval",
            "severity": "HIGH",
            "require_confirmation": True
        }
    
    # File size check
    if tool_name == "write_file":
        content = tool_input.get("content", "")
        if len(content.splitlines()) > 1000:
            return {
                "allow": False,
                "reason": "Large file write detected - please chunk the operation",
                "severity": "MEDIUM"
            }
    
    return {"allow": True}

if __name__ == "__main__":
    # Read input from Claude Code
    input_data = json.loads(sys.stdin.read())
    tool_name = input_data.get("tool_name")
    tool_input = input_data.get("tool_input")
    
    result = check_safety(tool_name, tool_input)
    
    if not result["allow"]:
        logging.error(f"BLOCKED: {result['reason']}")
        print(json.dumps({"block": True, "reason": result["reason"]}))
        sys.exit(1)
    else:
        print(json.dumps({"block": False}))
        sys.exit(0)
```

### 2. **Code Quality Gates**
```python
# hooks/quality_gate.py
import ast
import subprocess
import json
import sys

def check_code_quality(tool_name, tool_input):
    """Pre-execution code quality checks"""
    
    if tool_name != "write_file":
        return {"allow": True}
    
    file_path = tool_input.get("path", "")
    content = tool_input.get("content", "")
    
    # Python syntax check
    if file_path.endswith('.py'):
        try:
            ast.parse(content)
        except SyntaxError as e:
            return {
                "allow": False,
                "reason": f"Python syntax error: {e}",
                "line": e.lineno
            }
    
    # Detect hardcoded secrets
    secret_patterns = [
        r'password\s*=\s*["\'][^"\']+["\']',
        r'api_key\s*=\s*["\'][^"\']+["\']',
        r'secret\s*=\s*["\'][^"\']+["\']',
        r'token\s*=\s*["\'][^"\']+["\']'
    ]
    
    for pattern in secret_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            return {
                "allow": False,
                "reason": "Hardcoded secret detected - use environment variables",
                "severity": "SECURITY"
            }
    
    return {"allow": True}
```

## 📊 Post-tool Use Hooks (Monitoring & Logging)

### 1. **Comprehensive Activity Logging**
```python
# hooks/activity_logger.py
import json
import sys
import datetime
import os
from pathlib import Path

LOG_DIR = Path("logs/claude_activity")
LOG_DIR.mkdir(parents=True, exist_ok=True)

def log_activity(tool_name, tool_input, tool_output, execution_time):
    """Log all Claude Code tool usage"""
    
    timestamp = datetime.datetime.now().isoformat()
    session_id = os.environ.get("CLAUDE_SESSION_ID", "unknown")
    
    activity_log = {
        "timestamp": timestamp,
        "session_id": session_id,
        "tool_name": tool_name,
        "tool_input": tool_input,
        "execution_time_ms": execution_time,
        "success": tool_output.get("success", True),
        "output_size": len(str(tool_output)),
        "git_branch": get_current_branch(),
        "working_directory": os.getcwd()
    }
    
    # Log to daily file
    log_file = LOG_DIR / f"activity_{datetime.date.today().isoformat()}.jsonl"
    with open(log_file, "a") as f:
        f.write(json.dumps(activity_log) + "\n")
    
    # Alert on suspicious patterns
    check_suspicious_activity(activity_log)

def check_suspicious_activity(log_entry):
    """Alert on potentially problematic patterns"""
    
    # High frequency tool usage
    recent_logs = get_recent_logs(minutes=5)
    if len(recent_logs) > 50:
        send_alert("HIGH_FREQUENCY", "Unusual high tool usage detected")
    
    # Failed operations pattern
    failed_count = sum(1 for log in recent_logs if not log.get("success", True))
    if failed_count > 10:
        send_alert("HIGH_FAILURE", "Multiple tool failures detected")

def get_current_branch():
    """Get current git branch"""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            capture_output=True, text=True
        )
        return result.stdout.strip()
    except:
        return "unknown"

def send_alert(alert_type, message):
    """Send alert to team notification system"""
    # Integration with Slack, Teams, or email
    pass
```

### 2. **Performance Monitoring**
```python
# hooks/performance_monitor.py
import psutil
import json
import time

def monitor_performance(tool_name, execution_time):
    """Monitor system performance during tool execution"""
    
    performance_data = {
        "tool_name": tool_name,
        "execution_time_ms": execution_time,
        "cpu_usage": psutil.cpu_percent(),
        "memory_usage": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent,
        "timestamp": time.time()
    }
    
    # Alert on resource issues
    if performance_data["memory_usage"] > 90:
        send_alert("HIGH_MEMORY", f"Memory usage: {performance_data['memory_usage']}%")
    
    if execution_time > 30000:  # 30 seconds
        send_alert("SLOW_EXECUTION", f"Tool {tool_name} took {execution_time/1000}s")
    
    # Log performance data
    with open("logs/performance.jsonl", "a") as f:
        f.write(json.dumps(performance_data) + "\n")
```

### 3. **Git Integration Tracking**
```python
# hooks/git_tracker.py
import subprocess
import json
import os

def track_git_changes(tool_name, tool_input):
    """Track git-related changes and enforce policies"""
    
    if tool_name == "execute_command":
        command = tool_input.get("command", "")
        
        # Track git operations
        if command.startswith("git"):
            git_data = {
                "command": command,
                "branch": get_current_branch(),
                "commit_hash": get_current_commit(),
                "dirty_files": get_dirty_files(),
                "timestamp": time.time()
            }
            
            # Log git operation
            with open("logs/git_operations.jsonl", "a") as f:
                f.write(json.dumps(git_data) + "\n")
            
            # Enforce git policies
            if "push" in command and get_current_branch() == "main":
                send_alert("MAIN_PUSH", "Direct push to main branch detected")

def get_dirty_files():
    """Get list of modified files"""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only"],
            capture_output=True, text=True
        )
        return result.stdout.strip().split('\n') if result.stdout.strip() else []
    except:
        return []
```

## 🔔 Notification Hooks (Real-time Alerts)

### 1. **Team Communication Integration**
```python
# hooks/team_notifications.py
import requests
import json
import os

def send_team_notification(notification_type, context):
    """Send notifications to team communication channels"""
    
    if notification_type == "input_required":
        send_slack_notification(
            channel="#claude-code-alerts",
            message=f"🤖 Claude Code needs input in {context['project']}",
            context=context
        )
    
    elif notification_type == "long_running_task":
        send_slack_notification(
            channel="#development",
            message=f"⏰ Long-running Claude task in progress: {context['task']}",
            context=context
        )

def send_slack_notification(channel, message, context):
    """Send Slack notification"""
    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        return
    
    payload = {
        "channel": channel,
        "text": message,
        "attachments": [{
            "color": "warning",
            "fields": [
                {"title": "Project", "value": context.get("project", "Unknown"), "short": True},
                {"title": "Session ID", "value": context.get("session_id", "Unknown"), "short": True},
                {"title": "Branch", "value": context.get("branch", "Unknown"), "short": True}
            ]
        }]
    }
    
    requests.post(webhook_url, json=payload)

def send_email_alert(severity, message, details):
    """Send email alerts for critical issues"""
    if severity in ["CRITICAL", "HIGH"]:
        # Email integration for critical alerts
        pass
```

### 2. **Mobile Push Notifications**
```python
# hooks/mobile_notifications.py
import requests
import json

def send_mobile_notification(user_id, message, priority="normal"):
    """Send push notification to mobile devices"""
    
    # Integration with services like Pushover, Firebase, etc.
    pushover_token = os.environ.get("PUSHOVER_TOKEN")
    pushover_user = os.environ.get("PUSHOVER_USER")
    
    if pushover_token and pushover_user:
        requests.post("https://api.pushover.net/1/messages.json", data={
            "token": pushover_token,
            "user": pushover_user,
            "message": message,
            "priority": 1 if priority == "high" else 0
        })
```

## 🏁 Stop Hooks (Session Analysis)

### 1. **Comprehensive Session Analysis**
```python
# hooks/session_analyzer.py
import json
import time
import subprocess
from pathlib import Path

def analyze_session(session_data):
    """Comprehensive analysis of completed Claude session"""
    
    session_summary = {
        "session_id": session_data["session_id"],
        "duration_minutes": session_data["duration"] / 60,
        "tools_used": count_tools_used(session_data["transcript"]),
        "files_modified": get_modified_files(session_data),
        "git_commits": count_git_commits(session_data),
        "code_quality_score": calculate_quality_score(session_data),
        "productivity_metrics": calculate_productivity(session_data),
        "errors_encountered": count_errors(session_data),
        "recommendations": generate_recommendations(session_data)
    }
    
    # Save session analysis
    save_session_analysis(session_summary)
    
    # Generate team report
    generate_team_report(session_summary)
    
    # Update developer metrics
    update_developer_metrics(session_summary)

def calculate_productivity(session_data):
    """Calculate productivity metrics"""
    return {
        "lines_of_code": count_lines_of_code(session_data),
        "tests_written": count_tests_written(session_data),
        "files_created": count_files_created(session_data),
        "documentation_updated": check_documentation_updates(session_data),
        "efficiency_score": calculate_efficiency(session_data)
    }

def generate_recommendations(session_data):
    """Generate improvement recommendations"""
    recommendations = []
    
    # Check for common patterns
    if count_errors(session_data) > 10:
        recommendations.append("Consider breaking down tasks into smaller chunks")
    
    if session_data["duration"] > 7200:  # 2 hours
        recommendations.append("Long session detected - consider regular breaks")
    
    if count_git_commits(session_data) == 0:
        recommendations.append("No commits made - remember to commit progress regularly")
    
    return recommendations
```

### 2. **Knowledge Base Updates**
```python
# hooks/knowledge_updater.py
import json
from pathlib import Path

def update_knowledge_base(session_data):
    """Extract learnings and update team knowledge base"""
    
    # Extract patterns and solutions
    patterns = extract_solution_patterns(session_data)
    
    # Update team wiki/documentation
    for pattern in patterns:
        update_documentation(pattern)
    
    # Create searchable knowledge entries
    create_knowledge_entries(patterns)

def extract_solution_patterns(session_data):
    """Extract reusable patterns from session"""
    patterns = []
    
    # Analyze successful problem-solving sequences
    # Look for error-resolution patterns
    # Identify useful command sequences
    
    return patterns
```

## 🤖 Sub-agent Stop Hooks (Parallel Task Monitoring)

### 1. **Sub-agent Coordination**
```python
# hooks/subagent_coordinator.py
import json
import time
from concurrent.futures import ThreadPoolExecutor

def handle_subagent_completion(subagent_id, result, parent_session_id):
    """Handle sub-agent task completion"""
    
    completion_data = {
        "subagent_id": subagent_id,
        "parent_session": parent_session_id,
        "completion_time": time.time(),
        "success": result.get("success", False),
        "output_summary": summarize_output(result),
        "performance_metrics": extract_performance_metrics(result)
    }
    
    # Log sub-agent completion
    log_subagent_completion(completion_data)
    
    # Check if all sub-agents completed
    if all_subagents_completed(parent_session_id):
        trigger_aggregation_analysis(parent_session_id)
    
    # Update progress tracking
    update_progress_dashboard(parent_session_id, completion_data)

def trigger_aggregation_analysis(parent_session_id):
    """Analyze combined results from all sub-agents"""
    
    all_results = get_all_subagent_results(parent_session_id)
    
    analysis = {
        "total_subagents": len(all_results),
        "success_rate": calculate_success_rate(all_results),
        "total_execution_time": sum(r["duration"] for r in all_results),
        "efficiency_score": calculate_parallel_efficiency(all_results),
        "conflicts_detected": detect_conflicts(all_results),
        "integration_recommendations": generate_integration_plan(all_results)
    }
    
    # Notify parent agent of completion
    notify_parent_agent(parent_session_id, analysis)
```

### 2. **Progress Dashboard Updates**
```python
# hooks/progress_dashboard.py
import json
import websocket

def update_real_time_dashboard(session_id, update_data):
    """Update real-time progress dashboard"""
    
    dashboard_update = {
        "session_id": session_id,
        "timestamp": time.time(),
        "active_subagents": get_active_subagent_count(session_id),
        "completed_tasks": get_completed_task_count(session_id),
        "current_operations": get_current_operations(session_id),
        "resource_usage": get_resource_usage(),
        "estimated_completion": estimate_completion_time(session_id)
    }
    
    # Send to WebSocket dashboard
    send_dashboard_update(dashboard_update)
    
    # Update team status page
    update_team_status(session_id, dashboard_update)
```

## 📁 Hook Configuration Structure

```
project/
├── .claude/
│   ├── settings.json
│   └── hooks/
│       ├── pre-tool/
│       │   ├── safety_gate.py
│       │   ├── quality_gate.py
│       │   └── resource_check.py
│       ├── post-tool/
│       │   ├── activity_logger.py
│       │   ├── performance_monitor.py
│       │   └── git_tracker.py
│       ├── notification/
│       │   ├── team_notifications.py
│       │   └── mobile_notifications.py
│       ├── stop/
│       │   ├── session_analyzer.py
│       │   ├── knowledge_updater.py
│       │   └── report_generator.py
│       └── subagent-stop/
│           ├── subagent_coordinator.py
│           └── progress_dashboard.py
├── logs/
│   ├── claude_activity/
│   ├── performance.jsonl
│   ├── git_operations.jsonl
│   └── session_analysis/
└── config/
    ├── notification_config.json
    ├── safety_rules.json
    └── team_settings.json
```

## ⚙️ Settings Configuration

```json
{
  "hooks": {
    "pre-tool": {
      "enabled": true,
      "scripts": [
        "hooks/pre-tool/safety_gate.py",
        "hooks/pre-tool/quality_gate.py",
        "hooks/pre-tool/resource_check.py"
      ],
      "timeout_seconds": 30,
      "fail_on_error": true
    },
    "post-tool": {
      "enabled": true,
      "scripts": [
        "hooks/post-tool/activity_logger.py",
        "hooks/post-tool/performance_monitor.py",
        "hooks/post-tool/git_tracker.py"
      ],
      "async": true
    },
    "notification": {
      "enabled": true,
      "script": "hooks/notification/team_notifications.py",
      "channels": ["slack", "email", "mobile"]
    },
    "stop": {
      "enabled": true,
      "scripts": [
        "hooks/stop/session_analyzer.py",
        "hooks/stop/knowledge_updater.py",
        "hooks/stop/report_generator.py"
      ],
      "generate_reports": true,
      "backup_transcripts": true
    },
    "subagent-stop": {
      "enabled": true,
      "script": "hooks/subagent-stop/subagent_coordinator.py",
      "real_time_updates": true
    }
  },
  "team_settings": {
    "require_approval_for_production": true,
    "max_session_duration_hours": 4,
    "auto_commit_threshold_lines": 100,
    "notification_preferences": {
      "critical_alerts": ["slack", "email", "mobile"],
      "info_alerts": ["slack"],
      "progress_updates": ["dashboard"]
    }
  }
}
```

## 📊 Benefits for Team Leadership

### 1. **Safety & Risk Management**
- Prevent dangerous operations
- Production safety gates
- Code quality enforcement
- Security vulnerability prevention

### 2. **Visibility & Monitoring**
- Real-time activity tracking
- Performance monitoring
- Progress dashboards
- Resource utilization

### 3. **Team Collaboration**
- Instant notifications
- Progress sharing
- Knowledge capture
- Best practice enforcement

### 4. **Productivity Analytics**
- Session analysis
- Developer metrics
- Efficiency tracking
- Continuous improvement

### 5. **Compliance & Audit**
- Complete activity logs
- Change tracking
- Approval workflows
- Audit trails

This comprehensive hook system transforms Claude Code from a individual tool into a team collaboration platform with enterprise-grade safety, monitoring, and workflow management capabilities.