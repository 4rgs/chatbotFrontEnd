import React, { useState, useEffect, useRef } from "react";
import socket from "./Socket";
import "../App.css";
import axios from 'axios'

const Chat = ({ nombre }) => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const url = 'http://127.0.0.1:4000/chat'

  
  useEffect(() => {
    socket.emit("conectado", nombre);
  }, [nombre]);

  useEffect(() => {
    const fetchMensaje = (msg_emisor) => {
      axios.post(url,{
        "entrada": msg_emisor
      }).then((response) => {
        socket.emit("respuesta", response.data.nombre,response.data.mensaje);
        console.log(response.data)
      });
    }

    socket.on("mensajes", (mensaje) => {
      setMensajes([...mensajes, mensaje]);
      fetchMensaje(mensaje)
    });

    socket.on("respuestas", (respuesta) => {
      setRespuestas([...mensajes, respuesta]);
      console.log(respuesta)
    });

    return () => {
      socket.off();
    };
  }, [mensajes]);

  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const submit = (e) => {
    e.preventDefault();
    socket.emit("mensaje", nombre, mensaje);
    setMensaje("");
  };

  return (
    <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      <div className="flex flex-col  h-72 space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        
        {respuestas && respuestas.map((e, i) => (
          <div key={i} className="flex items-end justify-end rounded-lg">
            <div className="flex flex-col bg-gray-200 rounded-lg p-2 space-y-2 text-xs max-w-xs mx-2 order-2 items-start">{e.mensaje}</div>
            <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">{e.nombre}</div>
          </div>
        ))}
        <div ref={divRef}></div>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="">Escriba su mensaje</label>
        <input
          name=""
          id=""
          type="text"
          className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        ></input>
        <button className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-orange-600 hover:bg-orange-500 focus:outline-none">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
