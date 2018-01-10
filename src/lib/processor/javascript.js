import { JAVASCRIPT } from '../cm-modes';
let Babel = null;

// FIXME "LD" should be the alias
const alias = 'LP';

const generateBefore = (t, line, name = alias) =>
  t.expressionStatement(
    t.callExpression(t.identifier(name), [
      t.objectExpression([
        t.objectProperty(t.identifier('reset'), t.booleanLiteral(true)),
        t.objectProperty(t.identifier('line'), t.numericLiteral(line)),
      ]),
    ])
  );

const generateInside = (t, line, name = alias) =>
  t.ifStatement(
    t.callExpression(t.identifier(name), [
      t.objectExpression([
        t.objectProperty(t.identifier('line'), t.numericLiteral(line)),
      ]),
    ]),
    t.breakStatement()
  );

const loopProtection = ({ types: t }) => ({
  visitor: {
    WhileStatement(path) {
      const before = generateBefore(t, path.node.loc.start.line);
      const inside = generateInside(t, path.node.loc.start.line);
      path.insertBefore(before);
      path.get('body').unshiftContainer('body', inside);
    },
  },
});

export const transform = async source => {
  if (
    !(source.includes('for') || source.includes('while')) ||
    source.includes('noprotect')
  ) {
    return source;
  }

  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    Babel.registerPlugin('loopProtection', loopProtection);
  }

  let res = source;

  try {
    res = Babel.transform(source, {
      // presets: ['es2015', 'react', 'stage-0'],
      plugins: ['loopProtection'],
    }).code;
  } catch (e) {
    console.error(e.message);
  }

  return res;
};

export const config = {
  name: JAVASCRIPT,
  label: 'JavaScript',
  for: JAVASCRIPT,
  mode: JAVASCRIPT,
};
