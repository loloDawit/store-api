const address = {
  
  storeNumber: '201',
  id: '',
  firstName: 'dawitdawitdawitdawitdawitdawitdawixdawitoooop',
  middleName: 'azziidawitdawitdawitdawitdawitdawixdawit',
  lastName: 'Abera',
  addressLine1: '13 7th Ave',
  addressLine2: '',
  city: 'New York',
  state: 'NY',
  postalCode: '10011',
  countryCode: 'US',
  default: false,
  saveAsDefault: false
}
;

// problem: address fields longer than 35char are breaking downstream servcies
// An an engineer, i want to make sure, these fields are less or equal to 35chars
// create a function that takes in address and validate the values.


const validater = (address) => {
  
  if (address) {
    if (address.storeNumber.length > 35) {
      address.storeNumber.substring(0, 35);
    }
    if (address.id.length > 35) {
      address.id.substring(0, 35);
    }
    if (address.firstName.length > 35) {
      address.firstName.substring(0, 35);
    }
    if (address.middleName.length > 35) {
      address.middleName.substring(0, 35);
    }
    if (address.lastName.length > 35) {
      address.lastName.substring(0, 35);
    }
    if (address.addressLine1.length > 35) {
      address.addressLine1.substring(0, 35);
    }
    if (address.addressLine2.length > 35) {
      address.addressLine2.substring(0, 35);
    }
    if (address.city.length > 35) {
      address.city.substring(0, 35);
    }
    if (address.state.length > 35) {
      address.state.substring(0, 35);
    }
    if (address.postalCode.length > 35) {
      address.postalCode.substring(0, 35);
    }
    if (address.countryCode.length > 35) {
      address.countryCode.substring(0, 35);
    }

    return address;
  }
};


const x = validater(address)
console.log(x.firstName);
