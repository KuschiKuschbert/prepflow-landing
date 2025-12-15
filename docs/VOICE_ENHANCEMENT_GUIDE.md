# Voice Enhancement Guide for Dialogs, Dropdowns & Input Fields

**Status:** MANDATORY STANDARD
**Applies To:** ALL code (existing and new)
**Last Updated:** January 2025

## Overview

This guide is the **authoritative reference** for implementing PrepFlow's cheeky kitchen humor voice in user-facing UI elements: dialog boxes, dropdown menus, and input fields. All new code MUST follow these patterns, and existing code should be updated to match these standards.

**See Also:**

- `.cursor/rules/dialogs.mdc` - Core dialog standards and PrepFlow voice principles
- `.cursor/rules/development.mdc` - Development standards including voice guidelines
- `lib/personality/content.ts` - Personality system content pools for error messages

---

## 1. Core Voice Principles (Quick Reference)

### Tone

**Professional but friendly, kitchen-themed metaphors when appropriate, clear and direct.**

### Do's

- ✅ Use kitchen/chef metaphors naturally ("start fresh", "all the trimmings", "can't undo this one")
- ✅ Be clear about consequences ("All temperature logs go with it", "All dishes will be unassigned")
- ✅ Keep it concise but informative
- ✅ Use contractions ("can't", "won't", "you'll") for natural speech
- ✅ Add personality without being unprofessional
- ✅ Reference the action clearly ("Delete this equipment?", "Disconnect Google Drive?")

### Don'ts

- ❌ Overuse emojis (we're professional, not a text message)
- ❌ Be overly casual ("yo", "dude", etc.)
- ❌ Make jokes at the user's expense
- ❌ Be vague about consequences
- ❌ Use technical jargon unnecessarily
- ❌ Be overly dramatic ("⚠️ DANGER! ⚠️")

### Key Phrases & Metaphors

- **Kitchen terms:** mise en place, walk-in, 86 (remove), bin it, prep, service
- **Chef references:** "chef", "cook", "kitchen"
- **Natural contractions:** can't, won't, you'll, don't, doesn't, it's, that's
- **Friendly directness:** "Give me...", "That's not...", "Ready to...", "Let's..."

---

## 2. Dialog Box Enhancements

### 2.1 Button Labels

#### Default Button Label Replacements

**ConfirmDialog Defaults:**

- ❌ `confirmLabel = 'Confirm'` → ✅ Use context-specific labels (see below)
- ❌ `cancelLabel = 'Cancel'` → ✅ Use "Never Mind", "Back Out", or "Keep It" when appropriate

**InputDialog Defaults:**

- ❌ `confirmLabel = 'OK'` → ✅ Use "Save", "Add It", "Done", or "Let's Go"
- ❌ `cancelLabel = 'Cancel'` → ✅ Use "Cancel", "Never Mind", or "Skip"

#### Context-Specific Button Labels

**For Delete/Danger Actions:**

```typescript
confirmLabel: 'Delete'; // Standard delete
confirmLabel: '86 It'; // Kitchen slang (like roster removal)
confirmLabel: 'Bin It'; // Casual delete
confirmLabel: 'Remove'; // Formal delete
cancelLabel: 'Keep It'; // Friendly alternative
cancelLabel: 'Never Mind'; // Casual alternative
cancelLabel: 'Back Out'; // When emphasizing finality
```

**For Warning Actions:**

```typescript
confirmLabel: 'Do It'; // Casual proceed
confirmLabel: 'Proceed'; // Standard proceed
confirmLabel: "Let's Go"; // Enthusiastic proceed
cancelLabel: 'Cancel'; // Standard
cancelLabel: 'Never Mind'; // Casual alternative
```

**For Info Actions:**

```typescript
confirmLabel: 'Got It'; // Acknowledgment
confirmLabel: 'Sounds Good'; // Agreement
confirmLabel: "Let's Do It"; // Enthusiastic agreement
cancelLabel: 'Cancel'; // Standard
cancelLabel: 'Not Now'; // Deferral
```

**For Input Dialogs:**

```typescript
confirmLabel: 'Save'; // Save action
confirmLabel: 'Add It'; // Add action
confirmLabel: 'Done'; // Completion
confirmLabel: "Let's Go"; // Enthusiastic
cancelLabel: 'Cancel'; // Standard
cancelLabel: 'Skip'; // Optional input
```

### 2.2 Dialog Titles

#### Before/After Examples

**Delete Actions:**

```typescript
// ❌ Before
title: `Delete ${count} Ingredient${count > 1 ? 's' : ''}?`;

// ✅ After
title: `Bin ${count} Ingredient${count > 1 ? 's' : ''}?`;
title: `86 ${count} Ingredient${count > 1 ? 's' : ''}?`; // Kitchen slang
title: `Remove ${itemName}?`;
```

**Update Actions:**

```typescript
// ❌ Before
title: 'Update Supplier';
title: 'Update Storage Location';
title: 'Update Wastage Percentage';

// ✅ After
title: 'Change Supplier';
title: 'Move Ingredients';
title: 'Set Wastage';
title: 'Adjust Storage';
```

**Input Actions:**

```typescript
// ❌ Before
title: 'Enter Recipe Name';
title: 'Enter Percentage';

// ✅ After
title: 'Name This Recipe';
title: 'What Should We Call This?';
title: 'Set Percentage';
```

### 2.3 Dialog Messages

#### Current Examples from Codebase (Enhanced)

**Bulk Delete Confirmation:**

```typescript
// ❌ Current
title: `Delete ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}?`;
message: `Delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This action can't be undone. Last chance to back out.`;

