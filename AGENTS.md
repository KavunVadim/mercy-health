<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Cross-Platform UI Guidelines

## Safari & iOS Rendering Fixes
1. **Stacking Contexts**: Avoid putting `position: fixed` elements inside ancestors that have `transform`, `filter` (like `backdrop-filter`), or `perspective`. This breaks the fixed positioning on Safari. 
   - **Solution**: Use React Portals to render full-screen overlays (like mobile menus) directly in `document.body`.
2. **Dynamic Viewport Height**: Always use `100dvh` instead of `100vh` for full-screen elements on mobile to prevent the UI from being cut off by the Safari address bar.
3. **Solid Backgrounds**: On Safari, explicitly set `background-color` (e.g., `#FFFFFF`) for mobile overlays. Using `background: white` or leaving it inherited can lead to transparency bugs during animations.
4. **Smooth Scrolling**: Add `-webkit-overflow-scrolling: touch` to scrollable containers inside overlays for a native feel.

## Typography & Adaptation
1. **Fluid Scaling**: Headlines that look good on desktop (e.g., `2.5rem`) are often too large for mobile (e.g., 360px width). 
   - **Rule**: Reduce mobile menu font sizes to `1.75rem` - `2rem` on small devices to prevent overwhelming the user and ensure text wrapping.
2. **Touch Targets**: Ensure interactive elements have a minimum height/width of `44px` or `48px` with appropriate padding.
