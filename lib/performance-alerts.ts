// Performance Regression Alerts for PrepFlow
// Implements automated performance monitoring and alerting

// Alert configuration
export const ALERT_CONFIG = {
  // Alert thresholds
  thresholds: {
    lcp: { warning: 2000, critical: 3000 },
    fid: { warning: 80, critical: 120 },
    cls: { warning: 0.08, critical: 0.12 },
    fcp: { warning: 1500, critical: 2000 },
    tti: { warning: 3000, critical: 4000 },
    si: { warning: 2500, critical: 3500 },
    tbt: { warning: 200, critical: 300 },
  },

  // Regression detection
  regression: {
    sensitivity: 0.15, // 15% change triggers regression alert
    minSamples: 10, // Minimum samples for regression detection
    timeWindow: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Alert channels
  channels: {
    console: true,
    analytics: true,
    webhook: false, // Set to true to enable webhook alerts
    email: false, // Set to true to enable email alerts
  },

  // Webhook configuration
  webhook: {
    url: process.env.PERFORMANCE_WEBHOOK_URL || '',
    timeout: 5000,
    retries: 3,
  },

  // Email configuration
  email: {
    to: process.env.ALERT_EMAIL_TO || '',
    from: process.env.ALERT_EMAIL_FROM || 'alerts@prepflow.org',
    subject: 'PrepFlow Performance Alert',
  },
};

// Alert interfaces
export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical' | 'regression';
  metric: string;
  currentValue: number;
  threshold: number;
  previousValue?: number;
  changePercent?: number;
  message: string;
  timestamp: number;
  page: string;
  userId?: string;
  sessionId: string;
  resolved: boolean;
  resolvedAt?: number;
}

export interface PerformanceRegression {
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trend: 'improving' | 'degrading' | 'stable';
  confidence: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'warning' | 'critical';
  enabled: boolean;
  cooldown: number; // Cooldown period in ms
  lastTriggered?: number;
}

// Performance alert manager
export class PerformanceAlertManager {
  private static instance: PerformanceAlertManager;
  private alerts: Map<string, PerformanceAlert> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private performanceHistory: Map<string, PerformanceData[]> = new Map();
  private cooldowns: Map<string, number> = new Map();

  static getInstance(): PerformanceAlertManager {
    if (!PerformanceAlertManager.instance) {
      PerformanceAlertManager.instance = new PerformanceAlertManager();
    }
    return PerformanceAlertManager.instance;
  }

  constructor() {
    this.initializeDefaultRules();
  }

