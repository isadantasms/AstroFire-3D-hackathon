// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import '@testing-library/jest-dom/vitest'

// jsdom does not implement scrolling APIs used by the layout.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}