// ✅ Enhanced
title: `Bin ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}?`;
message: `Ready to 86 ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This can't be undone, chef. Last chance to back out.`;
```

**Update Supplier:**

```typescript
// ❌ Current
title: 'Update Supplier';
message: `What supplier should these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} use?`;
placeholder: 'Supplier name';

// ✅ Enhanced
title: 'Change Supplier';
message: `Who's supplying these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} now, chef?`;
placeholder: 'e.g., Fresh Market Co.';
```

**Update Storage Location:**

```typescript
// ❌ Current
title: 'Update Storage Location';
message: `Where should these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} be stored?`;
placeholder: 'Storage location';

// ✅ Enhanced
title: 'Move Ingredients';
message: `Where are we storing these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} now, chef?`;
placeholder: 'e.g., Walk-in, Dry Store, Freezer';
```

**Wastage Percentage:**

```typescript
// ❌ Current
title: 'Update Wastage Percentage';
message: `What wastage percentage (0-100) for these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}?`;
placeholder: '0-100';

// ✅ Enhanced
title: 'Set Wastage';
message: `What's the wastage percentage for these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? Give me a number between 0 and 100, chef.`;
placeholder: 'e.g., 5';
```

**Employee Removal (Already Good Example):**

```typescript
// ✅ Good Example (from RosterBuilder.tsx)
title: 'Remove Employee from Roster';
message: `Are you sure you want to 86 ${employeeName} from this week's roster?${employeeShifts.length > 0 ? ` This will delete all ${employeeShifts.length} shift${employeeShifts.length > 1 ? 's' : ''} for this week's roster.` : ''} This action cannot be undone.`;
confirmLabel: '86 Them';
```

#### Message Patterns for Common Scenarios

**Delete Single Item:**

```typescript
message: `Delete this ${itemName}? This can't be undone, chef. Last chance to back out.`;
// or
message: `Ready to 86 this ${itemName}? This action can't be undone.`;
```

**Delete Multiple Items:**

```typescript
message: `Ready to 86 ${count} ${itemType}${count > 1 ? 's' : ''}? This can't be undone, chef. Last chance to back out.`;
```

**Disconnect/Remove Connection:**

```typescript
message: `Disconnect ${serviceName}? You'll need to reconnect if you want to ${useCase} later.`;
```

**Populate/Generate Data:**

```typescript
message: `Generate sample data? This will add test ${dataType} to your ${location}.`;
```

---

## 3. Dropdown Menu Enhancements

### 3.1 Placeholder Text

#### Current "Select..." Patterns → Kitchen-Themed Alternatives

**Employee Selection:**

```typescript
// ❌ Current
<option value="">Select an employee</option>

// ✅ Enhanced
<option value="">Who's on this shift?</option>
// or
<option value="">Pick your team member</option>
// or
<option value="">Choose an employee</option>
```

**Area Selection:**

```typescript
// ❌ Current
<option value="">Select an area</option>

// ✅ Enhanced
<option value="">Which area needs cleaning?</option>
// or
<option value="">Pick an area</option>
// or
<option value="">Where are we cleaning?</option>
```

**Equipment Type Selection:**

```typescript
// ❌ Current
<option value="">Select type...</option>

// ✅ Enhanced
<option value="">What kind of equipment?</option>
// or
<option value="">Equipment type?</option>
```

**Supplier Selection:**

```typescript
// ❌ Current
<option value="">Select supplier</option>

