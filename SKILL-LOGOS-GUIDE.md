# Adding Real Skill Logos

The Skills Universe component currently uses auto-generated fallback textures (colored circles with 2-letter abbreviations).

To use real skill logos:

## 1. Prepare Logo Images

- Format: PNG or SVG (PNG recommended for better Three.js compatibility)
- Size: 256x256px or 512x512px (square)
- Background: Transparent
- Style: Simple, high-contrast icons work best on the spheres

## 2. Add Images to `/public`

Place your logo files in the `public` folder:

```
/public
  ├── react-icon.png
  ├── nextjs-icon.png
  ├── ts-icon.png
  ├── js-icon.png
  ├── nodejs-icon.png
  ├── python-icon.png
  ├── docker-icon.png
  ├── postgres-icon.png
  ├── webrtc-icon.png
  ├── supabase-icon.png
  ├── k8s-icon.png
  ├── cpp-icon.png
  ├── java-icon.png
  ├── sql-icon.png
  └── go-icon.png
```

## 3. Logo Sources

Free high-quality tech logos:

- **Simple Icons**: https://simpleicons.org/ (SVG, need to convert to PNG)
- **DevIcon**: https://devicon.dev/ (PNG/SVG)
- **Skill Icons**: https://skillicons.dev/ (PNG)
- **Icons8**: https://icons8.com/icons/set/programming (PNG)

## 4. Quick Conversion (SVG → PNG)

If you have SVG files:

```bash
# Using ImageMagick
convert -background none -size 512x512 input.svg output.png

# Or use online tools:
# - https://cloudconvert.com/svg-to-png
# - https://svgtopng.com/
```

## 5. Fallback Behavior

If an image fails to load, the component automatically generates a canvas texture with:
- Colored circle (using the skill's brand color)
- 2-letter abbreviation in white

This ensures the section always looks good even without custom logos.

## 6. Customizing Skills

Edit `DEFAULT_SKILLS` in `src/components/skills-universe.tsx`:

```typescript
export const DEFAULT_SKILLS: Skill[] = [
  { 
    label: "React", 
    color: "#61DAFB", 
    icon: "/react-icon.png",  // ← Update this path
    size: 1.2 
  },
  // ... more skills
];
```

## Tips

- Use white/light logos on colored spheres for best visibility
- Keep logos simple — complex details get lost on the curved surface
- Test different sizes (0.8–1.4) to create visual hierarchy
- Match `color` to the skill's official brand color for consistency
