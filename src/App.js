import React, { useState, useEffect } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"

import firebase from "./config/firebase"

import Header from "./Header"
import Footer from "./Footer"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import Room from "./Room"

import ResetStyle from "./Style/ResetStyle"
import GlobalStyle from "./Style/GlobalStyle"

const App = () => {
    const [user, setUser] = useState("");
    const didSignin = firebase.auth().currentUser
    
    const userSignIn = (eMailValue, passValue) => {
        firebase.auth().signInWithEmailAndPassword(eMailValue, passValue)
        .then(res => {
            console.log(res);
            setUser(res.user.displayName)
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    const addUser = (userName, email, pass) => {
        firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(res => {
            res.user.updateProfile({
                displayName: userName
            })
            setUser(res.user.displayName)
            console.log("User created.");
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log("getuser", user.displayName);
                setUser(user.displayName)
            } else {
                console.log("please signin");
                setUser("")
            }
        })
    }, [])
    
    return (
        <>
            <ResetStyle />
            <GlobalStyle />
            <Header />
            <Router>
                <Switch>
                    <Route path = "/signin">
                        {
                            didSignin
                                ? <Redirect to="/" />
                                : <SignIn
                                    userSignIn = { userSignIn }
                                />
                        }
                    </Route>
                    <Route path = "/signup">
                        {
                            didSignin
                                ? <Redirect to="/" />
                                :<SignUp 
                                    addUser = { addUser }
                                />
                        }
                    </Route>
                    <Route exact path = "/">
                        {
                            didSignin
                                ? <Room 
                                    user = { user }
                                />
                                : <Redirect
                                    to="/signin"
                                />
                        }
                    </Route>
                </Switch>
            </Router>
            <Footer />
        </>
    )
}

export default App