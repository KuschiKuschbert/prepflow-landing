#!/usr/bin/env node

// Performance Report Sender for PrepFlow
// Sends performance reports via webhook, email, or other notification services

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  webhookUrl: process.env.PERFORMANCE_WEBHOOK_URL,
  emailTo: process.env.ALERT_EMAIL_TO,
  slackChannel: process.env.SLACK_CHANNEL || '#performance',
  threshold: {
    critical: 60, // Score below 60 is critical
    warning: 80, // Score below 80 is warning
  },
};

// Read latest performance report
function readLatestReport() {
  const reportsDir = path.join(process.cwd(), 'performance-reports');

  if (!fs.existsSync(reportsDir)) {
    console.error(
      '❌ Performance reports directory not found. Run generate-performance-report.js first.',
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(reportsDir)
    .filter(file => file.startsWith('performance-report-') && file.endsWith('.json'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌ No performance reports found. Run generate-performance-report.js first.');
    process.exit(1);
  }

  const latestFile = files[0];
  const reportPath = path.join(reportsDir, latestFile);

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    console.log(`📊 Loaded report: ${latestFile}`);
    return report;
  } catch (error) {
    console.error('❌ Failed to read performance report:', error.message);
    process.exit(1);
  }
}

// Determine alert level
function getAlertLevel(summary) {
  if (summary.overallScore < CONFIG.threshold.critical) {
    return 'critical';
  } else if (summary.overallScore < CONFIG.threshold.warning) {
    return 'warning';
  } else {
    return 'good';
  }
}

// Generate Slack message
function generateSlackMessage(report) {
  const { summary, recommendations } = report;
  const alertLevel = getAlertLevel(summary);

  const color =
    alertLevel === 'critical' ? '#dc3545' : alertLevel === 'warning' ? '#ffc107' : '#28a745';

  const emoji = alertLevel === 'critical' ? '🚨' : alertLevel === 'warning' ? '⚠️' : '✅';

  const message = {
    text: `${emoji} PrepFlow Performance Report`,
    attachments: [
      {
        color: color,
        title: 'Performance Summary',
        fields: [
          {
            title: 'Overall Score',
            value: `${summary.overallScore}/100`,
            short: true,
          },
          {
            title: 'Status',
            value: alertLevel.toUpperCase(),
            short: true,
          },
          {
            title: 'Timestamp',
            value: summary.timestamp,
            short: false,
          },
        ],
      },
    ],
  };

  // Add Lighthouse scores if available
  if (summary.metrics.lighthouse) {
    message.attachments.push({
      color: color,
      title: 'Lighthouse Scores',
      fields: [
        {
          title: 'Performance',
          value: summary.metrics.lighthouse.performance.toString(),
          short: true,
        },
        {
          title: 'Accessibility',
          value: summary.metrics.lighthouse.accessibility.toString(),
          short: true,
        },
        {
          title: 'Best Practices',
          value: summary.metrics.lighthouse.bestPractices.toString(),
          short: true,
        },
        {
          title: 'SEO',
          value: summary.metrics.lighthouse.seo.toString(),
          short: true,
        },
      ],
    });
  }

  // Add bundle analysis if available
  if (summary.metrics.bundle) {
    message.attachments.push({
      color: color,
      title: 'Bundle Analysis',
      fields: [
        {
          title: 'Total Size',
          value: `${(summary.metrics.bundle.totalSize / 1024).toFixed(1)} KB`,
          short: true,
        },
        {
          title: 'JavaScript',
          value: `${(summary.metrics.bundle.jsSize / 1024).toFixed(1)} KB`,
          short: true,
        },
        {
          title: 'CSS',
          value: `${(summary.metrics.bundle.cssSize / 1024).toFixed(1)} KB`,
          short: true,
        },
        {
          title: 'Images',
          value: `${(summary.metrics.bundle.imageSize / 1024).toFixed(1)} KB`,
          short: true,
        },
      ],
    });
  }

  // Add recommendations if any
  if (recommendations.length > 0) {
    const recText = recommendations
      .slice(0, 3)
      .map(rec => `• ${rec.title} (${rec.priority})`)
      .join('\n');

    message.attachments.push({
      color: color,
      title: 'Top Recommendations',
      text: recText,
      footer:
        recommendations.length > 3 ? `+${recommendations.length - 3} more recommendations` : '',
    });
  }

  return message;
}

// Send webhook notification
function sendWebhookNotification(message) {
  if (!CONFIG.webhookUrl) {
    console.log('⚠️ No webhook URL configured. Skipping webhook notification.');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const url = new URL(CONFIG.webhookUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const postData = JSON.stringify(message);

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = client.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Webhook notification sent successfully');
          resolve();
        } else {
          console.error(`❌ Webhook notification failed: ${res.statusCode} ${data}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', error => {
      console.error('❌ Webhook notification error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Generate email content
function generateEmailContent(report) {
  const { summary, recommendations } = report;
  const alertLevel = getAlertLevel(summary);

  const subject = `PrepFlow Performance Report - ${alertLevel.toUpperCase()}`;

  let body = `PrepFlow Performance Report\n`;
  body += `========================\n\n`;
  body += `Overall Score: ${summary.overallScore}/100\n`;
  body += `Status: ${alertLevel.toUpperCase()}\n`;
  body += `Generated: ${summary.timestamp}\n\n`;

  if (summary.metrics.lighthouse) {
    body += `Lighthouse Scores:\n`;
    body += `- Performance: ${summary.metrics.lighthouse.performance}\n`;
    body += `- Accessibility: ${summary.metrics.lighthouse.accessibility}\n`;
    body += `- Best Practices: ${summary.metrics.lighthouse.bestPractices}\n`;
    body += `- SEO: ${summary.metrics.lighthouse.seo}\n\n`;
  }

  if (summary.metrics.bundle) {
    body += `Bundle Analysis:\n`;
    body += `- Total Size: ${(summary.metrics.bundle.totalSize / 1024).toFixed(1)} KB\n`;
    body += `- JavaScript: ${(summary.metrics.bundle.jsSize / 1024).toFixed(1)} KB\n`;
    body += `- CSS: ${(summary.metrics.bundle.cssSize / 1024).toFixed(1)} KB\n`;
    body += `- Images: ${(summary.metrics.bundle.imageSize / 1024).toFixed(1)} KB\n\n`;
  }

  if (recommendations.length > 0) {
    body += `Recommendations:\n`;
    recommendations.forEach((rec, index) => {
      body += `${index + 1}. ${rec.title} (${rec.priority})\n`;
      body += `   ${rec.description}\n`;
      rec.actions.forEach(action => {
        body += `   - ${action}\n`;
      });
      body += `\n`;
    });
  }

  return { subject, body };
}

// Send email notification (placeholder - would need email service integration)
function sendEmailNotification(emailContent) {
  if (!CONFIG.emailTo) {
    console.log('⚠️ No email address configured. Skipping email notification.');
    return Promise.resolve();
  }

  console.log('📧 Email notification would be sent to:', CONFIG.emailTo);
  console.log('📧 Subject:', emailContent.subject);
  console.log('📧 Body preview:', emailContent.body.substring(0, 200) + '...');

  // In a real implementation, you would integrate with an email service like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Nodemailer with SMTP

  return Promise.resolve();
}

// Main function
async function main() {
  console.log('📤 Sending Performance Report...');

  try {
    // Read latest report
    const report = readLatestReport();

    // Generate notifications
    const slackMessage = generateSlackMessage(report);
    const emailContent = generateEmailContent(report);

    // Send notifications
    await Promise.all([sendWebhookNotification(slackMessage), sendEmailNotification(emailContent)]);

    console.log('\n✅ Performance report sent successfully!');
  } catch (error) {
    console.error('\n❌ Failed to send performance report:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSlackMessage,
  generateEmailContent,
  sendWebhookNotification,
  sendEmailNotification,
};
