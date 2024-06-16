import { defer } from "react-router-dom";
import apiRequest from "./apiRequest"

export const singlePageLoader = async ({request,params}) => {
    const res = await apiRequest("/post/"+params.id)
    return res.data.data;
}

export const listPageLoader = async ({request}) => {
    const query = request.url.split("?")[1];
    const postPromise = await apiRequest("/post" + `?${query}`)
    return defer ({
        postResponse: postPromise,
    })
}

export const profilePageLoader = async () => {
    // const query = request.url.split("?")[1];
    const postPromise = await apiRequest("/user/posts")
    const chatPromise = await apiRequest("/chat")
    return defer ({
        postResponse: postPromise,
        chatResponse: chatPromise
    })
}