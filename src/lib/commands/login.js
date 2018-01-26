export const login = {
  title: 'Login',
  condition: ({ user }) => !user.token,
  run: () => {
    window.location = `${process.env.REACT_APP_API}/auth`;
  },
};