  // Initialize default alert rules
  private initializeDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'lcp_critical',
        name: 'LCP Critical Alert',
        metric: 'lcp',
        condition: 'greater_than',
        threshold: ALERT_CONFIG.thresholds.lcp.critical,
        severity: 'critical',
        enabled: true,
        cooldown: 30 * 60 * 1000, // 30 minutes
      },
      {
        id: 'lcp_warning',
        name: 'LCP Warning Alert',
        metric: 'lcp',
        condition: 'greater_than',
        threshold: ALERT_CONFIG.thresholds.lcp.warning,
        severity: 'warning',
        enabled: true,
        cooldown: 15 * 60 * 1000, // 15 minutes
      },
      {
        id: 'fid_critical',
        name: 'FID Critical Alert',
        metric: 'fid',
        condition: 'greater_than',
        threshold: ALERT_CONFIG.thresholds.fid.critical,
        severity: 'critical',
        enabled: true,
        cooldown: 30 * 60 * 1000,
      },
      {
        id: 'cls_critical',
        name: 'CLS Critical Alert',
        metric: 'cls',
        condition: 'greater_than',
        threshold: ALERT_CONFIG.thresholds.cls.critical,
        severity: 'critical',
        enabled: true,
        cooldown: 30 * 60 * 1000,
      },
    ];

    defaultRules.forEach(rule => {
      this.alertRules.set(rule.id, rule);
    });
  }

  // Check performance metrics and trigger alerts
  checkPerformance(
    metrics: PerformanceMetrics,
    page: string,
    userId?: string,
    sessionId?: string,
  ): void {
    const currentTime = Date.now();
    const actualSessionId = sessionId || this.generateSessionId();

    // Store performance data
    this.storePerformanceData(page, metrics, currentTime);

    // Check alert rules
    this.alertRules.forEach(rule => {
      if (!rule.enabled) return;

      const value = metrics[rule.metric as keyof PerformanceMetrics];
      if (typeof value !== 'number') return;

      // Check cooldown
      if (this.isInCooldown(rule.id, currentTime)) return;

      // Check condition
      if (this.evaluateCondition(value, rule.condition, rule.threshold)) {
        this.triggerAlert(rule, value, page, userId, actualSessionId, currentTime);
        this.setCooldown(rule.id, currentTime + rule.cooldown);
      }
    });

    // Check for regressions
    this.checkRegressions(page, metrics, currentTime);
  }

  // Check for performance regressions
  private checkRegressions(page: string, metrics: PerformanceMetrics, timestamp: number): void {
    const history = this.performanceHistory.get(page) || [];
    const recentHistory = history.filter(
      data => timestamp - data.timestamp < ALERT_CONFIG.regression.timeWindow,
    );

    if (recentHistory.length < ALERT_CONFIG.regression.minSamples) return;

    // Calculate baseline performance
    const baseline = this.calculateBaseline(recentHistory);

    // Check each metric for regression
    Object.keys(metrics).forEach(metric => {
      const currentValue = metrics[metric as keyof PerformanceMetrics];
      if (typeof currentValue !== 'number') return;

      const baselineValue = baseline[metric as keyof typeof baseline];
      if (typeof baselineValue !== 'number') return;

      const changePercent = ((currentValue - baselineValue) / baselineValue) * 100;

      if (Math.abs(changePercent) >= ALERT_CONFIG.regression.sensitivity * 100) {
        const regression: PerformanceRegression = {
          metric,
          currentValue,
          previousValue: baselineValue,
          changePercent,
          severity: this.getRegressionSeverity(changePercent),
          trend: changePercent > 0 ? 'degrading' : 'improving',
          confidence: this.calculateRegressionConfidence(recentHistory, metric),
        };

        this.triggerRegressionAlert(regression, page, timestamp);
      }
    });
  }

  // Calculate baseline performance
  private calculateBaseline(history: PerformanceData[]): Record<string, number> {
    const baseline: Record<string, number> = {};

    // Group by metric
    const metrics: Record<string, number[]> = {};
    history.forEach(data => {
      Object.keys(data.metrics).forEach(metric => {
        const value = data.metrics[metric as keyof PerformanceMetrics];
        if (typeof value === 'number') {
          if (!metrics[metric]) metrics[metric] = [];
          metrics[metric].push(value);
        }
      });
    });

    // Calculate median for each metric
    Object.keys(metrics).forEach(metric => {
      const values = metrics[metric].sort((a, b) => a - b);
      const mid = Math.floor(values.length / 2);
      baseline[metric] =
        values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
    });

    return baseline;
  }

  // Get regression severity
  private getRegressionSeverity(changePercent: number): 'low' | 'medium' | 'high' | 'critical' {
    const absChange = Math.abs(changePercent);

    if (absChange >= 50) return 'critical';
    if (absChange >= 30) return 'high';
    if (absChange >= 15) return 'medium';
    return 'low';
  }

  // Calculate regression confidence
  private calculateRegressionConfidence(history: PerformanceData[], metric: string): number {
    const values = history
      .map(data => data.metrics[metric as keyof PerformanceMetrics])
      .filter(value => typeof value === 'number') as number[];

    if (values.length < 3) return 0.5;

    // Calculate coefficient of variation
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean;

    // Higher confidence for lower variation
    return Math.max(0.5, 1 - cv);
  }

  // Trigger alert
  private triggerAlert(
    rule: AlertRule,
    value: number,
    page: string,
    userId?: string,
    sessionId?: string,
    timestamp?: number,
  ): void {
    const alertId = this.generateAlertId();
    const actualTimestamp = timestamp || Date.now();

    const alert: PerformanceAlert = {
      id: alertId,
      type: rule.severity,
      metric: rule.metric,
      currentValue: value,
      threshold: rule.threshold,
      message: `${rule.name}: ${rule.metric} = ${value} (threshold: ${rule.threshold})`,
      timestamp: actualTimestamp,
      page,
      userId,
      sessionId: sessionId || this.generateSessionId(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);

    // Send alert
    this.sendAlert(alert);

    console.warn(`🚨 Performance Alert: ${alert.message}`);
  }

  // Trigger regression alert
  private triggerRegressionAlert(
    regression: PerformanceRegression,
    page: string,
    timestamp: number,
  ): void {
    const alertId = this.generateAlertId();

    const alert: PerformanceAlert = {
      id: alertId,
      type: 'regression',
      metric: regression.metric,
      currentValue: regression.currentValue,
      threshold: regression.previousValue,
      previousValue: regression.previousValue,
      changePercent: regression.changePercent,
      message: `Performance Regression: ${regression.metric} ${regression.trend} by ${regression.changePercent.toFixed(1)}% (${regression.currentValue} vs ${regression.previousValue})`,
      timestamp,
      page,
      sessionId: this.generateSessionId(),
      resolved: false,
    };

    this.alerts.set(alertId, alert);

    // Send alert
    this.sendAlert(alert);

    console.warn(`📉 Performance Regression: ${alert.message}`);
  }

  // Send alert through configured channels
  private sendAlert(alert: PerformanceAlert): void {
    // Console alert
    if (ALERT_CONFIG.channels.console) {
      this.sendConsoleAlert(alert);
    }

    // Analytics alert
    if (ALERT_CONFIG.channels.analytics) {
      this.sendAnalyticsAlert(alert);
    }

    // Webhook alert
    if (ALERT_CONFIG.channels.webhook && ALERT_CONFIG.webhook.url) {
      this.sendWebhookAlert(alert);
    }

    // Email alert
    if (ALERT_CONFIG.channels.email && ALERT_CONFIG.email.to) {
      this.sendEmailAlert(alert);
    }
  }

  // Send console alert
  private sendConsoleAlert(alert: PerformanceAlert): void {
    const emoji = alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : '📉';
    console.error(`${emoji} ${alert.message} (${alert.page})`);
  }

  // Send analytics alert
  private sendAnalyticsAlert(alert: PerformanceAlert): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_alert', {
        event_category: 'performance',
        event_label: alert.type,
        value: Math.round(alert.currentValue),
        custom_parameter_alert_id: alert.id,
        custom_parameter_metric: alert.metric,
        custom_parameter_threshold: alert.threshold,
        custom_parameter_page: alert.page,
        custom_parameter_change_percent: alert.changePercent,
      });
    }
  }

  // Send webhook alert
  private sendWebhookAlert(alert: PerformanceAlert): void {
    if (!ALERT_CONFIG.webhook.url) return;

    fetch(ALERT_CONFIG.webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    }).catch(error => {
      console.error('Failed to send webhook alert:', error);
    });
  }

  // Send email alert
  private sendEmailAlert(alert: PerformanceAlert): void {
    // In a real implementation, you'd use an email service
    console.log(`📧 Email alert would be sent: ${alert.message}`);
  }

  // Evaluate alert condition
  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'greater_than':
        return value > threshold;
      case 'less_than':
        return value < threshold;
      case 'equals':
        return value === threshold;
      case 'not_equals':
        return value !== threshold;
      default:
        return false;
    }
  }

  // Check if rule is in cooldown
  private isInCooldown(ruleId: string, currentTime: number): boolean {
    const cooldownEnd = this.cooldowns.get(ruleId);
    return cooldownEnd ? currentTime < cooldownEnd : false;
  }

  // Set cooldown for rule
  private setCooldown(ruleId: string, cooldownEnd: number): void {
    this.cooldowns.set(ruleId, cooldownEnd);
  }

  // Store performance data
  private storePerformanceData(page: string, metrics: PerformanceMetrics, timestamp: number): void {
    const data: PerformanceData = {
      metrics,
      timestamp,
    };

    const history = this.performanceHistory.get(page) || [];
    history.push(data);

    // Keep only recent data
    const cutoff = timestamp - ALERT_CONFIG.regression.timeWindow;
    const recentHistory = history.filter(d => d.timestamp > cutoff);

    this.performanceHistory.set(page, recentHistory);
  }

  // Generate alert ID
  private generateAlertId(): string {
    return 'alert_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Generate session ID
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  // Get all alerts
  getAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values());
  }

  // Get active alerts
  getActiveAlerts(): PerformanceAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  // Resolve alert
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = Date.now();

    console.log(`✅ Alert resolved: ${alert.message}`);
    return true;
  }

  // Add custom alert rule
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
  }

  // Remove alert rule
  removeAlertRule(ruleId: string): boolean {
    return this.alertRules.delete(ruleId);
  }

  // Get alert rules
  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  // Get performance history
  getPerformanceHistory(page: string): PerformanceData[] {
    return this.performanceHistory.get(page) || [];
  }

  // Clear old alerts
  clearOldAlerts(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;

    for (const [id, alert] of this.alerts) {
      if (alert.timestamp < cutoff) {
        this.alerts.delete(id);
      }
    }
  }
}

