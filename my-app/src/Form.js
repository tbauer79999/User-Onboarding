import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({

  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Must include email address"),
  password: yup
    .string()
    .min(6, "Passwords must be at least 6 characters long.")
    .required("Password is Required"),
  terms: yup.boolean().oneOf([true], "You must agree to terms of use"),
});
 

function Form() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });


  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      setButtonDisabled(!valid);
    });
  }, [formState]);
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  const validate = (e) => {
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    yup
      .reach(formSchema, e.target.name)
      .validate(value)
      .then((valid) => {
        setError({
          ...error,
          [e.target.name]: "",
        });
      })

      .catch((err) => {
        setError({
          ...error,
          [e.target.name]: err.errors[0],
        });
      });
  };

  const handleChange = (e) => {
    e.persist(); 
    validate(e);
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };



 const [users, setUsers] = useState([]);
 const formSubmit = (e) => {
   e.preventDefault();
   console.log("FORM ACCEPTED & VALIDATED");
   axios
     .post("https://reqres.in/api/users", formState)
     .then((res) => {
       setUsers(res.data);
     })
     .catch((err) => console.log(err));
 };



  return (
    <form onSubmit={formSubmit}>
      <div>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            id="name"
            value={formState.name}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
          />
          {error.email.length > 0 ? <p>{error.email}</p> : null}
        </label>
      </div>

      <div>
        <label htmlFor="password">
          Password
          <input
            id="password"
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
          {error.password.length > 0 ? <p>{error.password}</p> : null}
        </label>
      </div>

      <div>
        <label htmlFor="terms">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formState.terms}
            onChange={handleChange}
          />
          Terms & Conditions
          {error.terms.length > 0 ? <p>{error.terms}</p> : null}
        </label>
      </div>

      <div>
        <button disabled={buttonDisabled}>Submit
        </button>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </div>
    </form>
  );
}
export default Form;