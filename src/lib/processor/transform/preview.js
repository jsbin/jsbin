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

  if (type === 'ExpressionStatement') {
    return [node.expression, path.get('expression')];
  }
};

const capturePreviewTransform = t => ({
  exit(path) {
    if (path.___touched) return;
    const { trailingComments } = path.node;
    if (trailingComments) {
      const transform = trailingComments.find(comment => {
        return comment.value.trim() === '?';
      });

      if (transform) {
        const [BODY, source] = getNodeBody(path);

        const fn = t.callExpression(t.identifier(captureFnName), [
          t.numericLiteral(transform.loc.start.line - 1),
          BODY,
        ]);

        source.replaceWith(fn);
        path.___touched = true;
      }
    }
  },
});

export default function preview(callback) {
  return ({ types, transform }) => {
    const callbackNode = transform(callback, { ast: true }).ast.program.body[0];

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
        VariableDeclaration: capturePreviewTransform(types),
        ExpressionStatement: capturePreviewTransform(types),
      },
    };
  };
}
