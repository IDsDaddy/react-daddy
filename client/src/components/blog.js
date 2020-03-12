import React, {useState, useEffect} from 'react';
import './css/components.css';
import BlogBodyMainEntry from './blogBodyMainEntry.js';
import BlogContent from './blogContent.js';
import DaddyNav from './daddyNav.js';
import tng from './img/thoughts.png';

const opacityDuration = 'opacity, 0.2s';
let animating = false;
function Blog(props){
    // let whiteBgWid = document.body.clientWidth<700?document.body.clientWidth:'70%';
    // let blogBodyWidth = document.body.clientWidth<700?document.body.clientWidth:'70%';
    let whiteBgWid = document.body.clientWidth<1000?document.body.clientWidth:1000;
    let whiteBgHei = document.body.scrollHeight<500?500:document.body.scrollHeight;    
    let blogBodyWidth = document.body.clientWidth<1000?document.body.clientWidth:1000;
    const [whiteBgDim, setWhiteBgDim] = useState([whiteBgWid, whiteBgHei, blogBodyWidth]);
    const [blogBodyContent, setBlogBodyContent] = useState('blogMain');
    const [blogBodyOpacity, setBlogBodyOpacity]=useState(1);
    let embeddedComponent = 'blogContent';
    // let parentComponent = 'blogMain';
    // window.onresize=(e)=>{
    //     whiteBgWid = document.body.clientWidth<1700?document.body.clientWidth:'70%';
    //     setWhiteBgDim(whiteBgWid);
    // }
    useEffect(()=>{
        window.addEventListener('resize', blogResize);
        return function cleanup(){
            window.removeEventListener('resize', blogResize);
        }
    })
    if(props.beginProcessOf==='close'){
        // window.removeEventListener('resize', blogResize);
    }
    const blogResize = (e)=>{
        // whiteBgWid = document.body.clientWidth<700?document.body.clientWidth:'70%';
        // whiteBgHei = document.body.scrollHeight<500?500:document.body.scrollHeight;
        // blogBodyWidth = document.body.clientWidth<700?document.body.clientWidth:'70%';
        whiteBgWid = document.body.clientWidth<1000?document.body.clientWidth:1000;
        whiteBgHei = document.body.scrollHeight<500?500:document.body.scrollHeight;
        blogBodyWidth = document.body.clientWidth<1000?document.body.clientWidth:1000;
        setWhiteBgDim([whiteBgWid, whiteBgHei, blogBodyWidth]);
    }
    const handleCloseBodyMain = (contentIndex)=>{
        console.log('blogmain request closing... ready to open blog id ' + contentIndex);
        setBlogBodyContent(contentIndex);
    }
    const handleCloseArticle = (whereTo)=>{
        if(whereTo==='blogMain'){
            setBlogBodyContent(whereTo)
        }
        else if(whereTo==='main'){

        }
    }

    const handleOpenBlogArticleById = (articleId)=>{
        
        setBlogBodyContent(articleId);
    }
    const returnToMain = ()=>{
        props.componentToClose(3);
    }
    const returnToParent= async()=>{
        console.log('reached returnToParent')
        if(blogBodyContent!=='blogMain'){
            await opacityPromise(0)
            .then(()=>{
                setBlogBodyContent('blogMain')
            });
            await opacityPromise(1);

        }
        
    }
    const closeBlog = async ()=>{
        // props.componentToClose(3);
        await opacityPromise(0);
        await whiteBgPromise('close')
        .then(()=>{
            console.log('closeBlog reached actionCompleted stage')
            return props.actionCompleted([3, true]);
        })                
    }   
    if(props.beginProcessOf === 'open' && !animating){    
        animating = true;
        setTimeout(() => {                
            closeBlog()
        }, 200);              
    }
    if(props.beginProcessOf === 'close' && !animating){    
        animating = true;
        setTimeout(() => {                
            closeBlog();
        }, 200);              
    }

    const opacityPromise = (opacity)=>{
        return new Promise((res)=>{
            setBlogBodyOpacity(opacity);
            setTimeout(() => {
                res();
            }, 200);
        })
    }
    const whiteBgPromise = (aim)=>{
        if(aim==='open'){
            setWhiteBgDim([whiteBgWid, whiteBgHei, blogBodyWidth]);
        }
        else if(aim==='close'){
            setWhiteBgDim(['0px', whiteBgHei, '0px']);
        }
        return new Promise((res)=>{
            setTimeout(() => {
                res();
            }, 1000);
        })
    }
    return(
        <div>
            <DaddyNav
                parentComponent={true}
                // embeddedComponent={true}
                homeIcon = {true}
                homeIconClick={returnToMain}
                parentIconClick={returnToParent}
            />
            <div className='blog_outer_wrap'
                style={{
                    // height:document.body.scrollHeight,
                    height:whiteBgDim[1],
                    width:'98vw',
                    display:'flex', 
                    justifyContent:'center',
                    alignItems:'center',
                    position:'fixed',
                }}
            >
                <div className='blog_white_board'
                    style={{
                        height:whiteBgDim[1],
                        width:whiteBgDim[0],
                        backgroundColor:'#e8e8e8',
                        transition:'width 1s',
                        // backgroundColor:'grey',
                    }}
                >
                    
                </div>
            </div>
            <div className='blog_inner_wrap'
                style={{
                    // height:whiteBgDim[1],
                    width:'98vw',
                    display:'flex', 
                    flexWrap: 'wrap',
                    justifyContent:'center',
                    alignItems:'start',
                    position:'absolute',
                    zIndex:'10',
                    opacity:blogBodyOpacity,
                    transition:opacityDuration,
                    // backgroundColor:'grey',
                }}
            >
                
                <div className='blog_body'
                    style={{
                        // display:'inline-block',
                        height:'800px',
                        width:whiteBgDim[2],
                        borderTop:'1px solid black',
                        position:'relative',
                        transition:'width 1s',
                        // backgroundColor:'white',
                    }}
                >
                    <div className='blog_title'
                        style={{
                            // display:'inline-block',
                            marginTop:'2%',
                            marginBottom:'2%',
                            width:'100%',
                            display:'flex', 
                            justifyContent:'center',
                            borderBottom:'1px solid black',
                            // minWidth:'250px',
                            // maxWidth:'800px',
                            height:'200px',
                            // position:'absolute',
                            // border:'1px solid red',
                            
                        }}
                    >   
                        <div className='blog_title_image'></div>
                            
                        
                        {/* <img src={tng} alt={`thoughtNGiggles`} style={{width:'100%'}}></img> */}
                    </div>
                    <div className='blog_body_main'>
                        {blogBodyContent==="blogMain" 
                            && 
                                <BlogBodyMainEntry 
                                    closeBlogBodyMain={handleCloseBodyMain}
                                    openBlogArticleById={handleOpenBlogArticleById}
                                />
                        }
                        {blogBodyContent!=='blogMain'
                            &&
                                <BlogContent 
                                    articleId = {blogBodyContent}
                                    closeArticle = {handleCloseArticle}
                                />
                        }
                        
                        
                    </div>
                    <div className='blog_body_links'>

                    </div>
                </div>

            </div>
           
        </div>
        
    )
}

export default Blog;