# GitHub Copilot Instructions for Birthday Planning App

## Project Overview

This is a React-based birthday planning web application with location guides, accommodation details, and walking route planners with GPX support. The app is built with Vite, React Router, and Leaflet for interactive maps.

## Code Review Guidelines

### 1. Content Quality - Spelling & Grammar

When reviewing or generating content:

- **Spell Check**: Verify all user-facing text for correct spelling
  - Component text content
  - Blog posts in Location.jsx
  - Accommodation descriptions
  - Walk descriptions and details
  - Button labels and navigation text
  - Error messages and user feedback
  - Documentation files (README, guides)

- **Grammar Check**: Ensure proper grammar in all content
  - Complete sentences with proper punctuation
  - Consistent tense usage (present tense for instructions)
  - Proper capitalization (especially titles, headings)
  - Clear, concise language without ambiguity
  - Active voice preferred over passive voice

- **Content Clarity**: Review for readability
  - Short paragraphs (3-5 sentences max)
  - Bullet points for lists
  - Clear section headings
  - Logical information flow
  - No jargon without explanation

### 2. Web Accessibility (WCAG 2.1 AA Standards)

When reviewing or creating components:

#### Semantic HTML
- Use proper HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`)
- Use heading hierarchy correctly (h1 → h2 → h3)
- Use `<button>` for clickable elements (not divs with onClick)
- Use `<a>` for navigation links

#### ARIA Labels
- Add `aria-label` to icon-only buttons
- Include `aria-describedby` for complex interactions
- Use `role` attributes where semantic HTML isn't sufficient
- Provide `aria-live` regions for dynamic content

#### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Maintain logical tab order
- Add focus indicators (visible :focus styles)
- Support keyboard shortcuts where appropriate
- Test with Tab, Enter, Space, and Arrow keys

#### Color Contrast
- Maintain minimum 4.5:1 contrast ratio for normal text
- Maintain minimum 3:1 contrast ratio for large text (18pt+)
- Don't rely on color alone to convey information
- Test with tools like WebAIM Contrast Checker

#### Screen Reader Support
- Add descriptive `alt` text for all images
- Use descriptive link text (avoid "click here")
- Provide text alternatives for icons
- Test with NVDA (Windows) or VoiceOver (Mac)

#### Form Accessibility
- Associate `<label>` with form inputs
- Provide clear error messages
- Use `required` and `aria-required` attributes
- Add placeholder text as guidance, not replacement for labels

### 3. Mobile Responsiveness

When reviewing or creating styles:

#### Breakpoints (defined in CSS)
```css
/* Mobile: 0-767px (base styles) */
/* Tablet: 768px-1023px */
@media (min-width: 768px) and (max-width: 1023px)

