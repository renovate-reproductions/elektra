import * as constants from '../constants';

const initialState = {
  accounts: {
    isFetching:  false,
    requestedAt: null,
    receivedAt:  null,
    data:        null,
  },
  repositoriesFor: {},
  manifestsFor: {},
  manifestFor: {},
};

const initialRepositoriesState = {
  isFetching:  false,
  requestedAt: null,
  receivedAt:  null,
  data:        null,
};

const initialManifestsState = {
  isFetching:  false,
  requestedAt: null,
  receivedAt:  null,
  data:        null,
};

const initialManifestState = {
  isFetching:  false,
  requestedAt: null,
  receivedAt:  null,
  data:        null,
};

////////////////////////////////////////////////////////////////////////////////
// accounts

const reqAccts = (state, {requestedAt}) => ({
  ...state,
  accounts: {
    ...initialState.accounts,
    isFetching: true,
    requestedAt,
  },
});

const reqAcctsFail = state => ({
  ...state,
  accounts: {
    ...state.accounts,
    isFetching: false,
  },
});

const recvAccts = (state, {data, receivedAt}) => ({
  ...state,
  accounts: {
    ...state.accounts,
    isFetching: false,
    data, receivedAt,
  },
});

const updateAcct = (state, {account}) => ({
  ...state,
  accounts: {
    ...state.accounts,
    data: [
      ...(state.accounts.data.filter(a => a.name != account.name)),
      account,
    ],
  },
});

const deleteAcct = (state, {accountName}) => ({
  ...state,
  accounts: {
    ...state.accounts,
    data: [
      ...(state.accounts.data.filter(a => a.name != accountName)),
    ],
  },
});

////////////////////////////////////////////////////////////////////////////////
// repositories

const reqRepos = (state, {accountName, requestedAt}) => ({
  ...state,
  repositoriesFor: {
    ...state.repositoriesFor,
    [accountName]: {
      ...initialRepositoriesState,
      isFetching: true,
      requestedAt,
    },
  },
});

const reqReposFail = (state, {accountName}) => ({
  ...state,
  repositoriesFor: {
    ...state.repositoriesFor,
    [accountName]: {
      ...state.repositoriesFor[accountName],
      isFetching: false,
      data: null,
    },
  },
});

const recvRepos = (state, {accountName, data}) => ({
  ...state,
  repositoriesFor: {
    ...state.repositoriesFor,
    [accountName]: {
      ...state.repositoriesFor[accountName],
      data: [ ...(state.repositoriesFor[accountName].data || []), ...data ],
    },
  },
});

const recvReposDone = (state, {accountName, receivedAt}) => ({
  ...state,
  repositoriesFor: {
    ...state.repositoriesFor,
    [accountName]: {
      ...state.repositoriesFor[accountName],
      isFetching: false,
      receivedAt,
    },
  },
});

const deleteRepo = (state, {accountName, repoName}) => ({
  ...state,
  repositoriesFor: {
    ...state.repositoriesFor,
    [accountName]: {
      ...state.repositoriesFor[accountName],
      data: (state.repositoriesFor[accountName].data || []).filter(r => r.name != repoName),
    },
  },
});

////////////////////////////////////////////////////////////////////////////////
// manifest lists

const updateManifestsFor = (state, accountName, repoName, update) => {
  const manifestsForAccount = state.manifestsFor[accountName] || {};
  return {
    ...state,
    manifestsFor: {
      ...state.manifestsFor,
      [accountName]: {
        ...manifestsForAccount,
        [repoName]: update(manifestsForAccount[repoName] || {}),
      },
    },
  };
};

const reqManifests = (state, {accountName, repoName, requestedAt}) => (
  updateManifestsFor(state, accountName, repoName, oldState => ({
    ...initialManifestsState,
    isFetching: true,
    requestedAt,
  }))
);

