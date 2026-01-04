# GUI Testing Prompt for unplugged.cv

Copy the prompt below and use it with Claude for Chrome while viewing your app:

---

```
You are testing the unplugged.cv application - an AI-powered CV builder. Please perform comprehensive GUI testing covering all the areas below. Report any bugs, UX issues, visual glitches, or unexpected behaviors.

## 1. INITIAL PAGE LOAD TESTING
- [ ] Page loads without console errors
- [ ] All fonts (Geist) load correctly
- [ ] Layout renders properly at different viewport sizes (mobile, tablet, desktop)
- [ ] Header displays correctly with branding "CV Builder"
- [ ] Tagline "Paste your mess. Get a CV that works." is visible
- [ ] Dark mode toggle/support works if present
- [ ] No layout shifts during load

## 2. INPUT FORM TESTING

### Career Story Textarea
- [ ] Textarea is visible and properly sized
- [ ] Placeholder text is readable
- [ ] Can paste large amounts of text (5000+ characters)
- [ ] Text wraps correctly
- [ ] Scrolling works for overflow content
- [ ] Label "Your career story" is visible

### Target Job Textarea (Optional)
- [ ] Textarea is visible with "(optional)" label
- [ ] Placeholder explains the purpose
- [ ] Can be left empty
- [ ] Accepts job description text

### Generate Button
- [ ] Button shows "Generate My CV" with sparkle emoji
- [ ] Button is disabled when career textarea is empty
- [ ] Button is enabled when career textarea has content
- [ ] Hover state works (color change)
- [ ] Focus state is visible for accessibility

## 3. AUTHENTICATION TESTING

### Sign In Button (when logged out)
- [ ] "Sign in" button visible in header
- [ ] Clicking opens AuthModal

### AuthModal
- [ ] Modal opens with dark overlay
- [ ] Modal is centered on screen
- [ ] Email input field works
- [ ] Password input field works
- [ ] Can toggle between "Sign in" and "Sign up" modes
- [ ] "Don't have an account? Sign up" link works
- [ ] "Already have an account? Sign in" link works
- [ ] Clicking overlay closes modal
- [ ] Form validation works (email format, password length >= 6)
- [ ] Error messages display in red
- [ ] Loading state shows "Loading..." on button
- [ ] Success message appears on signup

### Sign Out (when logged in)
- [ ] User email displays in header
- [ ] "Sign out" button visible
- [ ] Sign out clears session

## 4. CV GENERATION TESTING

### During Generation
- [ ] Button changes to "Generating your CV..." with spinner
- [ ] Both textareas become disabled
- [ ] "Start over" button appears in header
- [ ] CV streams in real-time to left panel
- [ ] Raw markdown appears in right panel simultaneously
- [ ] "Still writing..." indicator shows during streaming
- [ ] Auto-scroll works as content streams in

### After Generation Complete
- [ ] Two-column layout displays correctly
- [ ] Left panel shows rendered CV with proper formatting
- [ ] Right panel shows raw markdown with monospace font
- [ ] Both panels are scrollable (max-height 70vh)
- [ ] "Copy Markdown" button works
- [ ] "Copy Markdown" changes to "Copied!" temporarily
- [ ] "Edit & Regenerate" button works
- [ ] Clicking "Edit & Regenerate" returns to input state with original text
- [ ] Premium upsell banner appears

### Error Handling
- [ ] Empty submission is prevented
- [ ] API errors display in red alert box
- [ ] Network errors are handled gracefully

## 5. PREMIUM UPSELL SECTION
- [ ] Banner appears after CV generation
- [ ] Gradient background displays correctly
- [ ] "Want more?" headline visible
- [ ] Feature list readable
- [ ] "Unlock for $10" button visible
- [ ] Button click triggers expected action (alert or checkout)

## 6. RESPONSIVE DESIGN TESTING

### Mobile (< 640px)
- [ ] Single column layout
- [ ] All elements stack vertically
- [ ] Textareas are full width
- [ ] Buttons are tappable size
- [ ] Modal fits on screen

### Tablet (640px - 1024px)
- [ ] Layout adapts appropriately
- [ ] Two-column output may stack or side-by-side

### Desktop (> 1024px)
- [ ] Two-column output layout
- [ ] Proper spacing and padding
- [ ] Max-width container centered

## 7. DARK MODE TESTING
- [ ] All text is readable in dark mode
- [ ] Backgrounds have proper contrast
- [ ] Form inputs are visible
- [ ] Modal styling works
- [ ] Buttons have correct dark variants

## 8. ACCESSIBILITY TESTING
- [ ] Can tab through all interactive elements
- [ ] Focus indicators are visible
- [ ] Form labels are associated with inputs
- [ ] Error messages are accessible
- [ ] Color contrast is sufficient
- [ ] Screen reader would understand flow

## 9. COPY TO CLIPBOARD
- [ ] "Copy Markdown" button works
- [ ] Copied content is correct markdown
- [ ] Visual feedback shows success
- [ ] Feedback resets after ~2 seconds

## 10. STATE MANAGEMENT
- [ ] "Start over" button clears all state
- [ ] Auth state persists on page reload
- [ ] Generated CV doesn't persist on reload (expected behavior)
- [ ] Multiple generations don't cause issues

## TEST DATA TO USE

### Sample Career Input:
John Smith
john.smith@email.com | San Francisco, CA

EXPERIENCE:
- Senior Software Engineer at TechCorp (2020-present)
  Built microservices architecture, led team of 5, reduced deployment time by 60%

- Software Developer at StartupXYZ (2017-2020)
  Full-stack development, React/Node.js, shipped 3 major features

EDUCATION:
BS Computer Science, State University, 2017

SKILLS: JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes

### Sample Job Description:
Senior Full-Stack Engineer
- 5+ years experience
- React and Node.js required
- Cloud experience (AWS/GCP)
- Team leadership experience preferred

## REPORT FORMAT
For each issue found, please report:
1. **Location**: Where in the UI
2. **Steps to reproduce**: How to trigger the issue
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Severity**: Critical / High / Medium / Low
6. **Screenshot area**: Describe what you see

Please be thorough and test edge cases like:
- Very long text inputs
- Special characters and emojis in input
- Rapid clicking of buttons
- Slow network conditions (if simulatable)
- Browser back/forward buttons
- Page refresh during generation
```
