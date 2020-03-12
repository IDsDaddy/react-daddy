import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-grid-system';

//default break points: 
//min width of [576, 768, 992, 1200] 
//refer by [sm, md, lg, xl] respectively
//with xm denoting anything less than 576px

const fillArray=(length)=>{
    let obj = {length};
    return Array.from(obj, ()=>{return {
        top:'0px',
        left:'0px',
        width:'100px',
        zIndex:10,
        xDiff:0,
        yDiff:0,
        xToOriginMultiplier:0,
        yToOriginMultiplier:0,
        xFixed:0,
        yFixed:0,
        xUpdatedMultiplier:0,
        yUpdatedMultiplier:0,
    } });
}
// let absArray = [
//     {
//         top:'100px',
//         left:'0px',
//         width:'100px',
//     },
//     {
//         top:'100px',
//         left:'0px',
//         width:'100px',
//     },
//     {
//         top:'100px',
//         left:'0px',
//         width:'100px',
//     },


// ];
let absArray = fillArray(6);
let currentIndex = null;
let mouseHeldDownTempIndex = null;
let iconSelected = false;
let refDim = {};

function debounce(fn, ms) {
    let timer
    return _ => {
      clearTimeout(timer)
      timer = setTimeout(_ => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    };
  }
function Gridding(props){
    
    const [absPos, setAbsPos]=useState([...absArray]);
    const rowRef = useRef();
    const wrapRef = useRef();
    const handleMouseDown = (e, iconIndex)=>{
        console.log('mouse down');
        let left = absArray[iconIndex].left.replace(/\D/g,'');
        let top = absArray[iconIndex].top.replace(/\D/g,'');
        absArray[iconIndex].xDiff = e.clientX;
        absArray[iconIndex].yDiff = e.clientY;
        currentIndex = iconIndex;
        absArray[iconIndex].zIndex = 9;
        
        // console.log(`refDim test. does it match: ${refDim.x}`)
        // console.log(`ref Y: ${refDim.y}, mouse Y: ${e.clientY}`)
        
        let xDis = e.clientX - refDim.x;
        let yDis = e.clientY - refDim.y;
        if(left==0 && top==0){
            absArray[iconIndex].xToOriginMultiplier = Math.floor(xDis/refDim.w);
            absArray[iconIndex].yToOriginMultiplier = Math.floor(yDis/refDim.h);  
            absArray[iconIndex].xUpdatedMultiplier = Math.floor(xDis/refDim.w);
            absArray[iconIndex].yUpdatedMultiplier = Math.floor(yDis/refDim.h); 
        }
        
        
             
        console.log(`y:  ${absArray[iconIndex].yFixed}`);
        console.log(`yDiff:  ${absArray[iconIndex].yDiff}`);
        setAbsPos([...absArray]);

        document.onmousemove=(e)=>{
            absArray[iconIndex].left = (absArray[iconIndex].xFixed+e.clientX-absArray[iconIndex].xDiff)+'px';
            absArray[iconIndex].top = (absArray[iconIndex].yFixed+e.clientY-absArray[iconIndex].yDiff)+'px';
            setAbsPos([...absArray]);             
        }         
    }
    useEffect(()=>{
        loadRefDim();
        
    },[]);

    useEffect(()=>{
        const debounceHandleResize = debounce(()=>loadRefDim(),200);
        window.addEventListener('resize', debounceHandleResize);

        return _=>{
            window.removeEventListener('resize', debounceHandleResize)
        }
    })

    const loadRefDim = ()=>{
        let refRect = rowRef.current.getBoundingClientRect();
        console.log(`refRect: ${refRect.left}`)
        refDim = {
            x:refRect.left,
            y:refRect.top,
            w:refRect.width,
            h:refRect.height,
        };
        let wrapRect = wrapRef.current.getBoundingClientRect();
        console.log(`wrapRect width is ${wrapRect.width}`);
        
    }

    useEffect(()=>{
        console.log('useeffect rendered '+ currentIndex)
        if(currentIndex!==null){
            document.onmouseup=(e)=>{
                return handleMouseUp(e, currentIndex)              
            }            
        }
        return (
            ()=>{
                document.onmouseup=(e)=>{};                
            }
        )
    },[absPos]);

    
    const handleMouseUp = (e, iconIndex)=>{        
        console.log('mouseup registered')
        currentIndex = null;
        document.onmousemove=(e)=>{};
        let xDis = e.clientX - refDim.x;
        let yDis = e.clientY - refDim.y;
        let xMultDiff = Math.floor(xDis/refDim.w);
        let yMultDiff = Math.floor(yDis/refDim.h);
        
        // console.log(`mouseup registered with mouse y: ${e.clientY} and dim y ${refDim.y}`);
        // console.log(`mouseup registered with mouse x: ${e.clientX} and dim y ${refDim.x}`);
        console.log(`yMulti on mouseup : ${yMultDiff}`);
        console.log(`xMulti on mouseup : ${xMultDiff}`);
        absArray[iconIndex].xFixed = refDim.w*(xMultDiff- absArray[iconIndex].xToOriginMultiplier);
        absArray[iconIndex].yFixed = refDim.h*(yMultDiff- absArray[iconIndex].yToOriginMultiplier);
        absArray[iconIndex].xUpdatedMultiplier = xMultDiff;
        absArray[iconIndex].yUpdatedMultiplier = yMultDiff;   
        absArray[iconIndex].zIndex = 10;
        absArray[iconIndex].left = absArray[iconIndex].xFixed+'px';
        absArray[iconIndex].top = absArray[iconIndex].yFixed+'px';
        mouseHeldDownTempIndex = null;
        setAbsPos([...absArray]);
    }
    const handleMouseEnter = (e, iconIndex)=>{
        if(currentIndex!==null && iconIndex!==currentIndex){
            // console.log(`mouse entered icon ${iconIndex}`);
            let xMoved = e.clientX - refDim.x;
            let yMoved = e.clientY - refDim.y;
            absArray[iconIndex].xUpdatedMultiplier = absArray[currentIndex].xUpdatedMultiplier;
            absArray[iconIndex].yUpdatedMultiplier = absArray[currentIndex].yUpdatedMultiplier;
            let xMultDiff = Math.floor(xMoved/refDim.w)-absArray[currentIndex].xUpdatedMultiplier;
            let yMultDiff = Math.floor(yMoved/refDim.h)-absArray[currentIndex].yUpdatedMultiplier;
            console.log(`xMultiDiff = ${xMultDiff}, yMultiDiff = ${yMultDiff}`);
            absArray[iconIndex].xFixed -= refDim.w*xMultDiff;
            absArray[iconIndex].yFixed -= refDim.h*yMultDiff;
            absArray[iconIndex].left = absArray[iconIndex].xFixed+'px';
            absArray[iconIndex].top = absArray[iconIndex].yFixed+'px';

            if(mouseHeldDownTempIndex!==null && mouseHeldDownTempIndex!==iconIndex){
                absArray[mouseHeldDownTempIndex].xFixed = 0;
                absArray[mouseHeldDownTempIndex].yFixed = 0;
                absArray[mouseHeldDownTempIndex].left = '0px';
                absArray[mouseHeldDownTempIndex].top = '0px';
            }
            mouseHeldDownTempIndex = iconIndex;
          
            setAbsPos([...absArray]);
        }else{
            // console.log(`mouse over icon ${iconIndex}`)
        }
        
    }
    const handleMouseLeave = (e, iconIndex)=>{
        if(currentIndex!==null && iconIndex!==currentIndex){
            console.log('mouse leave registered')
            absArray[iconIndex].left = '0px';
            absArray[iconIndex].top = '0px';
            setAbsPos([...absArray]);
        }else{
            console.log('mouse leave condition not met')
        }
        
    }
    
    return (
        <div ref={wrapRef}>
        <Container fluid style={{ lineHeight: '32px'}}>
            <div             
            style={{position:'relative', height:'100px', width:'100px', border:'1px solid black', marginTop:'15px'}}
            >                
            </div>
            <Row 
            style={{border:'1px solid black', maxWidth:props.rowMaxWidth, width:'98.5vw'}}
            >
                {absPos.map((val, index)=>{
                    // console.log('map item '+val.top)
                    return (
                        <Col xs={6} md={4} draggable={false} 
                        style={{border:'1px solid red', padding:'0px'}}
                        key={index}
                        >
                            {index===0 &&
                                <div
                                style={{height:'100%', width:'100%', display:'flex', justifyContent:'center',border:'1px solid black'}}
                                ref={rowRef}
                                >
                                    <div 
                                    style={{position:'relative', height:'100px', width:'100px', marginTop:'15px'}}
                                    key={index}
                                    draggable = {false}
                                    //  
                                    >
                                        <div
                                        draggable = {false}
                                        style={{zIndex:val.zIndex, userSelect:'none', position:'absolute', height:'100px', width:val.width, backgroundColor:'grey', top:val.top, left:val.left}}
                                        onMouseDown={(e)=>handleMouseDown(e, index)}    
                                        onDragStart={(e)=>e.preventDefault()}     
                                        onMouseEnter={(e)=>handleMouseEnter(e, index)}     
                                        // onMouseLeave={e=>e.preventDefault()}                                                 
                                        >
                                            icon {index}
                                        </div>                                
                                    </div>  
                                </div>
                            }
                            {index>0 && 
                                <div
                                style={{height:'100%', width:'100%', display:'flex', justifyContent:'center', border:'1px solid black'}}
                                >
                                    <div 
                                    style={{position:'relative', height:'100px', width:'100px', marginTop:'15px'}}
                                    key={index}
                                    draggable = {false}
                                    >
                                        <div
                                        draggable = {false}
                                        style={{zIndex:val.zIndex, userSelect:'none', position:'absolute', height:'100px', width:val.width, backgroundColor:'grey', top:val.top, left:val.left}}
                                        onMouseDown={(e)=>handleMouseDown(e, index)}    
                                        onDragStart={(e)=>e.preventDefault()}     
                                        onMouseEnter={(e)=>handleMouseEnter(e, index)}                       
                                        >
                                            icon {index}
                                        </div>                                
                                    </div>  
                                </div>
                            }
                                              
                        </Col>
                    );
                })}
                
            </Row>

            
            
        </Container>
        </div>
    )
}

export default Gridding;
