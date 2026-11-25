const express=require('express');
const axios=require('axios');
const books=require('./booksdb');
const {isValid,users}=require('./auth_users');
const router=express.Router();
router.post('/register',(req,res)=>{const {username,password}=req.body;if(!username||!password||!isValid(username))return res.status(400).json({message:'Invalid or existing username'});users.push({username,password});res.status(200).json({message:'Customer successfully registered. Now you can login'});});
router.get('/',(req,res)=>res.json(books));
router.get('/isbn/:isbn',(req,res)=>books[req.params.isbn]?res.json(books[req.params.isbn]):res.status(404).json({message:'Book not found'}));
router.get('/author/:author',(req,res)=>res.json(Object.fromEntries(Object.entries(books).filter(([,b])=>b.author.toLowerCase()===req.params.author.toLowerCase()))));
router.get('/title/:title',(req,res)=>res.json(Object.fromEntries(Object.entries(books).filter(([,b])=>b.title.toLowerCase()===req.params.title.toLowerCase()))));
router.get('/review/:isbn',(req,res)=>books[req.params.isbn]?res.json(books[req.params.isbn].reviews):res.status(404).json({message:'Book not found'}));
const api=axios.create({baseURL:process.env.BOOK_API_URL||'http://localhost:5000'});
async function getAllBooks(){return (await api.get('/')).data;}
function getBookByISBN(isbn){return api.get('/isbn/'+encodeURIComponent(isbn)).then(r=>r.data);}
async function getBooksByAuthor(author){return (await api.get('/author/'+encodeURIComponent(author))).data;}
function getBooksByTitle(title){return api.get('/title/'+encodeURIComponent(title)).then(r=>r.data);}
module.exports={general:router,getAllBooks,getBookByISBN,getBooksByAuthor,getBooksByTitle};