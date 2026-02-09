# Blog Content

This folder contains markdown files that are converted to blog posts on the Location page.

## How to Add a New Blog Post

1. Create a new `.md` file in this folder (e.g., `04-my-new-post.md`)
2. Add YAML frontmatter at the top of the file
3. Write your content in markdown below the frontmatter
4. Run `npm run build:content` to generate the JSON
5. The content will appear on the Location page

## Frontmatter Fields

Each markdown file should start with YAML frontmatter between `---` markers:

```yaml
---
id: 4
title: My Post Title
date: March 2026
icon: 🎉
order: 4
---
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier (number) |
| `title` | Yes | Post title displayed on the page |
| `date` | No | Display date (defaults to "Unknown date") |
| `icon` | No | Emoji icon (defaults to 📄) |
| `order` | No | Sort order (defaults to id value) |

## Supported Markdown

The build script supports:

- **Headers**: `## Heading 2`, `### Heading 3`, etc.
- **Bold**: `**bold text**` or `__bold text__`
- **Italic**: `*italic text*` or `_italic text_`
- **Lists**: 
  - Unordered: `- item` or `* item`
  - Ordered: `1. item`
- **Links**: `[link text](https://example.com)`
- **Paragraphs**: Separate with blank lines

## Example Post

```markdown
---
id: 5
title: Travel Tips
date: April 2026
icon: ✈️
order: 5
---

Here are some essential travel tips!

## Before You Go

- **Check your passport** - Make sure it's valid
- **Book accommodation** - See our Accommodation page
- **Pack light** - You'll thank yourself later

## During Your Trip

1. Stay hydrated
2. Try local food
3. Take lots of photos!

For more information, visit [our website](https://example.com).
```

## Building Content

Content is automatically built when you run:

- `npm run dev` - Builds content then starts dev server
- `npm run build` - Builds content then builds for production
- `npm run build:content` - Only builds content

The generated JSON is saved to `src/data/blog-posts.json` and is gitignored (regenerate it after cloning).
