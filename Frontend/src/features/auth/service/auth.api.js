import axios from 'axios'


const authApiInstance = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
})


export async function register({email,password,contact,fullname , isSeller}){

    const responce = await authApiInstance.post("/register",{
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return responce.data
}

export async function login({email , password}){
    const response = await authApiInstance.post("/login",{
        email,
        password
    })
    return response.data
}



