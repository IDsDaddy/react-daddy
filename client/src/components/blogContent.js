import React, {useState, useEffect} from 'react';
import productService from '../services/productService.js';
import dateImage from './img/uploadtime.png';

function BlogContent(props){
    const [product, setproduct] = useState(null);
    let articleId = props.articleId;
    const getProductsByID = async (id) => {
        let res = await productService.getById(id);
        console.log(res);
        setproduct(res);      
    }
    useEffect(()=>{
        if(!product){
            getProductsByID(articleId);
            window.scrollTo(0,0);

        }
        
    })
    return(
        <div
            style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
            }}
        >            
            {(product && 
                <div style={{width:'85%'}}>
                    <div className='blog_content_title_image'>
                        <img src={product.content[0].imagelink} alt='content title image'></img>
                    </div>
                    <div className='blog_content_title'>
                        {product.content[1].mainTitle}
                    </div>
                    <div className='main_entry_date'>
                        <span>
                            <img src={dateImage} style={{width:'24px'}}></img>                            
                        </span>
                        <span>
                            {product.date}
                        </span>
                    </div>
                    {product.content.map((con, index)=>{                        
                        if(index>1){
                            if('words' in con){
                                return (<p className='blog_paragraph' key={index}>{con.words}</p>);
                            }
                            else if('imagelink' in con){
                                return (<img key={index} src={con.imagelink} alt='blog image'></img>)
                            }
                        }
                    })}
                </div>
            )}                        
        </div>
    )
}
export default BlogContent;