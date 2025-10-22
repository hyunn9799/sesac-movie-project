import axios from "axios"

 
const DOMAIN = process.env.NEXT_PUBLIC

export const request = async(method,url,data) => {
    return await axios({
        method,
        url : `${DOMAIN}${url}`,
        data
    })
    .then(res => res.data)
    .catch(error => {
        console.error(error);
        throw error;
    })
}