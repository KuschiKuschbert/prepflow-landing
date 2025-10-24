# Google Tag Manager Setup Guide for PrepFlow

## 🎯 **Overview**

This guide will help you set up Google Tag Manager (GTM) for your PrepFlow landing page, allowing you to manage all tracking tags without code changes.

## 📋 **Prerequisites**

- Google Analytics 4 property (already configured: `G-W1D5LQXGJT`)
- Access to Google Tag Manager
- Basic understanding of tag management

## 🚀 **Step 1: Create GTM Container**

1. **Go to [Google Tag Manager](https://tagmanager.google.com/)**
2. **Click "Create Account"** (if you don't have one)
3. **Account Setup:**
   - Account Name: `PrepFlow`
   - Country: `Australia`
4. **Container Setup:**
   - Container Name: `PrepFlow Website`
   - Target Platform: `Web`
5. **Click "Create"**

## 🔧 **Step 2: Configure GTM Container**

### **Container Settings:**

- **Container ID**: Copy the `GTM-XXXXXXX` ID
- **Update the `gtm-config.ts` file** with your actual GTM ID

### **Data Layer Variables:**

Create these variables in GTM:

#### **Page Information:**

- `page_title` - Page Title
- `page_location` - Page URL
- `page_path` - Page Path
- `page_referrer` - Referrer URL

#### **User Information:**

- `user_id` - User ID
- `session_id` - Session ID
- `user_agent` - User Agent

#### **Event Information:**

- `event_category` - Event Category
- `event_action` - Event Action
- `event_label` - Event Label
- `event_value` - Event Value

## 🏷️ **Step 3: Create Tags**

### **Google Analytics 4 Configuration Tag:**

1. **Tag Type**: `Google Analytics: GA4 Configuration`
2. **Measurement ID**: `G-W1D5LQXGJT`
3. **Trigger**: `All Pages`
4. **Name**: `GA4 - Configuration`

### **Page View Tag:**

1. **Tag Type**: `Google Analytics: GA4 Event`
2. **Measurement ID**: `G-W1D5LQXGJT`
3. **Event Name**: `page_view`
4. **Trigger**: `Custom Event` → `page_view`
5. **Name**: `GA4 - Page View`

### **Custom Event Tags:**

Create tags for each event type:

#### **Exit Intent Tag:**

- **Tag Type**: `Google Analytics: GA4 Event`
- **Event Name**: `exit_intent`
- **Trigger**: `Custom Event` → `exit_intent`
- **Parameters**: Use data layer variables

#### **Scroll Depth Tag:**

- **Tag Type**: `Google Analytics: GA4 Event`
- **Event Name**: `scroll_depth`
- **Trigger**: `Custom Event` → `scroll_depth`
- **Parameters**: Use data layer variables

#### **A/B Test Tag:**

- **Tag Type**: `Google Analytics: GA4 Event`
- **Event Name**: `variant_assigned`
- **Trigger**: `Custom Event` → `variant_assigned`
- **Parameters**: Use data layer variables

## 🎯 **Step 4: Create Triggers**

### **Page View Trigger:**

- **Trigger Type**: `Custom Event`
- **Event Name**: `page_view`
- **Fire on**: `All Custom Events`

### **Exit Intent Trigger:**

- **Trigger Type**: `Custom Event`
- **Event Name**: `exit_intent`
- **Fire on**: `All Custom Events`

### **Scroll Depth Trigger:**

- **Trigger Type**: `Custom Event`
- **Event Name**: `scroll_depth`
- **Fire on**: `All Custom Events`

### **Section View Trigger:**

- **Trigger Type**: `Custom Event`
- **Event Name**: `section_view`
- **Fire on**: `All Custom Events`

## 🔍 **Step 5: Test Your Setup**

### **Preview Mode:**

1. **Click "Preview"** in GTM
2. **Enter your website URL**
3. **Test various interactions:**
   - Page navigation
   - Scroll behavior
   - Exit intent
   - Button clicks

### **Check Data Layer:**

1. **Open browser console**
2. **Look for GTM logs:**
   - `✅ GTM Data Layer initialized`
   - `📊 GTM Page View tracked`
   - `📤 Data pushed to GTM`

### **Verify in GA4:**

1. **Go to Google Analytics**
2. **Check Real-Time reports**
3. **Verify events are firing**

## 📊 **Step 6: Advanced Configuration**

### **Enhanced Ecommerce:**

- Configure product tracking
- Set up conversion funnels
- Track revenue and transactions

### **User Properties:**

- Set user segments
- Track user behavior
- Configure custom dimensions

### **Conversion Tracking:**

- Set up conversion goals
- Track micro-conversions
- Monitor user journey

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **GTM Not Loading:**

- Check container ID in code
- Verify GTM script is loading
- Check browser console for errors

#### **Events Not Firing:**

- Verify triggers are configured
- Check data layer variables
- Test in preview mode

#### **GA4 Not Receiving Data:**

- Verify measurement ID
- Check tag configuration
- Test with GA4 Debugger

### **Debug Tools:**

- **GTM Preview Mode**
- **GA4 Debugger Chrome Extension**
- **Data Layer Helper Chrome Extension**

## 📈 **Next Steps**

### **Immediate:**

1. **Test all tracking events**
2. **Verify data in GA4**
3. **Set up basic reports**

### **Short-term:**

1. **Create custom dashboards**
2. **Set up conversion goals**
3. **Configure A/B testing**

### **Long-term:**

1. **Advanced user segmentation**
2. **Predictive analytics**
3. **Marketing automation integration**

## 🔗 **Useful Resources**

- [GTM Help Center](https://support.google.com/tagmanager/)
- [GA4 Help Center](https://support.google.com/analytics/)
- [GTM Community](https://support.google.com/tagmanager/community)
- [Data Layer Guide](https://developers.google.com/tag-manager/devguide)

## 📞 **Support**

If you encounter issues:

1. **Check this guide first**
2. **Use GTM Preview mode**
3. **Check browser console logs**
4. **Verify configuration in GTM**

---

**Remember**: GTM gives you the power to manage all your tracking without developer involvement. Start simple and gradually add complexity as you become comfortable with the platform.
