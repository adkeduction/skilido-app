# Skilido reference design

The eight user-supplied images define one continuous visual system. Home references are the top and lower sections of one page, as are the two Learn overview references and two Ayati references. The two Stories references are duplicates.

Implement the interface as semantic HTML, CSS grid and functional controls. Supplied artwork is illustrative content only; never use a screenshot as a page, a card, a button or a text label. Keep the existing static JavaScript router and demo state.

Visual contract: pale lavender canvas, broad rounded hero banners, deep navy headings in Plus Jakarta Sans, blue Learn and purple Ayati active states, yellow primary hero buttons, pastel illustrated cards, consistent circular arrows and white pill controls. Desktop Explore has six equal columns; learning shortcuts have five, My Skilido and videos four, and resources five. Card text aligns independently of its arrow. The corresponding desktop page content uses a 1536px maximum width with fluid gutters.

At tablet widths reduce columns; at phone widths stack heroes, preserve readable text and 44px touch targets, and use the existing five-item bottom navigation. Avoid continuous decorative motion and honor reduced-motion preferences. Preserve extra demo story material in an expandable library after the main reference content. Preserve Spotlight and Club links below the dashboard.

No backend integration or public deployment is part of this design change. The original Desktop folder is unchanged; the updated project lives in the current workspace.

## Current live compatibility and generated art

The release is based on production commit `1005fd4`, preserving assessments, teacher-only Ayati and LifeLab deadlines/stars. The older reference's Parent toggle is intentionally not restored. The four newly generated transparent assets replace screenshot-derived hero scenes and primary illustrated icons. CSS draws the backgrounds, hills, podium and clouds; characters, kits and icon objects are positioned independently. Prompt specifications are in `assets/generated/PROMPTS.md`.