// ✅ Enhanced
<option value="">Who's supplying this?</option>
// or
<option value="">Pick a supplier</option>
```

**Storage Location Selection:**

```typescript
// ❌ Current
<option value="">Select storage location</option>

// ✅ Enhanced
<option value="">Where's this stored?</option>
// or
<option value="">Storage location?</option>
// or
<option value="">Walk-in, Dry Store, or Freezer?</option>
```

### 3.2 Loading States

**Current Loading Text:**

```typescript
// ❌ Current
<option value="">Loading areas...</option>
<option value="">Loading employees...</option>

// ✅ Enhanced (keep simple, but can add personality)
<option value="">Loading areas...</option>  // This is fine
// or
<option value="">Getting areas ready...</option>
```

---

## 4. Input Field Enhancements

### 4.1 Placeholder Text

#### Current Generic Placeholders → Descriptive Kitchen-Themed Alternatives

**Supplier Name:**

```typescript
// ❌ Current
placeholder: 'Supplier name';

// ✅ Enhanced
placeholder: 'e.g., Fresh Market Co.';
// or
placeholder: 'Who supplies this?';
```

**Storage Location:**

```typescript
// ❌ Current
placeholder: 'Storage location';

// ✅ Enhanced
placeholder: 'e.g., Walk-in, Dry Store, Freezer';
// or
placeholder: 'Where is this stored?';
```

**Recipe Name:**

```typescript
// ❌ Current
placeholder: 'Recipe name';

// ✅ Enhanced
placeholder: 'e.g., Classic Margherita Pizza';
// or
placeholder: 'What are we calling this?';
```

**Percentage:**

```typescript
// ❌ Current
placeholder: '0-100';

// ✅ Enhanced
placeholder: 'e.g., 5';
// or
placeholder: 'Enter percentage (0-100)';
```

**Equipment Name:**

```typescript
// ❌ Current
placeholder: 'e.g., Main Fridge';

// ✅ Enhanced (already good, but can enhance)
placeholder: 'e.g., Main Walk-in Fridge';
// or
placeholder: 'What should we call this?';
```

### 4.2 Validation Messages

#### Current Technical Messages → Friendly Kitchen-Themed Error Messages

**Required Field:**

```typescript
// ❌ Current
validation: v => (v.trim().length > 0 ? null : 'Supplier name is required');
// or
('This field is required');

// ✅ Enhanced
validation: v => (v.trim().length > 0 ? null : 'We need this, chef.');
// or
validation: v => (v.trim().length > 0 ? null : 'Give us a supplier name, chef.');
// or
validation: v => (v.trim().length > 0 ? null : "This can't be empty, chef.");
```

**Invalid Number:**

```typescript
// ❌ Current
'Please enter a valid number';

// ✅ Enhanced
'That\'s not a number, chef. Try again.';
// or
'Give me a number, chef.';
```

**Out of Range (Minimum):**

```typescript
// ❌ Current
`Value must be at least ${min}`
// ✅ Enhanced
`Too low, chef. Needs to be at least ${min}.`
// or
`That\'s too small. Give me at least ${min}, chef.`;
```

**Out of Range (Maximum):**

```typescript
// ❌ Current
`Value must be at most ${max}`
// ✅ Enhanced
`Too high, chef. Can't be more than ${max}.`
// or
`That\'s too big. Maximum is ${max}, chef.`;
```

**Invalid Percentage (Already Good Example):**

```typescript
// ✅ Good Example (from IngredientActions.tsx)
validation: v => {
  const num = parseFloat(v);
  if (isNaN(num) || num < 0 || num > 100) {
    return 'Please enter a valid percentage between 0 and 100';
  }
  return null;
};
// Enhanced version:
return "That's not a valid percentage. Give me something between 0 and 100, chef.";
```

**Duplicate/Already Exists:**

```typescript
// ❌ Current
'This already exists';

