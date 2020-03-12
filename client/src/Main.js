import React, {useState, useEffect} from 'react';
import Veil from './components/veil.js';
import FrontPanel from './components/frontPanel.js'
import Blog from './components/blog.js'
import DaddyNav from './components/daddyNav.js';
import './main.css';

let componentsObj = [
    {
        //veil
        show:false,
        process:null,
        animationFinished: null,
    },
    {
        //front panel
        show:false,
        process:null,
        animationFinished: null,
    },
    {
        //veil
        show:false,
        process:null,
        animationFinished: null,
    },
    {
        //blog
        show:false,
        process:null,
        animationFinished: null,
    },
        //blog content
    {
        show:false,
        process:null,
        animationFinished: null,
    },
    {
        // contact page
        show:false,
        process:null,
        animationFinished: null,
    },
]
let onFirstRender = true;
function Main(){
    const [components, setComponents] = useState([...componentsObj]);
    
    const ProcessComponentRequest = async (dataFromChild)=>{
        console.log(`data from front panel: ${dataFromChild}`)
        if(dataFromChild==0){   //veil
            console.log('received code 0: close front panel and veil')
            // components[1]=false;
            let sequenceArray = [
                [1, 'close'],
                [0, 'close'],
            ];
            await runComponentSequence(sequenceArray[0]).then((res)=>{console.log(res)});
            await runComponentSequence(sequenceArray[1]).then((res)=>{console.log(res)});
        }
        if(dataFromChild===3){ //blog
            console.log('main received blog request to close');
            let sequenceArray = [
                [3, 'close'],
                [0, 'open'],
                [1, 'open']
            ];
            await runComponentSequence(sequenceArray[0]).then((res)=>{console.log(res)});
            await runComponentSequence(sequenceArray[1]).then((res)=>{console.log(res)});
            await runComponentSequence(sequenceArray[2]).then((res)=>{console.log(res)});
        }
    }
    let actionCompleted = (status)=>{   //status = [componentId, isItFinished]
        if(status[1]){
            console.log('animation status received from comObject '+status[0])
            components[status[0]].animationFinished = true;
            setComponents([...components]);
        } 
    }
    const runComponentSequence = (sequenceDetails)=>{      //sequencDetails = [componentId, process]
        return new Promise(res=>{
            const compObj = components[sequenceDetails[0]];     
            // set component props.process value
            // which is used by component to trigger opening / closing animation      
            compObj.process = sequenceDetails[1];
            if(sequenceDetails[1]==='open'){
                // components[sequenceDetails[0]] = true;
                compObj.show = true;
            }
            setComponents([...components]);
            // check for component reply on 
            // completion of opening / closing animation
            let intval = setInterval(() => {
                if(compObj.animationFinished){
                    console.log('animation status received. ');
                    clearInterval(intval);                    
                    compObj.process = null;     //reset action triggering props
                    compObj.animationFinished = null;                    
                    if(sequenceDetails[1]==='close'){   //finally change useState values to remove component
                        components[sequenceDetails[0]].show = false;                        
                    }   
                    setComponents([...components]);                 
                    res('main knows animation has finished ');
                }
            }, 1000/60);
        })
    }
    const runFirstRender = async()=>{
        let sequenceArray = [
            [0, 'open'],
            [1, 'open'],
        ];
        await runComponentSequence(sequenceArray[0]).then((res)=>{console.log(res)});
        await runComponentSequence(sequenceArray[1]).then((res)=>{console.log(res)});
    }
    useEffect(()=>{
        if(onFirstRender){
            onFirstRender=false;
            runFirstRender();
            // curtainCall();
        }
        // console.log('effect triggered');
    },[])
    return(
        <div
            className='mainWrap'
        >   
            {/* <DaddyNav /> */}
            {componentsObj.map((component, index)=>{
                return (
                    <div
                        key={index}
                        className='componentWrap'
                    >
                        {index===0 && component.show &&
                            <Veil
                                toAccompany = {'frontPanel'}
                                componentToClose = {ProcessComponentRequest}
                                actionCompleted = {actionCompleted}
                                beginProcessOf = {componentsObj[0].process}
                            >
                                <p>veil is loaded</p>
                            </Veil>
                        }
                        {index===1 && component.show &&
                            <FrontPanel
                                rowMaxWidth={'600px'} 
                                iconWidth={'100px'} 
                                iconHeight={'100px'} 
                                runAnimation = {false}
                                componentToClose = {ProcessComponentRequest}
                                actionCompleted = {actionCompleted}
                                beginProcessOf = {componentsObj[1].process}
                            >
                            </FrontPanel>
                        }
                        {index===2 && component.show &&
                            <Veil style={{height:'100%'}}
                                componentToClose = {ProcessComponentRequest}
                                beginProcessOf = {componentsObj[2].process}
                                actionCompleted = {actionCompleted} 
                                toAccompany = {'blog'}
                            />
                            }
                        {index===3 && component.show &&
                            <Blog 
                                componentToClose = {ProcessComponentRequest}
                                beginProcessOf = {componentsObj[3].process}
                                actionCompleted = {actionCompleted} 
                            />
                        }
                        {index===4 && component.show &&
                            <p>blog content</p>
                        }
                    </div>
                )
            })}
           

        </div>    
    )
}

export default Main;