// Performance data interface
interface PerformanceData {
  metrics: PerformanceMetrics;
  timestamp: number;
}

// Performance metrics interface
interface PerformanceMetrics {
  lcp?: number | null;
  fid?: number | null;
  cls?: number | null;
  fcp?: number | null;
  tti?: number | null;
  si?: number | null;
  tbt?: number | null;
  score?: number | null;
}

// Export singleton instance
export const performanceAlertManager = PerformanceAlertManager.getInstance();

// Initialize performance alerts
export function initializePerformanceAlerts(): void {
  console.log('🚨 Initializing Performance Alerts...');

  // Clear old alerts on startup
  performanceAlertManager.clearOldAlerts();

  console.log('✅ Performance Alerts initialized');
}

// Check performance and trigger alerts
export function checkPerformanceAndAlert(
  metrics: PerformanceMetrics,
  page: string,
  userId?: string,
  sessionId?: string,
): void {
  performanceAlertManager.checkPerformance(metrics, page, userId, sessionId);
}

// Get performance alerts
export function getPerformanceAlerts(): PerformanceAlert[] {
  return performanceAlertManager.getAlerts();
}

// Resolve performance alert
export function resolvePerformanceAlert(alertId: string): boolean {
  return performanceAlertManager.resolveAlert(alertId);
}
