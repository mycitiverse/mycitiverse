// generate-sitemap.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

(async () => {
  const sitemap = new SitemapStream({ hostname: 'https://www.mycitiverse.com' });

  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/events', changefreq: 'daily', priority: 0.8 },
    { url: '/community-halls', changefreq: 'daily', priority: 0.8 },
    { url: '/city-feed', changefreq: 'daily', priority: 0.8 },
    // Add more routes as you create them
  ];

  links.forEach(link => sitemap.write(link));
  sitemap.end();

  const data = await streamToPromise(sitemap);
  const writeStream = createWriteStream('./public/sitemap.xml');
  writeStream.write(data.toString());
})();
