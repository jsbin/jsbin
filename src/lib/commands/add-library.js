const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/';

export const addLibrary = {
  title: 'Add library…',
  run: async () => {
    const json = await import(/* webpackChunkName: "libraries" */ '../../lib/libraries.json');

    const run = url => {
      if (!Array.isArray(url)) {
        url = [url];
      }

      return url.map(url => `<script src="${url}"></script>`).join('\n');
    };

    const results = [];
    json.forEach(
      ({ assets = [], version, name, keywords = null, filename }) => {
        if (!keywords) keywords = [];

        const latest = `${CDN}${name}/${version}/${filename}`;

        results.push({
          title: name,
          name,
          display: `${name} @ ${version}`,
          meta: `${name} ${keywords.join(' ')}`,
          run: run.bind(null, latest),
        });

        if (assets.length) {
          results.push({
            title: name,
            name,
            display: `${name} (plus ${assets.length -
              1} extra assets) @ ${version}`,
            meta: `${name} ${keywords.join(' ')}`,
            run: run.bind(
              null,
              assets.map(file => {
                return `${CDN}${name}/${version}/${file}`;
              })
            ),
          });
        }
      }
    );
    return results.sort(
      (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
    );
  },
};
