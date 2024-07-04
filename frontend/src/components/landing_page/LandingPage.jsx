import React from "react";
import "./LandingPage.css";
import Nav from "./navbar/Nav";
import Intro from "./header/Intro";
import Purpose from "./purpose/Purpose";
import How from "./how_it_works/How";
import Spacing from './spacing/Spacing';
import Why from "./whyUs/Why";
import Contact from "./contact/Contact";
import Footer from './footer/Footer'

export const LandingPage = () => {
    return (
        <>
            <Nav/>
            <Spacing/>
            <Intro/>
            <Spacing/>
            <Purpose/>
            <Spacing/>
            <How/>
            <Spacing/>
            <Why/>
            <Spacing/>
            <Contact/>
            <Spacing/>
            <Footer/>
        </>
    )
}