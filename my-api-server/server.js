const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 8000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet())


app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "style-src": ["'self'", 'https://fonts.googleapis.com'],
      "font-src": ["'self'", 'https://fonts.gstatic.com']
    }
  })
);
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/AnnaEyeWear', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define category schema and model
const categorySchema = new mongoose.Schema({
  name: String,
});
const productSchema = new mongoose.Schema({
  name: String,
  desc:String,
  image:String,
  price:Number,
  category:String,
  categoryId:String,
  hot:Number,
});
const userSchema = new mongoose.Schema({
  name: String,
  email:String,
  password:String,
  fullname:String,
  admin:Boolean,
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema)
// CSP header configuration


// Route cho đường dẫn gốc
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Route for categories
const categories = [];
const products =[];
const users=[];

app.get('/v1', (req, res) => {
  res.send('API version 1');
});

// API

// show danh sach categorie,products
app.get('/v1/categoriesshow' ,async (req, res) => {
  try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching categories' });
    }
});

// show danh sach categories / products trong admin 
app.get('/v1/category',authenToken,async (req, res) => {
  try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching categories' });
    }
});
app.get('/v1/product', async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching categories' });
    }
});

// ID
app.get('/v1/category/:id', async (req, res) => {
    try{
      const category = await Category.findById(req.params.id);
      if(category){
        res.json(category);
      }else{
        res.status(404).send({ message: 'Danh mục k tìm thấy'})
      }
    } catch ( error){
      res.status(500).send({message: 'Lỗi sai danh mục'})
    }
});

app.get('/v1/product/:id', async (req, res) => {
  try{
    const product = await Product.findById(req.params.id);
    if(product){
      res.json(product);
    }else{
      res.status(404).send({ message: 'Sản phẩm k tìm thấy'})
    }
  } catch ( error){
    res.status(500).send({message: 'Lỗi sai sản phẩm'})
  }
});

// Tìm sản phẩm theo ID danh mục / category Id
app.get('/v1/product/categoryId/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.find({ categoryId: categoryId });
    if (products.length ===0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm sản phẩm' });
  }
});

 

// tim san pham theo ID danh muc / category Id và limit
app.get('/v1/product/categoryId/:categoryId/limit/:limit', async(req,res)=>{
  try{
    const categoryId = req.params.categoryId;
    const limit = req.params.limit;
    const products = await Product.find({categoryId: categoryId}).limit(limit);
    if(products.length ===0){
      return res.status(404).json ({mesage: ' Không tìm thấy sản phẩm trong danh mục này'})
    }
    res.json(products)
  }catch(error){
    res.status(500).json({ message:' Error fetching products'})
  }
})

// tim san pham theo ID danh muc / categoryID va search name cua san pham
app.get('/v1/product/categoryId/:categoryId/keyword/:name', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const name = req.params.name;
    const products = await Product.find({
      categoryId: categoryId,
      name: {$regex: name, $options: 'i'}}
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Lỗi khi tìm kiếm sản phẩm' });
  }
});

// tim kiem san pham

app.get('/v1/product/keyword/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const products = await Product.find({name: {$regex: name, $options: 'i'}});
    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Lỗi khi tìm kiếm sản phẩm' });
  }
});
// tim san pham theo ID danh muc / categoryID va search name cua san pham / va limit san pham
app.get('/v1/product/categoryId/:categoryId/keyword/:name/limit/:limit', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const name = req.params.name;
    const limit = req.params.limit;
    const products = await Product.find({
      categoryId: categoryId,
      name: {$regex: name, $options: 'i'}}
    ).limit(limit);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Lỗi khi tìm kiếm sản phẩm' });
  }
});
// tim san pham theo danh muc
app.get('/v1/product/categoryname/:categoryname', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryname });
    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục này' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products' });
  }
});

// sap xep giam dan theo gia
app.get('/v1/product/sort/asc', async (req, res) => {
  try {
    const products = await Product.find().sort({ price: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products' });
  }
});

// sap xep tang dan theo gia
app.get('/v1/product/sort/desc', async (req, res) => {
  try {
    const products = await Product.find().sort({ price: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products' });
  }
});
// ADD
app.post('/v1/category', async (req, res) => {
  try{
    const newCategory = req.body;
    const category = await Category.create(newCategory);
    res.status(201).json(category);
  }catch(error){
    res.status(500).send({ message: 'Error'})
  } 
});
app.post('/v1/product', async (req, res) => {
  try{
    const newProduct = req.body;
    const product = await Product.create(newProduct);
    res.status(201).json(product);
  }catch(error){
    res.status(500).send({ message: 'Error'})
  } 
});

// EDIT
app.put('/v1/category/:id', async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updateCategory) {
      res.json(updateCategory);
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating category' });
  }
});

app.put('/v1/product/:id', async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updateProduct) {  
      res.json(updateProduct);
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating product' });
  }
});

// DELETE
app.delete('/v1/category/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (deletedCategory) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting category' });
  }
});

app.delete('/v1/product/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (deleteProduct) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting product' });
  }
});



// Register
app.post('/v1/account/register', async (req, res) => {
  try {
    const { name, password,fullname, email  } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
 
    // ma hoa mk
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({ name, password: hashedPass, fullname, email,admin: false });
    await newUser.save();

    res.status(201).json({ message: 'User registe red successfully' });
  } catch (error) { 
    res.status(500).json({ message: 'Error registering user' });
  } 
});

app.post('/v1/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
      const decoded = jwt.verify(refreshToken, 'bimatkey'); 
      const user = await User.findById(decoded.userId);

      if (!user) {
          return res.status(401).json({ message: 'Invalid refresh token !!!!!!' });
      }

      const accessToken = jwt.sign({ userId: user._id, name: user.name }, 'bimatkey', { expiresIn: '30s' });
      const newRefreshToken = jwt.sign({ userId: user._id, name: user.name }, 'bimatkey', { expiresIn: '30d' });

      res.status(200).json({ user, accessToken, refreshToken: newRefreshToken });
  } catch (error) {
      console.error(error.message);
      res.status(403).json({ message: 'Invalid refresh token' });
  }
});
// login
app.post('/v1/account/login', async (req, res) => {
  try { 
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Không thể tìm thấy tên tài khoản' });
    }
    // kiem tra mat khau
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: 'Invalid credentials'});
    }


    // tạo jwt token
    const accessToken = jwt.sign({userId: user._id, name:user.name}, 'bimatkey',{expiresIn:'1m'});
    const refreshToken = jwt.sign({userId: user._id, name:user.name},'bimatkey',{expiresIn: '30d'})

    res.status(200).json({ accessToken,refreshToken, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Lỗi đăng nhập' });
  }
});

   // Hàm xác thực token
   function authenToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== "undefined"){
        const bearerToken = bearerHeader.split(' ')[1];
        req.accessToken=bearerToken;
        jwt.verify(req.accessToken,'bimatkey',(err,authData)=>{
            if(err){
                res.status(403).json({mesage:'không có quyền truy cập'})
            }else{
                next();
            }
        })
    }else{
        res.status(403).json({mesage:'không có quyền truy cập'})
    }
}



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
