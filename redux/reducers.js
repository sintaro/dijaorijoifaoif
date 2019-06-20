export default reducers = (state = {
    loggedIn: false,
  }, action) => {
    switch (action.type) {
      case 'LOGIN': {
        return { ...state, user: action.payload }
      }
    }
    return state;
} 