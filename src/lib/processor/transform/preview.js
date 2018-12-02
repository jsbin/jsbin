let captureFnName = '';

const getNodeBody = path => {
  const { node } = path;
  const { type } = node;
  if (type === 'VariableDeclaration') {
    return [
      node.declarations[node.declarations.length - 1].init,
      path.get(`declarations.${node.declarations.length - 1}.init`),
    ];
  }

  if (type === 'ReturnStatement') {
    return [node.argument, path.get('argument')];
  }

  if (type === 'ExpressionStatement') {
    path.___touched = true;
    return [node.expression, path.get('expression')];
  }

  return [node, path];
};

const capturePreviewTransform = ({ types: t, transform }) => ({
  exit(path) {
    if (path.___touched) return;
    const { trailingComments } = path.node;
    if (trailingComments) {
      const comment = trailingComments.find(comment => {
        return comment.value.trim().startsWith('?');
      });

      if (comment) {
        const [BODY, source] = getNodeBody(path);

        let previewValue = t.identifier('undefined');

        const match = comment.value.match(/\s*\?(.*)$/);

        if (match && match[1].trim()) {
          try {
            previewValue = transform(
              `(()=>{try { return ${match[1]} } catch(e){} return null})()`,
              { ast: true }
            ).ast.program.body[0].expression;
          } catch (e) {
            previewValue = t.nullLiteral();
          }
        }

        console.log('preview', previewValue);

        const fn = t.callExpression(t.identifier(captureFnName), [
          t.numericLiteral(comment.loc.start.line - 1),
          BODY,
          previewValue,
        ]);

        source.replaceWith(fn);
        path.___touched = true;
      }
    }
  },
});

export default function preview(callback) {
  return babel => {
    const callbackNode = babel.transform(callback, { ast: true }).ast.program
      .body[0];

    captureFnName = callbackNode.id.name;

    return {
      visitor: {
        Program: {
          exit(programPath) {
            programPath.traverse({
              DirectiveLiteral(path) {
                // removes "use strict" to allow for intentional globals by user
                programPath.node.directives.shift();
              },
            });
            programPath.node.directives.unshift(callbackNode);
          },
        },
        VariableDeclaration: capturePreviewTransform(babel),
        ExpressionStatement: capturePreviewTransform(babel),
        BinaryExpression: capturePreviewTransform(babel),
        ReturnStatement: capturePreviewTransform(babel),
        LogicalExpression: capturePreviewTransform(babel),
        CallExpression: capturePreviewTransform(babel),
      },
    };
  };
}
