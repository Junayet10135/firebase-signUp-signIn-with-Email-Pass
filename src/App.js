import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import app from "./firebase.init";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useState } from "react";

const auth = getAuth(app);


function App() {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false);

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }
  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }
  const handleCheckChange = event =>{
      setRegistered(event.target.checked);
  }
  const verifyEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      setError('Email verification message sent check mail (inbox/spam)');
    })
    .catch(error =>{
      console.error(error);
    })
  }
  const handleSubmit = event => {
    event.preventDefault();

    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError('At least 1 special character use')
      return;
    }
    setError('');
   if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('');
        })
      .catch(error => {
        setError(error.message);
      })
   }
   else{
     createUserWithEmailAndPassword(auth, email, password)
       .then(result => {
         const user = result.user;
         console.log(user);
         setEmail('');
         setPassword('');
          verifyEmail();
       })
       .catch(error => {
         setError(error.message);
       })
   }
  }
  const handleResetPassword =()=>{
    sendPasswordResetEmail(auth, email)
    .then(()=>{
      setError('Password reset Email sent check mail (inbox/spam)');
    })
  }

  return (
    <div >

      <div className="registration mx-auto w-50 mt-4">
        <h2 className="text-primary">Please {registered? 'Log In' : 'registration'}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleCheckChange} type="checkbox" label="All ready Registered" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button variant="primary" type="submit">
            {registered ? 
              'Log In'
            : 'Register'}
          </Button><br/>
          <Button className="" onClick={handleResetPassword} variant="link">Reset Password</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
