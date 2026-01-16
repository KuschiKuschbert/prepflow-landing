class Auth0ClientMock {
  constructor() {
    this.handleLogin = jest.fn();
    this.handleCallback = jest.fn();
    this.handleLogout = jest.fn();
    this.handleProfile = jest.fn();
    this.getSession = jest.fn().mockResolvedValue({ user: { sub: 'test-user-id' } });
    this.getAccessToken = jest.fn().mockResolvedValue({ accessToken: 'test-access-token' });
  }
}

const mockData = {
  __esModule: true,

  // @auth0/nextjs-auth0
  initAuth0: () => ({
    getSession: () => ({ user: { sub: 'test-user-id' } }),
    getAccessToken: () => ({ accessToken: 'test-access-token' }),
    handleLogin: jest.fn(),
    handleCallback: jest.fn(),
    handleLogout: jest.fn(),
    handleProfile: jest.fn(),
    withApiAuthRequired: handler => handler,
    withPageAuthRequired: handler => handler,
  }),
  getSession: () => ({ user: { sub: 'test-user-id' } }),
  getAccessToken: () => ({ accessToken: 'test-access-token' }),

  // Export Class
  Auth0Client: Auth0ClientMock,

  // @auth0/nextjs-auth0/client
  useUser: () => ({ user: { sub: 'test-user-id' }, isLoading: false, error: undefined }),

  // auth0 (Management Client)
  ManagementClient: jest.fn().mockImplementation(() => ({
    getUsers: jest.fn().mockResolvedValue([]),
    getUser: jest.fn().mockResolvedValue({}),
    updateUser: jest.fn().mockResolvedValue({}),
    deleteUser: jest.fn().mockResolvedValue({}),
    assignRolestoUser: jest.fn().mockResolvedValue({}),
    getRoles: jest.fn().mockResolvedValue([]),
  })),
  AuthenticationClient: jest.fn().mockImplementation(() => ({
    clientCredentialsGrant: jest.fn().mockResolvedValue({ access_token: 'test-token' }),
    getProfile: jest.fn().mockResolvedValue({}),
  })),
};

// Handle both default and named imports
module.exports = mockData;
module.exports.default = mockData;
