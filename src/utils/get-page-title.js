import defaultSettings from '@/settings'

const title = defaultSettings.title || 'PhD Sharing'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
