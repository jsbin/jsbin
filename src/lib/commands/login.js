export const login = {
  title: 'Login',
  condition: ({ user }) => user.username === 'anonymous',
  run: () => {
    window.location = `${process.env.REACT_APP_API}/auth`;
  },
};
