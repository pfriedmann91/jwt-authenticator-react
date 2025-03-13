const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			token: null, 
			user: null, 
			error: null
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			signup: async (email, password) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password })
					});
					const data = await resp.json();
					if (resp.ok) {
						setStore({ error: null });
						return true;
					}
					throw new Error(data.message);
				} catch (error) {
					console.log("Error en signup:", error);
					setStore({ error: error.message });
					return false;
				}
			},

			login: async (email, password) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password })
					});
					const data = await resp.json();
					if (resp.ok) {
						setStore({ token: data.access_token, error: null });
						sessionStorage.setItem("token", data.access_token);
						return true;
					}
					throw new Error(data.message);
				} catch (error) {
					console.log("Error en login:", error);
					setStore({ error: error.message });
					return false;
				}
			},

			logout: () => {
				setStore({ token: null, user: null, error: null });
				sessionStorage.removeItem("token");
			},


			checkToken: () => {
				const token = sessionStorage.getItem("token");
				if (token) {
					setStore({ token });
					getActions().getPrivate();
				} else {
					setStore({ token: null, user: null });
				}
			},
			
			getPrivate: async () => {
				const token = getStore().token || sessionStorage.getItem("token");
				if (!token) {
					console.log("No token available");
					setStore({ error: "No estás autenticado" });
					return;
				}

				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/private", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`,
						},
					});
					const data = await resp.json();
					if (resp.ok) {
						setStore({ user: data.message, error: null });
					} else {
						throw new Error(data.message || "Error al acceder a datos privados");
					}
				} catch (error) {
					console.log("Error en getPrivate:", error);
					setStore({ error: error.message });
				}
			}
		}
	};
};

export default getState;