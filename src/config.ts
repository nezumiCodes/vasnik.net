/**
 * Site-wide settings. Contact details are deliberately limited to LinkedIn and
 * the Formspree form: no phone number or email address is ever published.
 */
export const SITE = {
  name: 'Vasiliki (Celia) Nikolaidi',
  shortName: 'Celia Nikolaidi',
  url: 'https://vasnik.net',
  locale: 'en-GB',
  description:
    'Data and automation specialist building automated reporting, dashboards and decision tools with SQL, Python, Power BI and the Power Platform.',
} as const;

export const CONTACT = {
  linkedin: 'https://www.linkedin.com/in/vasnik',
  /** Form ID from formspree.io (the part after /f/). Empty hides the form. */
  formspreeFormId: 'mzedoqwq',
} as const;

/**
 * Feature switches. With `services: false` the /services/ page is not built and
 * every link, section and form field that points at services is left out. The
 * service entries in src/content/services/ are still schema-checked by the build.
 */
export const FEATURES = {
  services: false,
} as const;

export const BLOG = {
  postsPerPage: 10,
} as const;
