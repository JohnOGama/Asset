// eslint-disable-next-line
/* eslint-disable react/prop-types  */
//- eliminate error in {children} props

import PropTypes from 'prop-types';
import React,{ useState} from "react";

const initialState = {
    userid: '',
    displayName: ''
};

export const Context = React.createContext();

const Store = ({children}) => {
    
    const [state,setState] = useState(initialState);

    return (
        <Context.Provider value= {[state,setState]}> {children}</Context.Provider>
    );

};

//Store.propTypes = { children: PropTypes.string };

//Store.propTypes = {
//    children: PropTypes.string // use the PropTypes object to define valid prop types
//};

export default Store;
