import React, { useState } from "react";
import Login from "./Login";
import './Bound.css'
import Register from "./Register";
import { useSelector } from "react-redux";
import Captch from "./Captch";

interface BoundProps {}

const Bound: React.FC<BoundProps> = ({}) => {
  const { openCaptcha } = useSelector((state: any) => state.model);
 
  const [show,setShow] = useState(true)
  return (
    <div>
      {openCaptcha && <Captch /> }
     {show ? <Login show ={show} setShow={setShow} /> : <Register />}
    </div>
  );
};

export default Bound;
