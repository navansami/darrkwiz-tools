# Darrkwiz handoff

## Agreed direction

Darrkwiz is a place to make things, understand them, and experiment. Organize the site around **Tools · Learn · Playground**. This is the main theme for the navigation, homepage, content architecture, and SEO.

Keep the existing editorial identity: dark surfaces, warm paper text, orange accents, expressive typography, and purposeful motion. Add depth through useful experiences and strong explanations.

## Current implementation

- Tools: six working browser utilities with permanent `/tools/[slug]` URLs: screenshot studio, image compressor, image converter, text cleaner, text compare, and palette extractor.
- Header navigation presents Tools (homepage section), Learn (`/learn`), and Playground (`/playground`).
- The homepage headline, introduction, about copy, and footer establish the three pillars.
- First release implemented: `/learn/colour-theory`, `/learn/image-compression`, and `/playground/css-easing`, with interactive controls, explanations, challenges, reset, and exports.
- Dedicated pages have unique titles, descriptions, social metadata, canonical URLs, visible Navan Sami attribution, and author structured data. All five new routes are in the sitemap.
- Existing files and text are processed in the browser, without accounts or server storage.

The items below preserve the full agreed idea backlog. The three first-release experiences above are implemented; other topics remain future work.

## Information architecture

| Pillar | Purpose | Intended routes |
| --- | --- | --- |
| Tools | Complete practical tasks and export useful results | `/tools`, `/tools/[slug]` |
| Learn | Understand concepts through explanations and interactive examples | `/learn`, `/learn/[slug]` |
| Playground | Experiment freely with design and code | `/playground`, `/playground/[slug]` |

Keep existing tool URLs stable. Learn and Playground now have dedicated index pages. Tools retains its existing homepage section. Put challenges inside their related lessons or playgrounds initially.

## Full idea backlog

### Interactive theory

- **Colour theory (first lab implemented):** draggable colour wheel with two, three, or four independent pickers, a square harmony, keyboard controls, and CSS palette export; complementary, analogous, and triadic palettes; live harmony previews; connections to the palette extractor.
- **Typography:** adjust font size, line height, tracking, and type scale to see how hierarchy and readability change.
- **Image compression:** quality slider, zoomable artifacts, before/after comparison, file-size feedback, and a path into the compressor with your own image.

### Web fundamentals

- **Browser rendering:** step through how HTML and CSS become a visible page.
- **HTTP:** follow a request and response through a visual sequence.
- **JavaScript event loop:** step through the call stack, queued work, and execution order.
- Keep the first lessons focused enough to complete in one sitting, with explanations that identify any simplified behavior.

### Creative playgrounds

- **Gradients:** adjust stops, colours, angles, and gradient types; preview and copy CSS.
- **CSS easing:** manipulate curves, compare live animations, and copy timing functions.
- **Patterns:** generate repeatable visual patterns with editable controls and exports.
- **CSS Grid:** arrange layouts, adjust tracks and gaps, and copy the resulting code.

### Mini challenges

- Match a target colour palette.
- Fix a broken layout.
- Guess which image format produces the smaller file, then inspect the result.
- Recreate a design with a limited set of controls.
- Give explanatory feedback and an easy reset; connect each challenge to its concept or tool.

### Guided projects

- Start with **Make a social card**: choose colours, frame an image, then export the finished card.
- Connect the existing palette extractor and screenshot studio into a coherent project flow.
- Explain why each choice matters and preserve work between steps where practical.

### Reference shelf

- Visual cheat sheets for image formats, CSS units, typography, accessibility, and keyboard shortcuts.
- Put references with relevant Learn content and link to them from tools and experiments.
- Use concrete examples and concise comparisons; provide sources for technical claims.

### Personal workbench

- Save favourite tools, palettes, and presets locally.
- Let visitors reopen useful settings without creating an account.
- Explain that local saves belong to the current browser and can be cleared. Consider export/import when there is enough saved data to justify it.

## Learning format

Use **short explanation → interactive experiment → small challenge → related tool**.

The theory should give the visitor something to manipulate. Keep the explanation next to the effect of changing a control. Allow deeper explanations to expand in context, and give every experiment a sensible default and reset.

Example: explain lossy compression, let the reader vary quality and inspect artifacts, ask them to choose a useful tradeoff, then link to the image compressor.

Inspiration:

- [Nicky Case’s interactive explanations](https://ncase.me/neurons/): prose combined with experiments.
- [Nutshell](https://ncase.me/nutshell/): expandable explanations that keep deeper context on the page.

## First release (implemented)

1. **Colour theory lab:** begin with colour relationships and a draggable wheel. Place the guided explanation in Learn and cross-link the palette extractor.
2. **Image compression explainer:** make quality, artifacts, and file size visible. Link directly to the existing compressor.
3. **CSS easing playground:** live motion previews with editable curves, reset, and copyable CSS. Respect the visitor’s motion preference; use explicit playback when animations are paused.

Build these as complete experiences before expanding across all topics. Then add challenges, the reference shelf, guided projects, and local saves as the collection grows.

## SEO and discoverability

- Brand positioning: **Darrkwiz — Tools, Learn & Playground**.
- Describe the site naturally as practical browser tools, interactive learning, and creative experimentation. Keep availability accurate: the first three experiences are implemented; future topics remain planned.
- Give every launched pillar and detail page a descriptive title, unique description, self-referencing canonical URL, and matching social metadata.
- Target the actual topic on detail pages, such as colour theory, image compression, and CSS easing. Write for the reader’s task rather than repeating the brand phrase everywhere.
- Keep substantive lesson text and useful headings available in rendered HTML; interactive controls supplement the explanation.
- Link lessons, tools, references, and playgrounds where they help the visitor take the next step.
- Add real published routes to the sitemap when they launch. Avoid indexing empty placeholder pages.
- Add structured data only when it accurately describes visible published content. Use real social preview assets when available.

## Implementation and review notes

- Keep tool functionality available while the broader site grows.
- Preserve browser-side processing and the existing privacy promise for utilities that work locally.
- Support keyboard controls, readable labels, touch interaction, narrow mobile screens, and reduced motion.
- Avoid new dependencies or account requirements unless a feature needs them.
- Check the existing style guide before extending layouts.
- Validate new experiences with meaningful behavior checks: useful exports, accurate computed results, working navigation, and no mobile overflow.
- Current project checks: `npm run typecheck`, `npm run build`, and `npm test` (Playwright; production build required first).

## Next implementation handoff

The first three experiences and dedicated Learn and Playground indexes are implemented. Next candidates are typography, gradients, patterns, and additional web fundamentals. Compression comparisons use a fresh PNG baseline of prepared pixels, rather than claiming savings against the upload. The site attributes these experiences to Navan Sami in visible copy and SEO metadata. Search ranking is not guaranteed. This handoff does not authorize automatic implementation of the entire backlog or a change of hosting provider.
