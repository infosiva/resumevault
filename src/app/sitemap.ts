import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://resumevault.app'
  const routes = ['/', '/build', '/templates', '/pricing', '/about']
  return routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }))
}
