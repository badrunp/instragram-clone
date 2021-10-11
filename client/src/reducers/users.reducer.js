export const initialState = null;

export const userReducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "LOGOUT":
      return null;
    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "UPDATEPHOTO":
      return {
        ...state,
        photo: action.payload,
      };
    default:
      return state;
  }
};
