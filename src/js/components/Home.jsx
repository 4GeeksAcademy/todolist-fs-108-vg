import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { TodoListFetch } from "./TodoListFetch";

//create your first component
const Home = () => {
	return (
		<div className="text-center">
           
         <TodoListFetch/>
		 
		</div>
	);
};

export default Home;