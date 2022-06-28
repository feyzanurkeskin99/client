const app = require('express')();
const http=require('http').Server(app);
const io=require('socket.io')(http);
var port =3001;
const jwt = require('jsonwebtoken')


app.get('/', (req,res)=>{
    res.send('Socket server')
});

let users=[]

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(token)
    if (!token) {
        console.log("A token is required for authentication");
        const err = new Error("not authorized");
        err.data = { content: "Please retry later" }; // additional details
        next(err);
    }else{
        jwt.verify(token,"123456789",async (err,decoded)=>{

        if (err) {
            
            socket.broadcast.emit('token_verify_socket', {status: false, message: err, statusCode:401});
            socket.emit('token_verify_socket', {status: false, message: err, statusCode:401});
            // const err = new Error("not authorized");
            // err.data = { content: "Please retry later" }; // additional details
            // next(err);
        
        }else{
            console.log(decoded);
            socket.broadcast.emit('token_verify_socket', {status: true, message: "Token Verify Successfull", statusCode:200});
            socket.emit('token_verify_socket', {status: true, message: "Token Verify Successfull", statusCode:200});
            next();
        }
        })
        .catch ((err)=> {
            console.log("Token is not a valid id. Please login");
        });
    }

})
.on('connection', (socket)=>{
    console.log('connection oldu')
    socket.on('token_verify_socket',(data)=>{
        socket.broadcast.emit('token_verify_client', {status: false, message: data.message, statusCode:401});
        socket.emit('token_verify_client', {status: false, message: data.message, statusCode:401});
        
        console.log("data "+data)
        // socket.emit('token_verify_client', {status: true, message: "Token Verify Successfull", statusCode:200});
    })
    //socket.on kodunda ilk parametre app kısmında sockete gönderdiğimiz verinin key adı olmalı(key-value mantığı)
    socket.on('dataMsg',(data)=>{
        console.log(data)
        //veri kendi dışındaki tüm herkese gidiyor.
        socket.broadcast.emit('message', { text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});

        //verinin kendine de gelmesini istersek broadcast'i siliyoruz.
        socket.emit('message', {text: `${data.msg}`, email:data.email, name:data.name, time:data.time, date:data.date, to:data.to, toEmail:data.toEmail});
    })

    socket.on('login',(data)=>{
        users.push=data.email
        //veri kendi dışındaki tüm herkese gidiyor.
        socket.broadcast.emit('user', { activeUsers:users});

        //verinin kendine de gelmesini istersek broadcast'i siliyoruz.
        socket.emit('user', {activeUsers:users});
        // users.map((element)=> console.log(element))
    })

    socket.on('logout',(data)=>{
        // users.length=0
        users=users.filter((element)=> element !== data.email)
        //veri kendi dışındaki tüm herkese gidiyor.
        socket.broadcast.emit('user', { activeUsers:users});

        //verinin kendine de gelmesini istersek broadcast'i siliyoruz.
        socket.emit('user', {activeUsers:users});
        // users.map((element)=> console.log(element))
    })



});

http.listen(port, ()=>{
    console.log(`server is running port: http://localhost:${port}`); 
})
