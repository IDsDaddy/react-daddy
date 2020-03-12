const mongoose = require('mongoose');
const Product = mongoose.model('products');

module.exports = (app) => {

  app.get(`/api/product`, async (req, res) => {
    let products = await Product.find();
    console.log('server get all product');
    return res.status(200).send(products);
  });

  app.get('/api/product/:_id', async(req, res)=>{
    Product.findById(req.params._id)
    .then((prod)=>{
      console.log('productById');
      if(!prod){return res.status(404).end();}
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).send(prod);
    })
    .catch(err=>next(err));
  })

  app.post(`/api/product`, async (req, res) => {
    let product = await Product.create(req.body);
    return res.status(201).send({
      error: false,
      product
    })
  })

  app.put(`/api/product/:id`, async (req, res) => {
    const {id} = req.params;

    let product = await Product.findByIdAndUpdate(id, req.body);

    return res.status(202).send({
      error: false,
      product
    })

  });

  app.delete(`/api/product/:id`, async (req, res) => {
    const {id} = req.params;

    let product = await Product.findByIdAndDelete(id);

    return res.status(202).send({
      error: false,
      product
    })

  })

}