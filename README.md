# SAPCCOL Website — Vanilla JavaScript Project

This project is a clean, maintainable separation of the uploaded **Saint Anthony of Padua’s Catholic Comprehensive College (SAPCCOL)** single-file website.

## Project structure

```text
SAPCCOL_JavaScript_Project/
├── index.html       # Page markup and content
├── styles.css       # Original visual design + accessibility enhancements
├── script.js        # Navigation, tabs, animations, gallery and enquiry interactions
└── README.md        # Setup and maintenance documentation
```

## Quick start (VS Code)

1. Extract the ZIP into a folder.
2. Open the folder with **File → Open Folder** in Visual Studio Code.
3. Open `index.html` in a browser, or install the **Live Server** VS Code extension and choose **Open with Live Server**.
4. The page does not require npm, Node.js, a build system or a database.

`index.html` links `styles.css` in the document head and loads `script.js` with `defer`.

## Features

- Responsive navigation with mobile menu, Escape-key closing and active-section highlighting.
- Academics and Fees tabs with click and keyboard navigation.
- Scroll reveal animations with reduced-motion support.
- Campus gallery with readable fallbacks when images are unavailable.
- Animated motto, loading screen and back-to-top button.
- Contact enquiry validation and an email draft (see limitation below).
- Preserved academic programmes, school information, fees, admissions, requirements, news and contact sections from the uploaded source.

## Photos / missing assets

The uploaded file referenced these **external local image filenames**, but the image files were not included in the upload:

- `school_campus.jpg`
- `cloyster.jpg` (spelled this way in the original source)
- `flyer.jpg`
- `flyer2.jpg`

Place your own authorized photos with those exact filenames beside `index.html` to display them. Without them, the site's original placeholder/fallback areas remain available. Google Fonts requires internet access; system fallback fonts are configured.

## Contact form — important

The original single-file page displayed a success message without actually sending an enquiry. This version does **not** falsely claim to send anything. It validates the required fields and opens a prepared email draft in the visitor's email application. Because no verified school email address was supplied, the recipient is intentionally blank; the visitor must enter a confirmed recipient and send the message. No form information is stored or transmitted to a server by this site.

For production contact submissions, implement a server endpoint, server-side validation, spam protection, delivery service, privacy notice and consent/retention controls.

## Editing guide

- **Content and layout:** edit `index.html`. Major page sections are marked with comments.
- **Colors, typography, spacing, responsiveness:** edit `styles.css`. Original CSS custom properties are at the top.
- **Interactions:** edit the named `init...` functions in `script.js`. `main()` initializes the site.
- **Images:** add the missing files or change the image paths in `index.html`.

## Deployment

Upload all four files plus any optional images to any static hosting provider. Configure HTTPS and test the mobile menu, tab navigation and enquiry flow on the deployed site.

## Verification

- JavaScript syntax can be checked with `node --check script.js` (optional).
- Test all navigation links, academic and fee tabs, missing-image fallbacks, form behavior and mobile layouts.
- The project has no external JavaScript dependencies.

## Scope

This is a **vanilla JavaScript website**, not a backend school management system. It retains the uploaded site's visual identity and content while separating concerns and improving interactions. Existing fees, phone numbers, school-year dates and other information are preserved from the source and should be verified before publication.
