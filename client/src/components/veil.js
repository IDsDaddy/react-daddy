import React, {useState, useEffect}from 'react';
import updateDomState from './updateDomState.js';
import { cleanup } from '@testing-library/react';
import './css/components.css'
// import './child.css'

const durationInMili = 1000;
const transitionDuration = durationInMili/1000+'s';
// const heightExpansionCss = {
//     width:'10px', 
//     height:'750px', 
//     transition:`height ${transitionDuration}, width ${transitionDuration}`,
//     WebkitTransition:`height ${transitionDuration}, width ${transitionDuration}`,            
// }
let heightExpansionCss = {};
let widthExpansionCss = {};
let expandedHeight;
let expandedWidth;
let animating = false;
let revertToInitialDimensions = {
    width:'5px',
    height:'10px',
    transition:`height, ${transitionDuration}`,
        WebkitTransition:`height, ${transitionDuration}`,   
    minHiehgt:'0px',
};
let initialDimensions = {
    width:'5px',
    height:'10px',
    transition:`height, 0s`,
        WebkitTransition:`height, 0s`,   
    minHiehgt:'0px',
};
let finalDimensions = {};
let fullyExpandedCSs = {};

//props: [componentToClose, beginProcessOf, actionCompleted, toAccompany]
const Veil = (props)=>{
    // console.log(props.dimensions.width);
    if(props.toAccompany === 'frontPanel'){
        expandedHeight = document.body.scrollHeight<700?'500px':'75%';
        expandedWidth = document.body.clientWidth;
    }
    else if(props.toAccompany === 'blog'){
        expandedHeight = document.body.scrollHeight;
        expandedWidth = document.body.clientWidth<700?document.body.clientWidth:'90%';
    }
    heightExpansionCss = {
        width:'10px', 
        height:expandedHeight, 
        transition:`height, ${transitionDuration}`,
        WebkitTransition:`height, ${transitionDuration}`,      
        pageHeight:document.body.scrollHeight,
    };
    widthExpansionCss = {
        width:expandedWidth, 
        height:expandedHeight, 
        transition:`height, ${transitionDuration}`,
        WebkitTransition:`height, ${transitionDuration}`,     
        pageHeight:document.body.scrollHeight,   
    }
    
    finalDimensions = {
        width:expandedWidth, 
        height:expandedHeight, 
        transition:'height 0s, width 0s',
        WebkitTransition:'height 0s, width 0s',  
        pageHeight: document.body.scrollHeight,
        // minHiehgt:'0px',
    };
    const [veilDimensions, setVeilDimensions] = useState(initialDimensions);
    // const [veilDimensions, setVeilDimensions] = useState(finalDimensions);
    const expandVeil = async()=>{
        window.onresize = ()=>{};
        try{
            await updateDomState(setVeilDimensions, heightExpansionCss, durationInMili, handleResetOnWindowResize);
            await updateDomState(setVeilDimensions, widthExpansionCss, durationInMili, handleResetOnWindowResize)
            .then(()=>{
                props.actionCompleted([0,true]);
                animating = false;
                veilToRenderOnWindowResize();
            });
        }
        catch(e){
            console.log(e);
            setTimeout(() => {
                expandVeil();
            }, 500);
        }        
    }
    const contractVeil = async()=>{
        window.onresize = ()=>{};
        await updateDomState(setVeilDimensions, heightExpansionCss, durationInMili);
        await updateDomState(setVeilDimensions, revertToInitialDimensions, durationInMili)
        .then(()=>{
            props.actionCompleted([0,true]);
            animating = false;            
        });;
    }
    const veilToRenderOnWindowResize = ()=>{
        window.addEventListener('resize', veilResize)
    }
    const veilResize = (e)=>{
            console.log('window resized')
            if(props.toAccompany === 'frontPanel'){
                expandedHeight = document.body.scrollHeight<700?'500px':'75%';
                expandedWidth = document.body.clientWidth;
            }
            else if(props.toAccompany === 'blog'){
                expandedHeight = document.body.scrollHeight;
                expandedWidth = document.body.clientWidth<700?document.body.clientWidth:'90%';
            }
            fullyExpandedCSs = {
                width:expandedWidth, 
                height:expandedHeight, 
                transition:'height 0s, width 0s',
                WebkitTransition:'height 0s, width 0s',  
                pageHeight:document.body.scrollHeight,
            }
            // window.removeEventListener('resize', veilResize);
            setVeilDimensions(fullyExpandedCSs);
            console.log(`pageheight: ${fullyExpandedCSs.pageHeight}`)
            
    }
    const handleResetOnWindowResize = (reject)=>{
        window.onresize = ()=>{
            setVeilDimensions(initialDimensions);
            reject('window resized during opening load');
        }
    }

    if(props.beginProcessOf === 'open' && !animating){    
        animating = true;
        setTimeout(() => {                
            expandVeil()
        }, 200);              
    }
    if(props.beginProcessOf === 'close' && !animating){    
        animating = true;
        setTimeout(() => {                
            contractVeil()
        }, 200);              
    }
    useEffect(()=>{
        // veilToRenderOnWindowResize();
        if(!animating){
            window.addEventListener('resize', veilResize)
        }
        return function booo(){
            window.removeEventListener('resize', veilResize);
        }
        // return window.removeEventListener('resize', veilResize);
        
    })

    
    
    console.log('veil has been re-rendered');

    return (
        <div 
        className='veil_wrap' 
        style={{
            // width:'100vw',
            // height:veilDimensions.pageHeight,
            // position:'absolute',
            display:'flex',
            justifyContent: 'center',
            alignItems:'center',            
            // position:'fixed',
            border:'1px solid black',
            zIndex:'1',
            }}>
                {props.children}
            <div 
                style={{
                    backgroundColor:'black',
                    opacity:'0.8',
                    width:veilDimensions.width, 
                    height:veilDimensions.height, 
                    transition:veilDimensions.transition, 
                    WebkitTransition:veilDimensions.WebkitTransition,
                    position:'fixed',
                    
                }}>    

            </div>
        </div>
    )
}

export default Veil;