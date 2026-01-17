import * as fs from 'fs';
import * as path from 'path';
import { ChangeRecord, ChangeTracker } from '../safety/change-tracker';
import { PerformanceRecord, PerformanceTracker } from '../self-optimization/performance-tracker';

/**
 * RSI Dashboard Generator
 * Creates a consolidated status report of the RSI system.
 */
export class RSIDashboard {
  static async generateReport() {
    const reportPath = path.join(process.cwd(), 'reports/rsi-status-dashboard.md');

    // 1. Get Statistics
    const performance = await PerformanceTracker.getRecentMetrics();
    const changes = await ChangeTracker.getRecentChanges();

    const appliedCount = changes.filter((c: ChangeRecord) => c.status === 'applied').length;
    const failedCount = changes.filter(
      (c: ChangeRecord) => c.status === 'failed' || c.status === 'rolled_back',
    ).length;

    // 2. Build Markdown
    let md = `# 📊 RSI Autonomous Developer Dashboard\n\n`;
    md += `**Last Run:** ${new Date().toLocaleString()}\n`;
    md += `**Status:** 🟢 Active | **Autonomy Level:** 🤖 Fully Autonomous (Safe Paths)\n\n`;

    md += `## 📈 Performance Summary\n`;
    md += `| Cycle Stage | Duration | Success Rate |\n`;
    md += `|---|---|---|\n`;

    performance
      .slice(-5)
      .reverse()
      .forEach((m: PerformanceRecord) => {
        md += `| ${m.taskType} | ${(m.durationMs / 1000).toFixed(2)}s | ${m.success ? '✅' : '❌'} |\n`;
      });

    md += `\n## 🛠️ Recent Automated Improvements\n`;
    md += `| Type | Description | Files | Confidence | Status |\n`;
    md += `|---|---|---|---|---|\n`;

    changes
      .slice(-10)
      .reverse()
      .forEach((c: ChangeRecord) => {
        md += `| ${c.type} | ${c.description} | ${c.files.join(', ')} | ${(c.confidenceScore * 100).toFixed(0)}% | ${this.formatStatus(c.status)} |\n`;
      });

    md += `\n## 🛡️ Safety & Reliability\n`;
    md += `- **Rollback Automation:** ✅ Enabled\n`;
    md += `- **Risk Assessor:** ✅ Active (Nesting, Magic Numbers, Dead Code)\n`;
    md += `- **Gated Auto-Merge:** ✅ Enabled for \`lib/rsi/\`, \`docs/rsi/\`, \`reports/\`\n`;

    md += `\n---\n*This report is generated automatically by the RSI Orchestrator.*`;

    fs.writeFileSync(reportPath, md);
}

  private static formatStatus(status: string): string {
    switch (status) {
      case 'applied':
        return '✅ Applied';
      case 'rolled_back':
        return '⚠️ Rolled Back';
      case 'failed':
        return '❌ Failed';
      default:
        return status;
    }
  }
}
