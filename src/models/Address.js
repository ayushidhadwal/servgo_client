export class Address {
  constructor(
    id,
    name,
    address,
    country,
    city,
    phoneCode,
    phoneNumber,
    isDefault,
    countryName,
    cityName,
    buildingName,
    lat,
    long,
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.country = country;
    this.city = city;
    this.phoneCode = phoneCode;
    this.phoneNumber = phoneNumber;
    this.isDefault = Number(isDefault) === 1;
    this.countryName = countryName;
    this.cityName = cityName;
    this.buildingName = buildingName;
    this.lat = lat;
    this.long = long;
  }
}
