<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style type="text/css">
          :root {
            --color-text-primary: #1a1a1a;
            --color-text-secondary: #4a4a4a;
            --color-text-tertiary: #6b6b6b;
            --color-border: #e5e5e5;
            --color-background: #ffffff;
          }
          
          body {
            font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 16px;
            line-height: 1.65;
            margin: 0;
            padding: 64px 24px;
            max-width: 672px;
            margin: 0 auto;
            color: var(--color-text-secondary);
            background-color: var(--color-background);
          }
          
          h1 {
            font-family: 'EB Garamond', Georgia, serif;
            font-size: 2.25rem;
            line-height: 1.25;
            color: var(--color-text-primary);
            margin-bottom: 1rem;
            font-weight: 500;
          }
          
          h2 {
            font-family: 'EB Garamond', Georgia, serif;
            font-size: 1.5rem;
            line-height: 1.35;
            color: var(--color-text-primary);
            margin: 4rem 0 1rem;
            font-weight: 500;
          }
          
          .subscribe h2 {
            margin-top: 0;
            margin-bottom: 1rem;
          }
          
          p {
            margin-bottom: 1rem;
          }
          
          .description {
            font-size: 1.125rem;
            margin-bottom: 4rem;
            line-height: 1.65;
          }
          
          .rss-item {
            margin-bottom: 4rem;
            padding-bottom: 3rem;
            border-bottom: 1px solid var(--color-border);
          }
          
          .rss-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
          }
          
          .item-title {
            color: var(--color-text-primary);
            text-decoration: none;
            font-weight: 500;
          }
          
          .item-title:hover {
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
          }
          
          .item-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.875rem;
            color: var(--color-text-tertiary);
            margin-bottom: 0.5rem;
          }
          
          .item-description {
            color: var(--color-text-secondary);
            line-height: 1.65;
          }
          
          .subscribe {
            background: var(--color-background);
            border: 1px solid var(--color-border);
            padding: 1.5rem;
            margin-bottom: 4rem;
          }
          
          .rss-url {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            background: var(--color-background);
            padding: 0.75rem;
            border: 1px solid var(--color-border);
            font-size: 0.875rem;
            word-break: break-all;
            margin: 1rem 0;
            color: var(--color-text-secondary);
          }
          
          .back-link {
            color: var(--color-text-primary);
            text-decoration: none;
            font-weight: 500;
          }
          
          .back-link:hover {
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
          }
          
          .footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--color-border);
            text-align: center;
          }
          
          .signature {
            font-size: 0.875rem;
            color: var(--color-text-tertiary);
            margin-bottom: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="subscribe">
          <h2>RSS Feed</h2>
          <p>This is an RSS feed. Subscribe by copying the URL from the address bar into your RSS reader.</p>
          <div class="rss-url"><xsl:value-of select="/rss/channel/link"/>/rss.xml</div>
          <p>Visit <a class="back-link" href="{/rss/channel/link}">the website</a> to browse posts in a more friendly format.</p>
        </div>
        
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
        </header>
        
        <div class="posts">
          <xsl:for-each select="/rss/channel/item">
            <article class="rss-item">
              <div class="item-meta">
                <time><xsl:value-of select="substring(pubDate, 0, 17)" /></time>
              </div>
              <h2>
                <a class="item-title" href="{link}">
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="item-description"><xsl:value-of select="description"/></p>
            </article>
          </xsl:for-each>
        </div>
        
        <footer class="footer">
          <div class="signature">Morris Liu</div>
          <nav>
            <a class="back-link" href="{/rss/channel/link}">← Back to main page</a>
          </nav>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>