import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import './css/components.css';

let animating = false;
function DaddyNav(props){

    //props. show UpALevel icon: string, show Home icon: bool, parentComponent: string

    const [isOpen, setIsOpen] = useState(true);
    const [navIconOpacity, setNavIconOpacity] = useState([0.05, 0.05, 0.05]);
    useEffect(()=>{
        return (()=>animating = false);
        
    })
    const toggle = () => setIsOpen(!isOpen);
    const handleIconHover = (e, icon)=>{
        navIconOpacity[icon]=0.5;
        setNavIconOpacity([...navIconOpacity]);
    }
    const handleIconNoHover = (e, icon)=>{
        if(icon === 0){
            if(isOpen){
                navIconOpacity[icon]=0.05;
                setNavIconOpacity([...navIconOpacity]);
            }
            
        }else{
            navIconOpacity[icon]=0.05;
            setNavIconOpacity([...navIconOpacity]);
        }        
    }
    const handleClickHomeIcon = (e)=>{
        if(!animating){
            animating = true;
            props.homeIconClick();
            console.log('home icon triggered');
        }        
    }
    const handleClickParentIcon = (e)=>{
        if(!animating){
            animating = true;
            props.parentIconClick();
        }
    }
    return (
        <div>
            <Navbar fixed="top" light style={{ height: 80, width:'300px'}}>
                <NavbarToggler 
                    onClick={toggle} 
                    className='mr-2'  
                    style={{
                        border:'2px solid rgba(0, 0, 0,'+ navIconOpacity[0]+')', 
                        height:'70px', 
                        width:'70px'
                    }}
                    onMouseEnter={e=>handleIconHover(e, 0)}
                    onMouseLeave={e=>handleIconNoHover(e, 0)}
                />
                {/* <NavbarToggler onClick={toggle} className='mr-2'  style={{border:'2px solid red'}}/> */}
                {/* <img style={{height:'100px', width:'100px', border:'1px solid black'}}></img> */}
                {(props.homeIcon && 
                    <NavbarBrand href='#' // return to home pange
                        style={{
                            height:'70px', 
                            width:'70px', 
                            border:'2px solid rgba(0, 0, 0,'+ navIconOpacity[2]+')', 
                            borderRadius:'5px'
                        }}
                        onMouseEnter={e=>handleIconHover(e, 2)}
                        onMouseLeave={e=>handleIconNoHover(e, 2)}
                        onClick={e=>handleClickHomeIcon(e)}
                    >
                        <img src='https://imgur.com/7kfxqqT.png' alt='return to home' style={{width:'100%', opacity:navIconOpacity[2]}}></img>    
                    </NavbarBrand> 
                )}
                {(props.parentComponent && 
                    <NavbarBrand //up a level
                        href='#'
                        style={{
                            height:'70px', 
                            width:'70px', 
                            border:'2px solid rgba(0, 0, 0,'+ navIconOpacity[1]+')', 
                            borderRadius:'5px'
                        }}
                        onMouseEnter={e=>handleIconHover(e, 1)}
                        onMouseLeave={e=>handleIconNoHover(e, 1)}
                        onClick={e=>handleClickParentIcon(e)}
                    >
                        <img src='https://imgur.com/Tfl1e3j.png' alt='return to blog' style={{width:'100%', opacity:navIconOpacity[1]}}></img>    
                    </NavbarBrand> 
                )}
                
                
                <Collapse navbar isOpen={!isOpen} >
                    <Nav navbar>
                        <NavItem  style={{padding:'0px', margin:'0px', }} >
                            <NavLink href='#'style={{}}>Main</NavLink>
                        </NavItem>
                        <NavItem style={{padding:'0px', margin:'0px', }} >
                            <NavLink href='#'style={{}}>Return to Previous</NavLink>
                        </NavItem>
                        <NavItem style={{padding:'0px', margin:'0px', }} >
                            <NavLink href='#'style={{}}>Contact Me</NavLink>
                        </NavItem>
                    </Nav>    
                </Collapse>   
                

                
            </Navbar>
        </div>
    )
}
export default DaddyNav;