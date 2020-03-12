import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import './css/components.css';

function initArray(length){
    let obj = {length};
    return Array.from(obj, (_, index)=>{
        return{
            index:index,
            x:0,
            y:0,
            zIndex:10,
            panelX:0,
            panelY:0,
            mouseDiffX:0,
            mouseDiffY:0,
        }
    })
}
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

let iconArray = initArray(6);
let indexArray = [];
const fillIndexArray = ()=>{
    iconArray.map((_, index)=>{
        return indexArray.push(index); 
    })
}
fillIndexArray();
let wrapRect=null;
let iconRect=null;
let currentGridStructure={cols:0, rows:0};
let currentIndex=null;
let animating = false;
const iconURL = [
    'https://imgur.com/ZyMbFEq.png', //blog
    'https://imgur.com/a0gOX3C.png', //web
    'https://imgur.com/qm6kOq9.png', // trade
    'https://imgur.com/a6kxszP.png', //java
    'https://imgur.com/3QPI6a6.png', //music
    'https://imgur.com/nMXydhJ.png', //contact

]
function FrontPanel(props){

    const wrapRef = useRef();
    const iconRef = useRef();
    const [iconInfo, setIconInfo] = useState([...iconArray]);
    const [panelOpacity, setPanelOpacity] = useState(1);

    const handleMouseDown = (e, iconIndex)=>{
        console.log(`mouse down + iconIndex = ${iconIndex}`);
        currentIndex = iconIndex;
        iconInfo[iconIndex].mouseDiffX = e.pageX-iconInfo[iconIndex].x;
        iconInfo[iconIndex].mouseDiffY = e.pageY-iconInfo[iconIndex].y;
        iconInfo[iconIndex].zIndex--;        
        document.onmousemove = (e)=>{
            iconInfo[iconIndex].x = e.pageX - iconInfo[iconIndex].mouseDiffX;
            iconInfo[iconIndex].y = e.pageY - iconInfo[iconIndex].mouseDiffY;
            setIconInfo([...iconInfo]);
        }
    }

    const handleMouseUp = (e)=>{
        console.log('mouse up registered');
        if(iconInfo[currentIndex].x===iconRect.width*iconInfo[currentIndex].panelX){
            props.componentToClose(0);
        }else{
            iconInfo[currentIndex].x = iconRect.width*iconInfo[currentIndex].panelX;
            iconInfo[currentIndex].y = iconRect.height*iconInfo[currentIndex].panelY;
            iconInfo[currentIndex].zIndex++;
            // document.onmousemove = (e)=>{};
            currentIndex=null;        
            setIconInfo([...iconInfo]);
        }
        document.onmousemove = (e)=>{};
    }

    const handleMouseEnter = (e, iconIndex)=>{
        // console.log(`currentIndex: ${currentIndex}`)
        if(currentIndex!==null && iconIndex!==currentIndex){
            let diffPX = iconInfo[iconIndex].panelX - iconInfo[currentIndex].panelX;
            let diffPY = iconInfo[iconIndex].panelY - iconInfo[currentIndex].panelY;
            iconInfo[currentIndex].panelX +=diffPX;
            iconInfo[currentIndex].panelY +=diffPY;
            iconInfo[iconIndex].panelX -= diffPX;
            iconInfo[iconIndex].panelY -= diffPY;
            iconInfo[iconIndex].x = iconRect.width*iconInfo[iconIndex].panelX;
            iconInfo[iconIndex].y = iconRect.height*iconInfo[iconIndex].panelY;
            setIconInfo([...iconInfo]);
        }
    }
    
    const loadRefDim = ()=>{
        wrapRect = wrapRef.current.getBoundingClientRect();
        iconRect = iconRef.current.getBoundingClientRect(); 
        currentGridStructure = {
            cols:Math.floor(wrapRect.width/iconRect.width),
            rows:Math.floor(wrapRect.height/iconRect.height),
        }
        iconInfo.map((icon, index)=>{
            icon.panelX = index%currentGridStructure.cols;
            icon.panelY = Math.floor(index/currentGridStructure.cols);
            icon.x = iconRect.width*icon.panelX;
            icon.y = iconRect.height*icon.panelY;
        })
        setIconInfo([...iconInfo])
        // console.log('height: '+wrapRef.current.style.height)
        console.log(`grid structure: ${currentGridStructure.cols} cols x ${currentGridStructure.rows} rows`);
        // console.log(`iconRect width is ${iconRect.width}`); 
        // console.log(`wrapRect width is : ${wrapRect.width}`)   
        // indexArray.forEach((_, index)=>{
        //     console.log(indexArray[index]);
        // })
        // console.log(`icon No4 position x: ${iconInfo[4].x}, and y: ${iconInfo[4].y}`)
    }
    useEffect(()=>{
        loadRefDim();     
         
    },[])
    useEffect(()=>{
        
        const debounceHandleResize = debounce(()=>loadRefDim(),200);
        window.addEventListener('resize', debounceHandleResize);
        //----------cleaning up-----------------
        return _=>{
            window.removeEventListener('resize', debounceHandleResize)
        }
    })
    useEffect(()=>{
        // console.log('useeffect rendered '+ currentIndex)
        
        document.onmouseup=(e)=>{
            if(currentIndex!==null){
                return handleMouseUp(e, currentIndex)   
            }                        
        }  
        return (
            ()=>{
                document.onmouseup=(e)=>{};                
            }
        )
    },[iconInfo]);
    
    if(props.beginProcessOf==='open' && !animating){
        animating = true;
        console.log(`panel begins process of: ${props.beginProcessOf}`);
        setTimeout(() => {
            props.actionCompleted([1,true]);
            animating = false;
        }, 1000);
    }  
    if(props.beginProcessOf==='close' && !animating){
        animating = true;
        console.log(`panel begins process of: ${props.beginProcessOf}`);
        setPanelOpacity(0);
        setTimeout(() => {
            props.actionCompleted([1,true]);
            animating = false;
        }, 500);
    }  


    return (
        <div 
            
            style={{
                positon:'relative', 
                height:'100%', 
                // border:'2px solid red',
                display:'flex', 
                justifyContent:'center',
                alignItems:'center',
                opacity:panelOpacity,
                transition:'opacity 0.5s',
            }}
        >
            <div 
                ref={wrapRef} 
                style={{
                    // border:'5px solid green',
                    // maxWidth:props.rowMaxWidth,
                    // width:'98.5vw', 
                    // minHeight:'300px'

            }}>
                <div className='welcome_note'>
                    <p><span className='welcome'>Welcome </span><span className='to'>To</span></p>
                    <p><span className='han'>Han</span><span className='corner'>'s Corner </span><span className='ofthe'>of the</span></p>
                    <p className='internet'>internet</p>
                </div>
                <Container fluid style={{ position:'relative', lineHeight: '32px'}}>
                    <Row 
                        style={{
                            maxWidth:props.rowMaxWidth,
                            width:'500px',
                            width:'98.5vw', 
                            minHeight:'300px'
                        }}
                    >
                        {iconInfo.map((val, index)=>{
                            // console.log('map item '+val.panelX)
                            return (
                                <Col xs={6} md={4} 
                                draggable={false} 
                                style={{
                                    padding:'0px',                                
                                }}
                                key={index}
                                >
                                    <div
                                    style={{
                                        height:'100%', 
                                        width:'100%', 
                                        display:'flex', 
                                        justifyContent:'center',
                                    }}
                                    ref={iconRef} 
                                    >
                                        <div 
                                        style={{
                                            height:props.iconHeight, 
                                            width:props.iconWidth, 
                                            userSelect:'none',
                                            paddingTop:'10px',
                                            paddingBottom:'10px'
                                        }}>
                                            {/* {iconInfo[1].x} */}
                                            {/* for the sole purpose of propping the grid up */}
                                        </div>
                                    </div>                    
                                </Col>
                            );
                        })}
                        
                    </Row>  
                    <div style={{height:'100%', width:'100%', top:'0px', left:'0px', }}>
                    {iconInfo.map((val, index)=>{
                                // console.log('map item '+val.x)
                        return (
                            (iconRect!==null &&
                                <div
                                key={index}
                                style={{
                                    height:iconRect.height,
                                    width:iconRect.width, 
                                    userSelect:'none',
                                    position:'absolute',
                                    display:'flex',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    left:val.x+'px',
                                    top:iconInfo[index].y+'px',
                                    zIndex:iconInfo[index].zIndex,    
                                    border:'1px solid red'                            
                                }}   
                                            
                                >
                                    <div
                                    style={{
                                        height:props.iconHeight, 
                                        width:props.iconWidth, 
                                        userSelect:'none',                                    
                                        backgroundColor:'grey',
                                    }}
                                    onMouseDown={(e)=>handleMouseDown(e, index)}  
                                    onMouseEnter={(e)=>handleMouseEnter(e, index)}   
                                    // onClick={e=>props.componentToClose(0)}
                                    >   
                                        <img src={iconURL[index]} alt='icon' className='icon_image'></img>
                                        {index}
                                    </div>

                                </div>
                            )                            
                        );
                    })}    
                    </div>    
                    
                                    
                </Container>
            </div>
                  

        </div>
    )
}
export default FrontPanel;


{/* <div 
    style={{
        position:'absolute',
        height:'25px', 
        width:'25px', 
        top:'-35px', 
        left:'0px', 
        border:'1px solid black'
    }}
    onClick={e=>props.componentToClose(0)}
>
    x
</div> */}


                