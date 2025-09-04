// PrepFlow Email Service
// Handles automated email sending for lead generation and customer communication

export interface EmailData {
  name: string;
  email: string;
  type: 'sample_dashboard' | 'welcome' | 'purchase_confirmation';
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'hello@prepflow.com';
    this.fromName = process.env.FROM_NAME || 'PrepFlow Team';
  }

  public async sendSampleDashboardEmail(data: EmailData): Promise<boolean> {
    try {
      const template = this.getSampleDashboardTemplate(data);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: [data.email],
          subject: template.subject,
          html: template.html,
          text: template.text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📧 Email sent successfully:', result);
      
      return true;
    } catch (error) {
      console.error('📧 Email sending failed:', error);
      return false;
    }
  }

  private getSampleDashboardTemplate(data: EmailData): EmailTemplate {
    const subject = `Your PrepFlow Sample Dashboard is Ready, ${data.name}! 📊`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PrepFlow Sample Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #29E7CD 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 12px 12px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .dashboard-image {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #29E7CD 0%, #3B82F6 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 4px 12px rgba(41, 231, 205, 0.3);
        }
        .feature-list {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .feature-list ul {
            margin: 0;
            padding-left: 20px;
        }
        .feature-list li {
            margin: 8px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .highlight {
            background: linear-gradient(135deg, #29E7CD 0%, #3B82F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 28px;">Your PrepFlow Sample Dashboard</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Hi ${data.name}, here's what you've been waiting for! 🎉</p>
    </div>
    
    <div class="content">
        <h2 style="color: #2d3748; margin-top: 0;">See Your Menu's Profit Potential</h2>
        
        <p>Thanks for requesting the PrepFlow sample dashboard! This gives you a real taste of how PrepFlow can transform your menu profitability analysis.</p>
        
        <img src="https://prepflow-landing.vercel.app/images/dashboard-screenshot.png" alt="PrepFlow Dashboard Preview" class="dashboard-image">
        
        <h3 style="color: #2d3748;">What You'll Discover:</h3>
        
        <div class="feature-list">
            <ul>
                <li><strong>Contributing Margin Analysis:</strong> See which dishes are actually profitable after all costs</li>
                <li><strong>COGS Tracking:</strong> Monitor ingredient costs and waste in real-time</li>
                <li><strong>Profit Optimization:</strong> Identify opportunities to increase your margins</li>
                <li><strong>Menu Planning:</strong> Make data-driven decisions about your menu</li>
            </ul>
        </div>
        
        <p>This sample shows you exactly how PrepFlow works with real restaurant data. You'll see the same insights that help independent restaurants like yours boost their profitability by 15-30%.</p>
        
        <div style="text-align: center;">
            <a href="https://7495573591101.gumroad.com/l/prepflow" class="cta-button">
                Get Your Full PrepFlow Dashboard →
            </a>
        </div>
        
        <h3 style="color: #2d3748;">Why PrepFlow Works:</h3>
        <p>Built from <span class="highlight">20+ years of real kitchen experience</span>, PrepFlow isn't just another spreadsheet. It's a complete profitability system that:</p>
        
        <ul>
            <li>Calculates true contributing margins (not just gross profit)</li>
            <li>Tracks prep time, waste, and complexity costs</li>
            <li>Provides actionable insights for menu optimization</li>
            <li>Works for cafés, food trucks, and small restaurants</li>
        </ul>
        
        <p><strong>Special Offer:</strong> Get PrepFlow for just <span class="highlight">AUD $29</span> - that's less than the cost of one good meal out, but it could save you thousands in menu optimization.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #29E7CD;">
            <p style="margin: 0; color: #2d3748;"><strong>💡 Pro Tip:</strong> Start with your best-selling items. You might be surprised to find that your "star" dishes aren't your most profitable ones!</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Questions? Reply to this email - I'm here to help!</p>
        <p>PrepFlow Team<br>
        <a href="https://prepflow.com" style="color: #29E7CD;">prepflow.com</a></p>
        <p style="font-size: 12px; margin-top: 20px;">
            You received this email because you requested a sample dashboard.<br>
            No spam. No lock-in. Your data stays private.
        </p>
    </div>
</body>
</html>
    `;
    
    const text = `
Your PrepFlow Sample Dashboard is Ready, ${data.name}! 📊

Hi ${data.name},

Thanks for requesting the PrepFlow sample dashboard! This gives you a real taste of how PrepFlow can transform your menu profitability analysis.

What You'll Discover:
• Contributing Margin Analysis: See which dishes are actually profitable after all costs
• COGS Tracking: Monitor ingredient costs and waste in real-time  
• Profit Optimization: Identify opportunities to increase your margins
• Menu Planning: Make data-driven decisions about your menu

This sample shows you exactly how PrepFlow works with real restaurant data. You'll see the same insights that help independent restaurants like yours boost their profitability by 15-30%.

Get Your Full PrepFlow Dashboard: https://7495573591101.gumroad.com/l/prepflow

Why PrepFlow Works:
Built from 20+ years of real kitchen experience, PrepFlow isn't just another spreadsheet. It's a complete profitability system that:
• Calculates true contributing margins (not just gross profit)
• Tracks prep time, waste, and complexity costs
• Provides actionable insights for menu optimization
• Works for cafés, food trucks, and small restaurants

Special Offer: Get PrepFlow for just AUD $29 - that's less than the cost of one good meal out, but it could save you thousands in menu optimization.

Pro Tip: Start with your best-selling items. You might be surprised to find that your "star" dishes aren't your most profitable ones!

Questions? Reply to this email - I'm here to help!

PrepFlow Team
prepflow.com

You received this email because you requested a sample dashboard.
No spam. No lock-in. Your data stays private.
    `;
    
    return { subject, html, text };
  }
}

// Create singleton instance
export const emailService = new EmailService();

// Export individual functions for easy use
export const sendSampleDashboardEmail = emailService.sendSampleDashboardEmail.bind(emailService);
