// import veilControl from './veilControl.js';
// import main from '../main.js';
const updateDomState = (updateState, attributes, expectedDuration, handleInterruptions, debugName)=>{
    if(typeof handleInterruptions==='undefined'){
        handleInterruptions=()=>{};
    }
    if(typeof expectedDuration==='undefined'){
        expectedDuration=0;
    }
    if(typeof debugName==='undefined'){
        debugName='i wonder what i just ';
    }
    return new Promise((resolve, reject)=>{
        updateState(attributes);
        setTimeout(() => {
            resolve(debugName+'completed');
        }, expectedDuration+1000/60);
        handleInterruptions(reject, updateState);
    })
}



export default updateDomState;

// const updateDomState = (ref, updateWhat, cssSetter, rejections)=>{
//     ref.ontransitionend = null;
//     if(cssSetter===undefined){
//         cssSetter={};
//     }
//     if(rejections===undefined){
//         rejections=()=>{};
//     }

//     return new Promise((resolve, reject)=>{
//         setTimeout(()=>{}, 1500);
//         updateWhat()

//         cssSetter.forEach((css)=>{
//         ref.style[css[0]]=css[1];
//         console.log('cssSetter values: '+css[0], css[1]);
//         })
//         ref.ontransitionend = () => {    
//         ref.ontransitionend=null;
//         //delay resolve slightly to allow time for ontransionend to be nullified. 
//         setTimeout(()=>{resolve('success')}, 50);
        
//         };
//         rejections(reject);
//     })  
// }
