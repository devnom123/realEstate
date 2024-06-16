import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const navigate = useNavigate();
  const data = useLoaderData()
  const { currentUser, updateUser } = useContext(AuthContext)
  const handleLogout = async () => {
    updateUser(null);
    navigate("/login");
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to='/profile/update'>
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt=""
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add-post">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<div>Failed to load data</div>}
            >
              {(postResponse) =>
                // return <div>Posts: {postResponse.data.length}</div>
                <List posts = {postResponse.data.userPosts} />
              }

            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<div>Failed to load data</div>}
            >
              {(postResponse) =>
                // return <div>Posts: {postResponse.data.length}</div>
                <List posts = {postResponse.data.savedPost} />
              }

            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
        <Suspense fallback={<div>Loading...</div>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<div>Error loading chats....</div>}
            >
              {(chatResponse) =>
                // return <div>Posts: {postResponse.data.length}</div>
                <Chat chats = {chatResponse.data} />
              }

            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
