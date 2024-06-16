import { useState } from "react";
import "./searchBar.scss";
import constants from "../../lib/constants";
import { getKeysFromValue } from "../../lib/helper";
import { Link } from "react-router-dom";

const { postType } = constants

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    location: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
        <input type="text" name="city" placeholder="City Location" value="" onChange={handleChange} />
        <input
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link to={`/list?type=${getKeysFromValue(postType,query.type)}&city=${query.city || null}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`} >
        <button>
          <img src="/search.png" alt="" />
        </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
