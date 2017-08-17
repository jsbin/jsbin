# Generating new libraries file

Using cdnjs and `jq`. The `packages.min.json` is about 180mb and the generated file is ~1.6mb

```bash
curl -s https://cdnjs.cloudflare.com/packages.min.json | jq '[.packages | .[] | .version as $version | { name: .name, filename: .filename, keywords: .keywords, version: .version, assets: .assets | .[] | select(.version == $version) | (.files | map(select( . | endswith(".js") )) ) }]' > src/lib/libraries.json
```