// ✅ Enhanced (from personality system)
'That ingredient name already exists. Great minds think alike?';
// or
'Already exists. Check your list, chef.';
// or
'Duplicate detected. Like finding two spoons in the same spot.';
```

---

## 5. Code Examples

### 5.1 Dialog Implementation Patterns

#### Complete Before/After Code Example: Bulk Delete

**Before:**

```typescript
const confirmed = await showConfirm({
  title: `Delete ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}?`,
  message: `Delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This action can't be undone. Last chance to back out.`,
  variant: 'danger',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
});
```

**After:**

```typescript
const confirmed = await showConfirm({
  title: `Bin ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}?`,
  message: `Ready to 86 ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This can't be undone, chef. Last chance to back out.`,
  variant: 'danger',
  confirmLabel: '86 It',
  cancelLabel: 'Keep It',
});
```

#### Complete Before/After Code Example: Update Supplier

**Before:**

```typescript
const newSupplier = await showPrompt({
  title: 'Update Supplier',
  message: `What supplier should these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} use?`,
  placeholder: 'Supplier name',
  type: 'text',
  validation: v => (v.trim().length > 0 ? null : 'Supplier name is required'),
});
```

**After:**

```typescript
const newSupplier = await showPrompt({
  title: 'Change Supplier',
  message: `Who's supplying these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} now, chef?`,
  placeholder: 'e.g., Fresh Market Co.',
  type: 'text',
  validation: v => (v.trim().length > 0 ? null : 'We need a supplier name, chef.'),
  confirmLabel: 'Save',
  cancelLabel: 'Cancel',
});
```

#### Complete Before/After Code Example: Wastage Percentage

**Before:**

```typescript
const wastageInput = await showPrompt({
  title: 'Update Wastage Percentage',
  message: `What wastage percentage (0-100) for these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}?`,
  placeholder: '0-100',
  type: 'number',
  min: 0,
  max: 100,
  validation: v => {
    const num = parseFloat(v);
    if (isNaN(num) || num < 0 || num > 100) {
      return 'Please enter a valid percentage between 0 and 100';
    }
    return null;
  },
});
```

**After:**

```typescript
const wastageInput = await showPrompt({
  title: 'Set Wastage',
  message: `What's the wastage percentage for these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? Give me a number between 0 and 100, chef.`,
  placeholder: 'e.g., 5',
  type: 'number',
  min: 0,
  max: 100,
  validation: v => {
    const num = parseFloat(v);
    if (isNaN(num) || num < 0 || num > 100) {
      return "That's not a valid percentage. Give me something between 0 and 100, chef.";
    }
    return null;
  },
  confirmLabel: 'Save',
  cancelLabel: 'Cancel',
});
```

### 5.2 Dropdown Implementation Patterns

#### Select Element Example

**Before:**

```typescript
<select
  value={selectedArea}
  onChange={e => setSelectedArea(e.target.value)}
  required
>
  <option value="">Select an area</option>
  {areas.map(area => (
    <option key={area.id} value={area.id}>
      {area.area_name}
    </option>
  ))}
</select>
```

**After:**

```typescript
<select
  value={selectedArea}
  onChange={e => setSelectedArea(e.target.value)}
  required
>
  <option value="">Which area needs cleaning?</option>
  {areas.map(area => (
    <option key={area.id} value={area.id}>
      {area.area_name}
    </option>
  ))}
</select>
```

### 5.3 Input Implementation Patterns

#### Input Field with Validation Example

**Before:**

```typescript
<input
  type="text"
  placeholder="Supplier name"
  value={supplier}
  onChange={e => setSupplier(e.target.value)}
  required
/>
```

**After:**

```typescript
<input
  type="text"
  placeholder="e.g., Fresh Market Co."
  value={supplier}
  onChange={e => setSupplier(e.target.value)}
  required
  aria-label="Supplier name"
