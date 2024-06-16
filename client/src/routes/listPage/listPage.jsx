import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData()

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter />
        <Suspense fallback={<div>Loading...</div>}>
          <Await
            resolve={data.postResponse}
            errorElement={<div>Failed to load data</div>}
          >
            {(postResponse) =>
              // return <div>Posts: {postResponse.data.length}</div>
              postResponse.data.data.map(item => (
                <Card key={item._id} item={item} />
              ))
            }

          </Await>
        </Suspense>
      </div>
    </div>
    <div className="mapContainer">
      {/* <Map items={data}/> */}

      <Suspense fallback={<div>Loading...</div>}>
        <Await
          resolve={data.postResponse}
          errorElement={<div>Failed to load data</div>}
        >
          {(postResponse) =>
            <Map items={postResponse.data.data} />
          }

        </Await>
      </Suspense>
    </div>
  </div>;
}

export default ListPage;
