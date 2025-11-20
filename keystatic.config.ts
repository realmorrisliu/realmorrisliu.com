import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    captured: collection({
      label: 'Captured Photos',
      slugField: 'title',
      path: 'src/content/captured/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        image: fields.image({
          label: 'Photo',
          directory: 'src/assets/captured',
          publicPath: '../../assets/captured',
        }),
        date: fields.date({ label: 'Date' }),
        location: fields.text({ label: 'Location' }),
        camera: fields.text({ label: 'Camera Model' }),
        lens: fields.text({ label: 'Lens Model' }),
        iso: fields.text({ label: 'ISO' }),
        aperture: fields.text({ label: 'Aperture' }),
        shutterSpeed: fields.text({ label: 'Shutter Speed' }),
        content: fields.emptyContent({ extension: 'md' }),
      },
    }),
  },
});
