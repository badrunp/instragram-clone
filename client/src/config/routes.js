import React, { createContext, useEffect, useReducer } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Navbar from "../component/Navbar";
import CreatePost from "../pages/createPost";
import AllPosts from "../pages/AllPosts";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Profil from "../pages/Profil";
import Register from "../pages/Register";
import UserProfil from "../pages/UserProfil";
import { initialState, userReducer } from "../reducers/users.reducer";
import Comment from "../pages/Comment";
import PostDetailt from "../pages/PostDetailt";
import Users from "../pages/Users";
import UsersFollowing from "../pages/UsersFollowing";
import UsersFollowers from "../pages/UsersFollowers";

export const UserContext = createContext();

function Routes() {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, [history]);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />

        <div className="layout-container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/allposts" component={AllPosts} />
            <Route path="/post/create" component={CreatePost} />
            <Route exact path="/profil" component={Profil} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/profil/post/:postid" component={PostDetailt} />
            <Route
              path="/profil/followers/:userid"
              component={UsersFollowers}
            />
            <Route
              path="/profil/following/:userid"
              component={UsersFollowing}
            />
            <Route path="/profil/:userid" component={UserProfil} />

            <Route path="/users" component={Users} />
            <Route path="/comment/:postid" component={Comment} />
          </Switch>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default Routes;
