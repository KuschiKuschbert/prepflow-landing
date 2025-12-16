# Accessibility Compliance Documentation

## Overview

PrepFlow is committed to providing an accessible platform that complies with the Americans with Disabilities Act (ADA) and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

## Compliance Status

**Target:** WCAG 2.1 Level AA compliance
**Current Status:** ⚠️ In Progress
**Last Audit:** [Date of last audit]

## Testing

### Automated Testing

Run accessibility tests:

```bash
npm run test:accessibility
```

This will:

- Test all key pages with Lighthouse accessibility audit
- Scan codebase for common accessibility issues
- Generate detailed report in `accessibility-reports/`

### Manual Testing Checklist

- [ ] **Keyboard Navigation**
  - [ ] All interactive elements accessible via Tab/Shift+Tab
  - [ ] Focus order is logical
  - [ ] Focus indicators are visible
  - [ ] No keyboard traps

- [ ] **Screen Reader Testing**
  - [ ] Test with NVDA (Windows)
  - [ ] Test with JAWS (Windows)
  - [ ] Test with VoiceOver (macOS/iOS)
  - [ ] All content is announced correctly
  - [ ] Form labels are announced
  - [ ] Error messages are announced

- [ ] **Color Contrast**
  - [ ] Text contrast ratio ≥ 4.5:1 (normal text)
  - [ ] Text contrast ratio ≥ 3:1 (large text)
  - [ ] Interactive elements have sufficient contrast
  - [ ] Color is not the only means of conveying information

- [ ] **Images**
  - [ ] All images have alt text
  - [ ] Decorative images have empty alt text (`alt=""`)
  - [ ] Complex images have detailed descriptions

- [ ] **Forms**
  - [ ] All inputs have associated labels
  - [ ] Error messages are clear and associated with inputs
  - [ ] Required fields are indicated
  - [ ] Form validation is accessible

- [ ] **Navigation**
  - [ ] Skip links are available
  - [ ] Headings are properly structured (h1 → h2 → h3)
  - [ ] Landmarks are used correctly (nav, main, aside)
  - [ ] Breadcrumbs are accessible

## Common Issues and Fixes

### Missing Alt Text

**Issue:** Images without alt text
**Fix:** Add `alt` attribute to all `<img>` and `<Image>` components

```tsx
// ❌ Bad
<img src="/logo.png" />

// ✅ Good
<img src="/logo.png" alt="PrepFlow Logo" />
```

### Missing ARIA Labels

**Issue:** Icon-only buttons without labels
**Fix:** Add `aria-label` to icon buttons

```tsx
// ❌ Bad
<button onClick={handleDelete}>
  <Trash2 />
</button>

// ✅ Good
<button onClick={handleDelete} aria-label="Delete item">
  <Trash2 />
</button>
```

### Missing Form Labels

**Issue:** Input fields without labels
**Fix:** Associate labels with inputs using `htmlFor` and `id`

```tsx
// ❌ Bad
<input type="text" name="email" />

// ✅ Good
<label htmlFor="email">Email</label>
<input type="text" id="email" name="email" />
```

### Color Contrast

**Issue:** Text color doesn't meet contrast requirements
**Fix:** Use sufficient contrast ratios

- Normal text: ≥ 4.5:1
- Large text (18px+): ≥ 3:1
- Interactive elements: ≥ 3:1

### Focus Indicators

**Issue:** Focus indicators not visible
**Fix:** Ensure focus rings are visible

```tsx
// ✅ Good - Cyber Carrot focus ring
className = 'focus:ring-2 focus:ring-[#29E7CD] focus:outline-none';
```

## Implementation Guidelines

### ARIA Labels

- Use `aria-label` for icon-only buttons
- Use `aria-labelledby` to reference visible text
- Use `aria-describedby` for additional descriptions
- Use `aria-hidden="true"` for decorative icons

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use proper focus management in modals (focus trap)
- Return focus to trigger element when modal closes
- Support Escape key to close modals

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`)
- Use `<button>` for actions, not `<div>` with onClick
- Use `<a>` for navigation, not `<div>` with onClick

### Form Accessibility

- Associate labels with inputs using `htmlFor` and `id`
- Group related inputs with `<fieldset>` and `<legend>`
- Provide clear error messages
- Indicate required fields with `aria-required="true"`

## Testing Tools

### Automated Tools

- **Lighthouse:** Built into Chrome DevTools, tests accessibility
- **axe DevTools:** Browser extension for accessibility testing
- **WAVE:** Web accessibility evaluation tool
- **Pa11y:** Command-line accessibility testing

### Manual Testing

- **NVDA:** Free screen reader for Windows
- **JAWS:** Commercial screen reader for Windows
- **VoiceOver:** Built-in screen reader for macOS/iOS
- **Keyboard Navigation:** Test with Tab, Shift+Tab, Enter, Space, Arrow keys

## Reporting Issues

If you find accessibility issues:

1. Document the issue (page, element, problem)
2. Test with screen reader if applicable
3. Report via GitHub issue or contact support
4. Include steps to reproduce

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Compliance Goals

- **Q1 2025:** Achieve WCAG 2.1 AA compliance
- **Ongoing:** Regular accessibility audits
- **Continuous:** Fix accessibility issues as they're discovered




