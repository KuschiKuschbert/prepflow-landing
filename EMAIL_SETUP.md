# Email Service Setup Guide

## Overview
PrepFlow now includes automated email sending for the "Get Sample Dashboard" form. When customers fill out the form, they'll receive a beautiful email with the dashboard screenshot and information about PrepFlow.

## Email Service: Resend
We're using [Resend](https://resend.com) for reliable email delivery. It's modern, developer-friendly, and has excellent deliverability.

## Setup Steps

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key
1. In your Resend dashboard, go to "API Keys"
2. Create a new API key
3. Copy the key (starts with `re_`)

### 3. Configure Environment Variables
Add these to your `.env.local` file:

```bash
# Email Service Configuration
RESEND_API_KEY=re_hpumY9K8_HhSnL3T4DMXqsnHZpkNGzjQv

# Email Configuration
FROM_EMAIL=hello@prepflow.org
FROM_NAME=PrepFlow Team
```

### 4. Verify Domain (Optional but Recommended)
For better deliverability, verify your domain:
1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `prepflow.org`)
3. Follow the DNS setup instructions
4. Update `FROM_EMAIL` to use your verified domain

## Email Template Features

### What Customers Receive:
- **Personalized greeting** with their name
- **Dashboard screenshot** showing PrepFlow in action
- **Feature highlights** explaining what PrepFlow does
- **Call-to-action** to purchase the full version
- **Professional design** with PrepFlow branding
- **Mobile-responsive** layout

### Email Content:
- Subject: "Your PrepFlow Sample Dashboard is Ready, [Name]! 📊"
- HTML and text versions for all email clients
- Includes dashboard image, feature list, and purchase link
- Professional footer with contact information

## Testing

### Local Testing:
1. Set up environment variables
2. Fill out the "Get Sample Dashboard" form
3. Check your email for the automated response
4. Verify the email looks good on different devices

### Production Testing:
1. Deploy to Vercel with environment variables
2. Test with real email addresses
3. Monitor email delivery in Resend dashboard
4. Check spam folder if emails don't arrive

## Troubleshooting

### Common Issues:
- **Email not sending**: Check API key and environment variables
- **Emails in spam**: Verify domain and check email content
- **Images not loading**: Ensure dashboard image URL is accessible
- **API errors**: Check Resend dashboard for error details

### Debug Mode:
The email service includes console logging:
- `📧 Email sent successfully:` - Email was sent
- `📧 Email sending failed:` - Error occurred

## Cost
- **Resend Free Tier**: 3,000 emails/month
- **Resend Pro**: $20/month for 50,000 emails
- **Custom Domain**: Free with any plan

## Security
- API keys are stored securely in environment variables
- No sensitive data is logged
- Email addresses are validated before sending
- GDPR-compliant email practices

## Next Steps
1. Set up Resend account and API key
2. Add environment variables to your deployment
3. Test the email flow
4. Monitor email delivery and engagement
5. Consider setting up email analytics for tracking

## Support
- Resend Documentation: https://resend.com/docs
- PrepFlow Support: Reply to any email from the system
