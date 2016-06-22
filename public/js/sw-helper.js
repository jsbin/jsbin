function newBinStartScript({ template, jsbin }) {
  return `start(${safeStringify(template)}, ${safeStringify(jsbin)}, this, document);`;
}

function prepareStart(bin) {
  const template = ['html', 'css', 'javascript', 'code'].reduce((acc, curr) => {
    acc[curr] = bin[curr];
    return acc;
  }, {});

  const jsbin = {
    state: {
      processors: bin.jsbin ? bin.jsbin.settings.processors : {},
      metadata: {},
      code: template.code,
      checksum: template.code,
    },
    user: {},
    settings: {
      panels: []
    },
  };

  return {
    template,
    jsbin,
  };
}

function safeStringify(source) {
  return JSON.stringify(source)
             .replace(/<\/script/gi, '<\\/script')
             .replace(/<!--/g, '<\\!--');
}

function paramsToObject(string) {
  const res = {};
  for (let [key, value] of new URLSearchParams(string).entries()) {
    res[key] = value;
  }
  return res;
}
