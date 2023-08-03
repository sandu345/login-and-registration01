import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleButton } from 'react-google-button';

import { db } from "../utils/firebase.config"
import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    deleteDoc
  } from "firebase/firestore"





const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

 

  const [fName, setfName] = useState("");
  const [validfName, setValidfName] = useState(false);
  const [fNameFocus, setfNameFocus] = useState(false);

  const [lName, setlName] = useState("");
  const [validlName, setValidlName] = useState(false);
  const [lNameFocus, setlNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [role, setRole] = useState("customer");

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidfName(USER_REGEX.test(fName));
  }, [fName]);

  useEffect(() => {
    setValidlName(USER_REGEX.test(lName));
  }, [lName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [fName, lName, pwd, email, matchPwd]);

  /////////////////////////
  const addCustomer = async(fName, lName, email, pwd) => {
    try{
      const customerCollectionRef = collection(db, 'customerCollection');
      await addDoc(customerCollectionRef, {
        fName,
        lName,
        email,
        pwd,
      });
      return true;
    }catch (error){
        console.error('Error adding customer:', error);
        return false;
    }
  };

  const addDeveloper = async(fName, lName, email, pwd) => {
    try{
      const developerCollectionRef = collection(db, 'developerCollection');
      await addDoc(developerCollectionRef, {
        fName,
        lName,
        email,
        pwd,
      });
      return true;
    }catch (error){
        console.error('Error adding developer:', error);
        return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    //const v1 = USER_REGEX.test(user);
    const v2 = USER_REGEX.test(fName);
    const v3 = USER_REGEX.test(lName);
    const v4 = EMAIL_REGEX.test(email);
    const v5 = PWD_REGEX.test(pwd);
    if (!v2 || !v3 || !v4 || !v5) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ fName, lName, email, pwd, role }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (role === "customer") {
        await addCustomer(fName, lName, email, pwd);
      } else if (role === "developer") {
        await addDeveloper(fName, lName, email, pwd);
      }
     
      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      setfName("");
      setlName("");
      setPwd("");
      setMatchPwd("");

      navigate.push('/');
      
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="role">
              Choose Role:
            </label>
            <select
              type='text'
              id="role"
              onChange={(e) => setRole(e.target.value)}
              value={role}
              required
            >
              <option value="customer">Customer</option>
              <option value="developer">Developer</option>
            </select>
            <label htmlFor="fName">
              First Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validfName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validfName || !fName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="fName"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setfName(e.target.value)}
              value={fName}
              required
              aria-invalid={validfName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setfNameFocus(true)}
              onBlur={() => setfNameFocus(false)}
            />
            <p
              id="uidnote"
              className={
                fNameFocus && fName && !validfName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="lName">
              Last Name:
              <FontAwesomeIcon
                icon={faCheck}
                className={validlName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validlName || !lName ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="lName"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setlName(e.target.value)}
              value={lName}
              required
              aria-invalid={validlName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setlNameFocus(true)}
              onBlur={() => setlNameFocus(false)}
            />

            <p
              id="uidnote"
              className={
                lNameFocus && lName && !validlName ? "instructions" : "offscreen"
              }
            >

              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="email">
              Email:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail ? "instructions" : "offscreen"
              }
            ></p>
            {/* <label htmlFor="email">
              Email:
            </label>
            <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="uidnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}>
            
            </input>
            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail ? "instructions" : "offscreen"
              }
            ></p> */}

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={!validfName || !validlName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
            {/* <br />
            <GoogleButton /> */}
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              <Link to="/">Sign In</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};
  

export default Register;
