import React, {useState, useEffect}from 'react';
import entryImage from './img/csstrouble.png';
import dateImage from './img/uploadtime.png';
import productService from '../services/productService.js';
// import cssImg from 'https://imgur.com/h62ERR0';
let animating = false;
let animationTime = 500;

function BlogBodyMainEntry(props){
    const [products, setproducts] = useState(null);
    const [panelOpacity, setPanelOpacity] = useState(1);
    
    useEffect(() => {
      if(!products) {
        getProducts();
      }
    })
  
    const getProducts = async () => {
      let res = await productService.getAll();
      console.log(res);
      setproducts(res);      
    }

    const handleClickToContent = (e, id)=>{
        setPanelOpacity(0);
        setTimeout(() => {
            props.openBlogArticleById(id);
        }, animationTime);
    }
     
    
    return (
        <div>
            
            <div
                className = "blog_left"
                style={{
                    opacity:panelOpacity,
                    transition:'opacity 0.5s',
                }}
            >
                {(products && 
                    products.map((product, index)=>{
                        return (
                            <div key={index} style={{marginBottom:'70px'}}>
                                <div className='main_entry_image'>
                                    <img src={products[index].titleImage} alt='title image' style={{width:'100%'}}></img>
                                </div>
                                <div 
                                    className='main_entry_title'
                                    onClick={e=>handleClickToContent(e, product._id)}
                                >
                                    {products[index].title}
                                </div>
                                <div className='main_entry_date'>
                                    <span>
                                        <img src={dateImage} style={{width:'24px'}}></img>                            
                                    </span>
                                    <span>
                                        {products[index].date}
                                    </span>
                                </div>
                                <div className='main_entry_extract'>
                                    <span>{products[index].extract}</span>
                                    <span className='read_more_link'>[read more....] </span>
                                </div>
                            </div>
                        )
                        
                    })                                
                )}
                
            </div>

        </div>
        
    )
}
export default BlogBodyMainEntry;