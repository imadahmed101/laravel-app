import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const [errors, setErrors] = useState(null)

    const {setUser, setToken} = useStateContext()

    const onSubmit = (ev) => {
        ev.preventDefault()
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        setErrors(null)
        axiosClient.post('/login', payload)
        .then(({data}) => {
            setUser(data.user)
            setToken(data.token)
        })
        .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
                if (response.data.errors){

                    setErrors(response.data.errors)
                }
                else {
                    setErrors({
                        email: [response.data.message]
                    })
                }
            }
        })
    }

  return (
    <div className='login-signup-form animated fadeInDown'>
        <div className='form'>
            <form onSubmit={onSubmit}>
                <h1 className='title'>Login to your account</h1>
                {
                        errors && <div className='alert'>
                            {Object.keys(errors).map(key => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    }
                <input ref={emailRef} type='email' placeholder='Email'/>
                <input ref={passwordRef} type='password' placeholder='Password'/>
                <button className='btn btn-block'>Login</button>
                <p className='message'>
                    Not Registered? <Link to='/register'>Create an account</Link>
                </p>
            </form>

        </div>

    </div>
  )
}

export default Login