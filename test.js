
const address = {
  storeNumber: '201',
  id: '',
  firstName: 'dawitdawitdawitdawitdawitdawitdawixdawit',
  middleName: 'azziidawitdawitdawitdawitdawitdawixdawit',
  lastName: 'Abera',
  addressLine1: '13 7th Ave',
  addressLine2: '',
  city: 'New York',
  state: 'NY',
  postalCode: '10011',
  countryCode: 'US',
  default: false,
  saveAsDefault: false,
  
}


// problem: address fields longer than 35char are breaking downstream servcies
// An an engineer, i want to make sure, these fields are less or equal to 35chars
// create a function that takes in address and validate the values.

// x is obj {}
// key : value
// key y,z
// value 1,2
// var array [1,2]

var x = {
  y: 1,
  z: 2
};
// how can i check if a given string is 35 or not
var b = 'dawitdawitdawitdawitdawitdawitdawixdawit';
// console.log(b.substring(0, 35));

var p = [
  '201',
  '',
  'dawitdawitdawitdawitdawitdawitdawixdawit',
  'azziidawitdawitdawitdawitdawitdawixdawit',
  'Abera',
  '13 7th Ave',
  '',
  'New York',
  'NY',
  '10011',
  'US',
  false,
  false
];


let newValues = ''
p.forEach((v) => {

  if (v.length > 35) {
    newValues += v.substring(0,35) + '\n'
  }else{
    newValues += v + '\n'
  }
  return newValues
});

console.log(newValues);


