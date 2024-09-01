"use client";
import React, { useEffect } from "react";
import RegisterPage from "./Register.js";
import LoginPage from "./Login";
import UpdatePage from "./Update";
import { FaUser, FaWindowClose as Close } from "react-icons/fa";
import { motion } from "framer-motion"

const FormUsuarios = ({ show, setShow, form, setForm }) => {

  useEffect(() => {
    if (show) {
      document.getElementById("modal-component-container").classList.remove("hidden");
    } else {
      setTimeout(() => {
        document.getElementById("modal-component-container").classList.add("hidden");
      }, 500);
    }
  }, [show]);

  return (
      <div id="modal-component-container" className="fixed inset-0 z-50 overflow-scroll hidden">
        <motion.div
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ ease: 'easeIn', duration: 0.5 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-flex-container flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="modal-bg-container fixed inset-0 bg-gray-700 bg-opacity-75">
            </div>
            <div className="modal-space-container hidden sm:inline-block sm:align-middle sm:h-screen">
              &nbsp
            </div>
              <div id="modal-container" className="modal-container inline-block bg-white rounded-2xl  
                  text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-xl transform">
                  <div className="modal-wrapper bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="modal-wrapper-flex flex items-start justify-between ">
                          <div className="modal-icon mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-200 sm:mx-0 sm:h-10 sm:w-10">
                            <FaUser className="h-6 w-6 text-black" />
                          </div>
                          <div className="modal-content text-center mt-3 sm:mt-0 sm:ml-4 sm:text-left">                              
                            <div className="modal-text mt-2">
                              {
                                  form===0
                                  ?
                                      null
                                  : form===1
                                    ?
                                      <RegisterPage setShow={setShow} setForm={setForm}/>
                                    : form===2
                                      ? <LoginPage setShow={setShow} setForm={setForm}/>
                                      : form===3 &&
                                        <UpdatePage setShow={setShow} setForm={setForm}/>
                              }
                            </div>
                          </div>
                          <div className="justify-self-end flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-full bg-red-200
                                sm:mx-0 sm:h-10 sm:w-10 cursor-pointer "
                            onClick={() => setShow(false)}>
                            <Close className="h-6 w-6 text-red-600" />
                          </div>                              
                      </div>  
                  </div>
                </div>
            </div>
          </motion.div>
      </div>
  );
};

export default FormUsuarios;