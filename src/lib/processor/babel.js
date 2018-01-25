import { JAVASCRIPT } from '../cm-modes';
import loopProtection from 'loop-protect';
import callback from './loop-protect-callback';

let Babel = null;
const cache = {};
let todo = [];

// variableDeclaration

const prependRequiredModules = () => ({
  visitor: {
    Program: {
      exit(programPath) {
        programPath.traverse({
          CallExpression(path) {
            if (path.node.callee.name === 'require') {
              const value = path.node.arguments[0].value;
              if (cache[value]) {
                programPath.unshiftContainer('body', [cache[value]]);
              }
            }
          },
        });
      },
    },
  },
});

const collectImports = () => ({
  visitor: {
    ModuleDeclaration(path) {
      const moduleName = path.node.source.value;
      if (!cache[moduleName]) {
        const value = [moduleName];

        if (!moduleName.startsWith('http')) {
          value.push('https://wzrd.in/bundle/' + moduleName);
        }
        todo.push(value);
      }
    },
  },
});

const getOutstandingPromises = async () => {
  return Promise.all(
    todo.map(([name, url = name]) => {
      if (!cache[name]) {
        return fetch(url).then(res => res.text()).then(res => {
          cache[name] = Babel.transform(`var ${res}`, {
            presets: [],
          }).ast;
        });
      }
      return true;
    })
  );
};

export async function transform(source) {
  const sourceFileName =
    (window.location.pathname.split('/').pop() || 'untitled') + '.js';

  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    Babel.registerPlugin('collectImports', collectImports);
    Babel.registerPlugin('replaceImports', prependRequiredModules);
    Babel.registerPlugin('loopProtection', loopProtection(100, callback));
  }
  let res = source;
  try {
    Babel.transform(source, {
      presets: ['es2015', 'react', 'stage-0'], // FIXME es2015 => env
      plugins: ['collectImports'],
      ast: false,
    });

    await getOutstandingPromises();
    todo = [];

    res = Babel.transform(source, {
      presets: [
        () => ({
          plugins: [prependRequiredModules],
        }),
        'es2015',
        'react',
        'stage-0',
      ],
      plugins: ['loopProtection'],
      ast: false,
      minified: true,
      sourceMap: 'both',
      sourceType: 'module',
      sourceFileName,
    });
  } catch (e) {
    console.error(e.message);
    res = {
      code: `throw new Error("Failed to compile - if this continues, please file a new issue and include this full source and configuration")`,
    };
  }

  return { code: res.code, map: res.map };
}

export const config = {
  name: 'babel',
  label: 'Babel + React',
  for: JAVASCRIPT,
  mode: 'text/jsx',
};
