import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.checkToken();
        if (!store.token) navigate("/login");
        actions.getPrivate();
    }, [store.token, actions, navigate]);

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    return (
        <div className="text-center mt-5">
            <h1>Navegación Privada</h1>
            <p>{store.user || "Has entrado a la navegación privada, apruebame esta tarea porfa"}</p>
            <button onClick={handleLogout} className="btn btn-secondary">Cerrar Sesión</button>
        </div>
    );
};