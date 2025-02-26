module.exports.generateSlug = (name)=>{
  name = name.replace(/^\s+|\s+$/g, "");
  name = name.toLowerCase();
  name = name
  .toLowerCase()
  .replace(/\s+/g, '-') // Replace spaces with hyphens
  .replace(/[^\w\-]+/g, '') // Remove special characters
  .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
  .replace(/^-+/, '') // Trim hyphens from the start
  .replace(/-+$/, ''); // Trim hyphens from the end
  // name = name
  //   .replace(/[^a-z0-9 -]/g, "")
  //   .replace(/\s+/g, "-") // replace spaces with hyphens
  //   .replace(/-+/g, "-"); // remove consecutive hyphens
  return name;
}

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, ''); 
};

// const generateUniqueSlug = async (name) => {
//   let uniqueSlug = generateSlug(name); 
//   let slugExists = await ProductRepository.getBySlug(uniqueSlug); 
//   let counter = 1; 

//   while (slugExists) {
//     uniqueSlug = `${uniqueSlug}-${counter}`; 
//     slugExists = await ProductRepository.getBySlug(uniqueSlug); 
//     counter++; 
//   }

//   return uniqueSlug; 
// };

// // Usage
// const name = "My Product";
// const uniqueSlug = await generateUniqueSlug(name);
// console.log(uniqueSlug); // Example output: "my-product-1" (if "my-product" already exists)