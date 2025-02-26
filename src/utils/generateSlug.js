module.exports.generateSlug = (name)=>{
  name = name.replace(/^\s+|\s+$/g, "");
  name = name.toLowerCase();
  name = name
  .toLowerCase()
  .replace(/\s+/g, '-') 
  .replace(/[^\w\-]+/g, '') 
  .replace(/\-\-+/g, '-') 
  .replace(/^-+/, '') 
  .replace(/-+$/, '');

  //   .replace(/[^a-z0-9 -]/g, "")
  //   .replace(/\s+/g, "-")
  //   .replace(/-+/g, "-");
  return name;
}
