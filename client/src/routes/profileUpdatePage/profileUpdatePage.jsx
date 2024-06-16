import { useContext, useEffect, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import UploadImage from "../../components/uploadImages/UploadImage";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [avatar, setAvatar] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    let password = formData.get("password");

    try {
      let updatedUser = {
        username,
        email,
        avatar: avatar.length > 0 ? avatar[0] : currentUser.avatar,
      }
      if (password) updatedUser.password = password;
      const res = await apiRequest.put(`/user/${currentUser._id}`, updatedUser);
      console.log(res.data);
      updateUser(res.data.user);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      let err = error.response.data.errors ? error.response.data.errors[0].msg : error.response.data.message;
      setError(err);
    }
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button disabled={isLoading}>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar.length > 0 ? avatar[0] : "/noavatar.jpg"} alt="" className="avatar" />

        <UploadImage uwConfig={{
          cloudName: "dugg68pex",
          uploadPreset: "estate",
          multiple: false,
          maxImageFileSize: 3000000,
          folder: "avatar",
        }}
         setState={setAvatar}
      />

      </div>
    </div>
  );
}

export default ProfileUpdatePage;
