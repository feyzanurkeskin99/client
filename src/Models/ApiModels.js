import axios from 'axios';

export const getApiModels = async(url)=>{
    try{
        const res = await axios.get(process.env.REACT_APP_URL+url);
        return {status :true, data : res.data}
    }catch(e){
        return {status : false, message: e}
    }
}

export const deleteApiModels = async(url)=>{
    try{
        const headers = { 
            'Authorization': 'Bearer my-token',
            'My-Custom-Header': 'foobar'
        };
        const res = await axios.delete(process.env.REACT_APP_URL+url, { headers })
        return {status :true, data : res.data}
    }catch(e){
        return {status : false, message: e}
    }
}

export const deleteApiModelsFetch = async(url, msg)=>{
    try{
        const headers= new Headers();
        headers.append("Content-Type","application/x-www-form-urlencoded");
        const body = new URLSearchParams();
        body.append("Delete",JSON.stringify(msg.Delete));
    
        let options={
            method:"DELETE",
            body:body,
            headers:headers
        }
        return fetch(process.env.REACT_APP_URL+url,options)
        .then(response=>response.json())

    }catch(e){
        return {status : false, message: e}
    }
}

export const updateApiModels = async(url, msg)=>{
    try{

        // await axios({
        //     method: 'post',
        //     url: process.env.REACT_APP_URL+url,
        //     body: msg
        // });
        // await axios.post(process.env.REACT_APP_URL+url, msg,{body:msg})


        const headers= new Headers();
        headers.append("Content-Type","application/x-www-form-urlencoded");
        const body = new URLSearchParams();
        body.append("Update",JSON.stringify(msg.Update));
    
        let options={
            method:"PUT",
            body:body,
            headers:headers
        }
        return fetch(process.env.REACT_APP_URL+url,options)
        .then(response=>response.json())

    }catch(e){
        return {status : false, message: e}
    }
}

export const setApiModels = async(url, msg)=>{
    try{

        // await axios({
        //     method: 'post',
        //     url: process.env.REACT_APP_URL+url,
        //     body: msg
        // });
        // await axios.post(process.env.REACT_APP_URL+url, msg,{body:msg})


        const headers= new Headers();
        headers.append("Content-Type","application/x-www-form-urlencoded");
        const body = new URLSearchParams();
        body.append("SignUp",JSON.stringify(msg.SignUp));
    
        let options={
            method:"POST",
            body:body,
            headers:headers
        }
        return fetch(process.env.REACT_APP_URL+url,options)
        .then(response=>response.json())

    }catch(e){
        return {status : false, message: e}
    }
}
export const setAddContactApiModels = async(url, msg)=>{
    try{

        const headers= new Headers();
        headers.append("Content-Type","application/x-www-form-urlencoded");
        const body = new URLSearchParams();
        body.append("Contacts",JSON.stringify(msg.Contacts));
    
        let options={
            method:"POST",
            body:body,
            headers:headers
        }
        return fetch(process.env.REACT_APP_URL+url,options)
        .then(response=>response.json())

    }catch(e){
        return {status : false, message: e}
    }
  
}
export const setLoginApiModels = async(url, msg)=>{
    try{
        // await axios({
        //     method: 'post',
        //     url: process.env.REACT_APP_URL+url,
        //     body: msg
        // });
        // await axios.post(process.env.REACT_APP_URL+url, msg,{body:msg})


        const headers= new Headers();
        headers.append("Content-Type","application/x-www-form-urlencoded");
        const body = new URLSearchParams();
        body.append("Login",JSON.stringify(msg.Login));
    
        let options={
            method:"POST",
            body:body,
            headers:headers
        }
        return fetch(process.env.REACT_APP_URL+url,options)
        .then(response=>response.json())

    }catch(e){
        return {status : false, message: e}
    }
  
}
export const setMessagesApiModels = async(url, msg)=>{
    try{
        // await axios({
        //     method: 'post',
        //     url: process.env.REACT_APP_URL+url,
        //     body: msg
        // });
        // await axios.post(process.env.REACT_APP_URL+url, msg,{body:msg})


        const headers= new Headers();
        headers.append("Content-Type","application/x-www-form-urlencoded");
        const body = new URLSearchParams();
        body.append("Messages",JSON.stringify(msg.Messages));
    
        let options={
            method:"POST",
            body:body,
            headers:headers
        }
        return fetch(process.env.REACT_APP_URL+url,options)
        .then(response=>response.json())

    }catch(e){
        return {status : false, message: e}
    }
  
}