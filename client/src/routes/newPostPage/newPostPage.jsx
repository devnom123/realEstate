import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UploadImage from "../../components/uploadImages/UploadImage";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function NewPostPage() {
  const [value, setValue] = useState("")
  const [images, setImages] = useState([]);

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      title: formData.get("title"),
      price: parseInt(formData.get("price")),
      address: formData.get("address"),
      city: formData.get("city"),
      bedroom: parseInt(formData.get("bedroom")),
      bathroom: parseInt(formData.get("bathroom")),
      // location: {
      //   coordinates: [parseFloat(formData.get("latitude")), parseFloat(formData.get("longitude"))]
      // },
      latitude: parseFloat(formData.get("latitude")),
      longitude: parseFloat(formData.get("longitude")),
      type: Number(formData.get("type")),
      property: Number(formData.get("property")),
      images: images,
      postData: {
        utilities: Number(formData.get("utilities")),
        pet: Number(formData.get("pet")),
        income: parseInt(formData.get("income")),
        size: parseInt(formData.get("size")),
        school: parseInt(formData.get("school")),
        bus: parseInt(formData.get("bus")),
        restaurant: parseInt(formData.get("restaurant")),
        description: value,
      }
    };
    console.log(data);
    try {
      const res = await apiRequest.post("/post", data);
      console.log(res.data,"data");
      navigate(`/${res.data.data._id}`)
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill id="desc" name="desc" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="2" defaultChecked>
                  Rent
                </option>
                <option value="1">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="1">House</option>
                <option value="2">Apartment</option>
                <option value="3">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="1">Owner is responsible</option>
                <option value="2">Tenant is responsible</option>
                <option value="3">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="1">Allowed</option>
                <option value="2">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {
          images.map((image, index) => (
            <img key={index} src={image} alt={`image-${index}`} />
          ))
        }
        <UploadImage
          uwConfig={{
            cloudName: "dugg68pex",
            uploadPreset: "estate",
            multiple: true,
            maxImageFileSize: 3000000,
            folder: "post",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
