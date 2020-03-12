import axios from 'axios';
export default {
  getAll: async () => {
    let res = await axios.get(`/api/product`);
    return res.data || [];
  },
  getById: async(id)=>{
    let res = await axios.get(`http://localhost:5000/api/product/`+id).catch((err=>{
      if(err.response){
        console.log(err.response.data);
      }
    }));
    // console.log(res.data.data)
    return res.data || [];
  }
}