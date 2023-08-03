const jwt = require('jsonwebtoken');


const collectionList = require("../../../service/Collections");
const { getUserCollections } = require("../../helper/users");

function generate_token(tokenData) {
  const token =  jwt.sign({
    user_id:tokenData.user_id,
    user_type:tokenData.user_type
}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"});
return token;
}

async function verify_user( email, user_type) {
  try {
    const userCollection = await getUserCollections(user_type);
    const user_detail_list = await Promise.all(
      userCollection.docs
        .filter((doc) => doc.data().email === email)
        .map(async (doc, index) => {
          const data = doc.data();
          return {
            user_id: doc.id,
            user_type: data.user_type,
            email: data.email,
            password: data.password,
          };
        })
    );

    if (user_detail_list.length > 0) {
      return {availablity:true, data:user_detail_list[0]};
    }
    return {availablity:false, data:null};
  } catch (error) {
   // return res.status(404).send({ msg: "Authentication Error", error });
  }
}

async function register(req,res) {
    const { email, user_type, fname, lname, password } = req.body;
    try {
      const user = await verify_user(email, user_type);
        if(user.availablity){
            return res.status(500).send("This email is already registered. Please login in.")
        }
        else{
            if(user_type === "customer"){
                const data = {
                    username: fname + lname,
                    email: email,
                    password: password,
                    read_notifications: [],
                    fname: fname,
                    lname: lname,
                    profile: null,
                    user_type:user_type,
                    advertisements: [],
                  };
                  
                  const userRef = await collectionList.customerCollection.add(data);
                  const token = generate_token({
                    user_id:user.id,
                    user_type:user.user_type
                  });
                  return res.status(201).send({msg:"User registered successfully.",user_id: user.user_id, user_type:user.user_type, token})
            }

            if(user_type === "developer"){
              const data = {
                username: fname + lname,
                email: email,
                password: password,
                read_notifications: [],
                fname: fname,
                lname: lname,
                profile: null,
                user_type: user_type,
                games: [],
                transactions: [],
                name_on_bank_acc: "",
                bank_name: "",
                routing_no: "",
                acc_no: "",
                acc_type: "",
          
                };
                
                const userRef = await collectionList.developerCollection.add(data);
                const token = generate_token({
                  user_id:user.id,
                  user_type:user.user_type
                });
                return res.status(201).send({msg:"User registered successfully.",user_id: user.user_id, user_type:user.user_type, token})
          }

          if(user_type === "admin"){
            const data = {
              username: fname + lname,
              email: email,
              password: password,
              read_notifications: [],
              fname: fname,
              lname: lname,
              profile: null,
              user_type: user_type,
              privilages: [],
        
              };
              
              const userRef = await collectionList.adminCollection.add(data);
              const token = generate_token({
                user_id:user.id,
                user_type:user.user_type
              });
              return res.status(201).send({msg:"User registered successfully.",user_id: user.user_id, user_type:user.user_type, token})
        }
        }
    } catch (error) {
        return res.status(404).send({ msg: "Authentication Error", error });

    }
}

async function login(req,res){

  const { email, password, user_type } = req.body;
  const userInfo = await verify_user(email, user_type)
  const user = userInfo.data;
  console.log(user)
  console.log(user.password, password)
  if(user){
    if(user.password===password){
      const token = generate_token({
        user_id : user.id,
        user_type : user.user_type
      });

      return res.status(200).send({msg:"User logged in",user_id: user.user_id, user_type:user.user_type, token})
    }else{

      return res.status(500).send("Password did not match")

    }
    
  }else{

    return res.status(500).send("Entered user email doesn't exist")

  }
}

module.exports = { register, login};
