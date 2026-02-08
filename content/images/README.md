# Gallery Images

Place your photos in this folder to display them in the "Over The Years" gallery.

## Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

## Adding Captions and Dates

You can optionally create a `gallery.json` file in this folder to add captions and dates to your images:

```json
{
  "images": [
    {
      "filename": "holiday-2020.jpg",
      "caption": "Summer holiday in Cornwall",
      "date": "August 2020"
    },
    {
      "filename": "birthday-party.jpg",
      "caption": "50th birthday celebration",
      "date": "February 2024"
    }
  ]
}
```

## Image Order

Images are sorted by:
1. The `order` field in gallery.json (if specified)
2. The order they appear in gallery.json
3. Alphabetically by filename (for images not in gallery.json)

## Tips

- Use descriptive filenames for easier organisation
- Optimise images for web (recommended max width: 2000px)
- The gallery supports landscape, portrait, and square images
- Large images will be displayed at their original quality in the lightbox

## Building

After adding images, run:

```bash
npm run build:content
```

This will:
1. Copy images to the public folder
2. Generate the gallery manifest for the React app