/* Desktop: 1024px+ */
@media (min-width: 1024px)
```

#### Mobile-First Approach
- Write base styles for mobile
- Use min-width media queries to add desktop features
- Test on actual devices when possible
- Use Chrome DevTools device emulation

#### Touch Targets
- Minimum 44x44px touch target size
- Adequate spacing between interactive elements
- Large, easy-to-tap buttons
- Avoid hover-only interactions

#### Responsive Typography
- Use relative units (rem, em) not fixed pixels
- Scale font sizes appropriately for screen size
- Maintain readable line length (45-75 characters)
- Ensure text doesn't overflow on small screens

#### Responsive Layout
- Use flexbox or grid for layouts
- Ensure horizontal scrolling is avoided
- Stack elements vertically on mobile
- Hide or collapse non-essential content
- Test landscape and portrait orientations

#### Performance on Mobile
- Optimize images (use appropriate sizes)
- Lazy load images where appropriate
- Minimize CSS and JavaScript
- Test on 3G/4G networks (throttle in DevTools)

### 4. Component Guidelines

#### React Best Practices
- Use functional components with hooks
- Implement proper prop validation
- Follow React naming conventions (PascalCase for components)
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks

#### State Management
- Use `useState` for local component state
- Use `useEffect` for side effects with proper cleanup
- Avoid unnecessary re-renders (use React DevTools Profiler)
- Pass callbacks to child components, not inline functions

#### File Organization
- One component per file
- Co-locate styles with components
- Group related components in folders
- Keep utility functions separate

### 5. CSS Guidelines

#### CSS Variables
- Use CSS variables defined in `src/styles/index.css`
- Don't hardcode colors or spacing values
- Follow the established design system
- Add new variables to `:root` when needed

#### Naming Conventions
- Use BEM methodology (Block__Element--Modifier)
- Use descriptive class names
- Avoid generic names (e.g., `.container`, `.box`)
- Prefix utility classes appropriately

#### Responsive Design
- Mobile-first approach
- Test all breakpoints
- Ensure text is readable at all sizes
- Check that interactive elements are accessible

### 6. Map & GPX Specific Reviews

#### Leaflet Maps
- Verify map renders correctly on all screen sizes
- Check that markers are visible and clickable
- Ensure popups display correctly
- Test map controls on mobile (pinch-to-zoom)
- Verify attribution is present

#### GPX Upload
- Check file validation works correctly
- Provide clear error messages for invalid files
- Show loading states during parsing
- Handle edge cases (empty files, corrupted data)
- Test with various GPX formats

### 7. Documentation Standards

When creating or updating documentation:

#### Markdown Files
- Use proper heading hierarchy
- Include table of contents for long documents
- Use code blocks with language syntax highlighting
- Add links to related documentation
- Include examples with explanations

#### Code Comments
- Comment complex logic or non-obvious code
- Explain "why" not "what" (code shows what)
- Keep comments concise and up-to-date
- Remove commented-out code before committing

#### README Requirements
- Clear project description
- Installation instructions
- Usage examples
- Link to comprehensive documentation
- Contributing guidelines (if applicable)

### 8. Testing Checklist

Before approving code changes, verify:

- [ ] All user-facing text checked for spelling/grammar
- [ ] Content is clear and concise
- [ ] Semantic HTML used correctly
- [ ] ARIA labels added where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Mobile responsive (320px to 1920px)
- [ ] Touch targets are adequate (44x44px min)
- [ ] Images have alt text
- [ ] Maps render correctly
- [ ] GPX upload works (if modified)
- [ ] No console errors
- [ ] Documentation updated if needed

## Common Issues to Watch For

### Content Issues
- ❌ Typos in user messages
- ❌ Inconsistent terminology
- ❌ Unclear instructions
- ❌ Missing punctuation
- ❌ Grammatically incorrect sentences

### Accessibility Issues
- ❌ Missing alt text on images
- ❌ Buttons without labels
- ❌ Poor color contrast
- ❌ Non-semantic HTML (div soup)
- ❌ No keyboard navigation
- ❌ Missing ARIA labels

### Mobile Issues
- ❌ Text too small on mobile
- ❌ Buttons too close together
- ❌ Horizontal scrolling
- ❌ Elements overflow viewport
- ❌ Hover-only interactions
- ❌ Map not responsive

### Code Quality Issues
- ❌ Hardcoded values instead of CSS variables
- ❌ Inline styles in JSX
- ❌ Missing error handling
- ❌ Unused imports or variables
- ❌ Console.log statements in production

## Specific Component Guidelines

### Home Page (Home.jsx)
- Ensure gallery spinner works on mobile (touch swipe)
- Check that navigation buttons are large enough for touch
- Verify transitions are smooth on all devices
- Test keyboard navigation through gallery items

### Location Page (Location.jsx)
- Check blog post content for spelling/grammar
- Ensure blog cards stack properly on mobile
- Verify readability of long-form content
- Test with screen reader

### Accommodation Page (Accommodation.jsx)
- Verify image gallery works on touch devices
- Check map renders correctly on all screen sizes
- Ensure accommodation details are clear and complete
- Test tab order through interactive elements

### Walks Page (Walks.jsx)
- Test GPX upload with various file formats
- Ensure sidebar navigation works on mobile
- Check that maps are responsive
- Verify walk details table is readable on small screens
- Test route visualization at different zoom levels

## Performance Guidelines

- Optimize images (WebP format when possible)
- Use lazy loading for below-the-fold content
- Minimize bundle size (check with `npm run build`)
- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Implement code splitting where appropriate

## Browser Support

Test on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Git Commit Guidelines

- Use clear, descriptive commit messages
- Prefix with type: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Keep commits focused (one logical change per commit)
- Reference issue numbers when applicable

## Questions to Ask During Review

1. **Content**: Is this text clear, grammatically correct, and free of typos?
2. **Accessibility**: Can this be used with keyboard only? With a screen reader?
3. **Mobile**: Does this work well on a 320px wide screen? On touch devices?
4. **Performance**: Will this impact load time or runtime performance?
5. **Maintainability**: Is this code clear and easy to understand?
6. **Consistency**: Does this follow our established patterns?

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility Docs](https://react.dev/learn/accessibility)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

---

**Remember**: User experience is paramount. If something is unclear, confusing, or hard to use, it needs improvement regardless of technical correctness.