/>
```

#### Validation Function Example

**Before:**

```typescript
const validateSupplier = (value: string): string | null => {
  if (!value.trim()) {
    return 'Supplier name is required';
  }
  return null;
};
```

**After:**

```typescript
const validateSupplier = (value: string): string | null => {
  if (!value.trim()) {
    return 'We need a supplier name, chef.';
  }
  return null;
};
```

---

## 6. Implementation Checklist

### Files to Update (Priority Order)

#### High Priority (Most User-Facing)

1. **Dialog Components**
   - `components/ui/ConfirmDialog.tsx` - Update default button labels
   - `components/ui/InputDialog.tsx` - Update default button labels and validation messages
   - `hooks/useConfirm.tsx` - Update example in JSDoc
   - `hooks/usePrompt.tsx` - Update example in JSDoc

2. **Ingredient Management**
   - `app/webapp/ingredients/components/IngredientActions.tsx` - Bulk actions dialogs
   - `app/webapp/ingredients/components/IngredientTableDialogs.tsx` - Table dialogs

3. **Roster Management**
   - `app/webapp/roster/components/RosterBuilder.tsx` - Already has good example ("86 Them")
   - `app/webapp/roster/components/ShiftForm.tsx` - Employee dropdown

4. **Cleaning Management**
   - `app/webapp/cleaning/components/CreateTaskForm.tsx` - Area dropdown
   - `app/webapp/cleaning/components/AreaTasksModal.tsx` - Confirmation dialogs

#### Medium Priority

5. **Settings & Setup**
   - `app/webapp/settings/components/PrivacyControlsPanel.tsx` - Account deletion dialogs
   - `app/webapp/setup/components/*.tsx` - Setup dialogs

6. **Temperature Management**
   - `app/webapp/temperature/components/TemperatureEquipmentTab.tsx` - Equipment dialogs

#### Low Priority (Gradual Enhancement)

7. **Other Components**
   - All other components using dialogs, dropdowns, or input fields
   - Update as you encounter them during development

### Testing Considerations

- **Voice Consistency:** Run `npm run cleanup:check` to check voice consistency
- **Accessibility:** Ensure all changes maintain accessibility (ARIA labels, keyboard navigation)
- **User Testing:** Test with actual users to ensure voice feels natural, not forced
- **Context Appropriateness:** Ensure kitchen metaphors fit the context (don't force them)

---

## 7. Quick Reference Tables

### Button Label Quick Reference

| Context          | Confirm Label               | Cancel Label                        |
| ---------------- | --------------------------- | ----------------------------------- |
| Delete (danger)  | "Delete", "86 It", "Bin It" | "Keep It", "Never Mind", "Back Out" |
| Update (warning) | "Save", "Do It", "Proceed"  | "Cancel", "Never Mind"              |
| Input (info)     | "Save", "Add It", "Done"    | "Cancel", "Skip"                    |
| Confirm (info)   | "Got It", "Sounds Good"     | "Cancel", "Not Now"                 |

### Placeholder Quick Reference

| Field Type | Current              | Enhanced                         |
| ---------- | -------------------- | -------------------------------- |
| Employee   | "Select an employee" | "Who's on this shift?"           |
| Area       | "Select an area"     | "Which area needs cleaning?"     |
| Supplier   | "Supplier name"      | "e.g., Fresh Market Co."         |
| Storage    | "Storage location"   | "e.g., Walk-in, Dry Store"       |
| Recipe     | "Recipe name"        | "e.g., Classic Margherita Pizza" |
| Percentage | "0-100"              | "e.g., 5"                        |

### Validation Message Quick Reference

| Error Type         | Current                              | Enhanced                                                                    |
| ------------------ | ------------------------------------ | --------------------------------------------------------------------------- |
| Required           | "This field is required"             | "We need this, chef."                                                       |
| Invalid number     | "Please enter a valid number"        | "That's not a number, chef. Try again."                                     |
| Too low            | "Value must be at least X"           | "Too low, chef. Needs to be at least X."                                    |
| Too high           | "Value must be at most X"            | "Too high, chef. Can't be more than X."                                     |
| Invalid percentage | "Please enter a valid percentage..." | "That's not a valid percentage. Give me something between 0 and 100, chef." |
| Duplicate          | "This already exists"                | "Already exists. Check your list, chef."                                    |

---

## Enforcement

### Voice Consistency Checker

The codebase includes a voice consistency checker that scans for:

- Missing contractions
- Generic messages
- Technical jargon
- Overly formal language

**Run the checker:**

```bash
npm run cleanup:check
```

**See Also:**

- `scripts/check-voice-consistency.js` - Voice consistency check script
- `scripts/cleanup/checks/voice-consistency.js` - Cleanup check module

### Code Review Checklist

When reviewing code, check:

- [ ] Dialog titles use kitchen metaphors where appropriate
- [ ] Dialog messages are clear and use contractions
- [ ] Button labels are context-specific (not generic "Confirm")
- [ ] Dropdown placeholders are kitchen-themed questions
- [ ] Input placeholders include helpful examples
- [ ] Validation messages use PrepFlow voice
- [ ] No technical jargon in user-facing text
- [ ] Voice feels natural, not forced

---

## Related Documentation

- `.cursor/rules/dialogs.mdc` - Core dialog standards and PrepFlow voice principles
- `.cursor/rules/development.mdc` - Development standards including voice guidelines
- `lib/personality/content.ts` - Personality system content pools (use for error messages)
- `scripts/check-voice-consistency.js` - Voice consistency checker

---

**Remember:** The goal is to make PrepFlow feel like a helpful kitchen colleague, not a robot. Use kitchen metaphors naturally, keep it friendly but professional, and always prioritize clarity over cleverness.

