export default function clientMiddleware(apiClient, graphQLClient) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, graphQL, types, ...rest } = action; // eslint-disable-line no-redeclare
      let actionPromise;
      if (promise) {
        actionPromise = promise(apiClient);
      } else if (graphQL) {
        actionPromise = graphQL(graphQLClient);
      } else {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      actionPromise.then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch((error)=> {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