const reqManifestsFail = (state, {accountName, repoName}) => (
  updateManifestsFor(state, accountName, repoName, oldState => ({
    ...oldState,
    isFetching: false,
    data: null,
  }))
);

const recvManifests = (state, {accountName, repoName, data}) => (
  updateManifestsFor(state, accountName, repoName, oldState => ({
    ...oldState,
    data: [ ...(oldState.data || []), ...data ],
  }))
);

const recvManifestsDone = (state, {accountName, repoName, receivedAt}) => (
  updateManifestsFor(state, accountName, repoName, oldState => ({
    ...oldState,
    isFetching: false,
    receivedAt,
  }))
);

////////////////////////////////////////////////////////////////////////////////
// manifests

const updateManifestFor = (state, accountName, repoName, digest, update) => {
  const manifestsForAccount = state.manifestFor[accountName] || {};
  const manifestsForRepo = manifestsForAccount[repoName] || {};
  return {
    ...state,
    manifestFor: {
      ...state.manifestFor,
      [accountName]: {
        ...manifestsForAccount,
        [repoName]: {
          ...manifestsForRepo,
          [digest]: update(manifestsForRepo[digest] || {}),
        },
      },
    },
  };
};

const reqManifest = (state, {accountName, repoName, digest, requestedAt}) => (
  updateManifestFor(state, accountName, repoName, digest, oldState => ({
    ...initialManifestState,
    isFetching: true,
    requestedAt,
  }))
);

const reqManifestFail = (state, {accountName, repoName, digest}) => (
  updateManifestFor(state, accountName, repoName, digest, oldState => ({
    ...oldState,
    isFetching: false,
    data: null,
  }))
);

const recvManifest = (state, {accountName, repoName, digest, data, receivedAt}) => (
  updateManifestFor(state, accountName, repoName, digest, oldState => ({
    ...oldState,
    isFetching: false,
    data,
    receivedAt,
  }))
);

const deleteManifest = (state, {accountName, repoName, digest}) => (
  updateManifestsFor(state, accountName, repoName, oldState => ({
    ...oldState,
    data: (oldState.data || []).filter(m => m.digest != digest),
  }))
);

////////////////////////////////////////////////////////////////////////////////

export const keppel = (state, action) => {
  if (state == null) {
    state = initialState;
  }

  switch(action.type) {
    case constants.REQUEST_ACCOUNTS:         return reqAccts(state, action);
    case constants.REQUEST_ACCOUNTS_FAILURE: return reqAcctsFail(state);
    case constants.RECEIVE_ACCOUNTS:         return recvAccts(state, action);
    case constants.UPDATE_ACCOUNT:           return updateAcct(state, action);
    case constants.DELETE_ACCOUNT:           return deleteAcct(state, action);
    case constants.REQUEST_REPOSITORIES:          return reqRepos(state, action);
    case constants.REQUEST_REPOSITORIES_FAILURE:  return reqReposFail(state, action);
    case constants.RECEIVE_REPOSITORIES:          return recvRepos(state, action);
    case constants.REQUEST_REPOSITORIES_FINISHED: return recvReposDone(state, action);
    case constants.DELETE_REPOSITORY:             return deleteRepo(state, action);
    case constants.REQUEST_MANIFESTS:          return reqManifests(state, action);
    case constants.REQUEST_MANIFESTS_FAILURE:  return reqManifestsFail(state, action);
    case constants.RECEIVE_MANIFESTS:          return recvManifests(state, action);
    case constants.REQUEST_MANIFESTS_FINISHED: return recvManifestsDone(state, action);
    case constants.REQUEST_MANIFEST:         return reqManifest(state, action);
    case constants.REQUEST_MANIFEST_FAILURE: return reqManifestFail(state, action);
    case constants.RECEIVE_MANIFEST:         return recvManifest(state, action);
    case constants.DELETE_MANIFEST:            return deleteManifest(state, action);
    default: return state;
  }
};
