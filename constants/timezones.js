const TIMEZONES = [
  {
    country: "Afghanistan",
    place: "Kabul",
    timeZone: "Asia/Kabul",
  },
  {
    country: "Albania",
    place: "Tirana",
    timeZone: "Europe/Tirane",
  },
  {
    country: "Algeria",
    place: "Algiers",
    timeZone: "Africa/Algiers",
  },
  {
    country: "American Samoa",
    place: "Pago Pago",
    timeZone: "Pacific/Pago_Pago",
  },
  {
    country: "Andorra",
    place: "Andorra la Vella",
    timeZone: "Europe/Andorra",
  },
  {
    country: "Angola",
    place: "Luanda",
    timeZone: "Africa/Luanda",
  },
  {
    country: "Anguilla",
    place: "The Valley",
    timeZone: "America/Anguilla",
  },
  {
    country: "Antarctica",
    place: "Casey",
    timeZone: "Antarctica/Casey",
  },
  {
    country: "Antarctica",
    place: "Davis",
    timeZone: "Antarctica/Davis",
  },
  {
    country: "Antarctica",
    place: "DumontDUrville",
    timeZone: "Antarctica/DumontDUrville",
  },
  {
    country: "Antarctica",
    place: "Mawson",
    timeZone: "Antarctica/Mawson",
  },
  {
    country: "Antarctica",
    place: "McMurdo",
    timeZone: "Antarctica/McMurdo",
  },
  {
    country: "Antarctica",
    place: "Palmer",
    timeZone: "Antarctica/Palmer",
  },
  {
    country: "Antarctica",
    place: "Rothera",
    timeZone: "Antarctica/Rothera",
  },
  {
    country: "Antarctica",
    place: "Syowa",
    timeZone: "Antarctica/Syowa",
  },
  {
    country: "Antarctica",
    place: "Troll",
    timeZone: "Antarctica/Troll",
  },
  {
    country: "Antarctica",
    place: "Vostok",
    timeZone: "Antarctica/Vostok",
  },
  {
    country: "Antigua and Barbuda",
    place: "Saint John's",
    timeZone: "America/Antigua",
  },
  {
    country: "Argentina",
    place: "Buenos Aires",
    timeZone: "America/Argentina/Buenos_Aires",
  },
  {
    country: "Argentina",
    place: "Catamarca",
    timeZone: "America/Argentina/Catamarca",
  },
  {
    country: "Argentina",
    place: "Córdoba",
    timeZone: "America/Argentina/Cordoba",
  },
  {
    country: "Argentina",
    place: "Jujuy",
    timeZone: "America/Argentina/Jujuy",
  },
  {
    country: "Argentina",
    place: "La Rioja",
    timeZone: "America/Argentina/La_Rioja",
  },
  {
    country: "Argentina",
    place: "Mendoza",
    timeZone: "America/Argentina/Mendoza",
  },
  {
    country: "Argentina",
    place: "Río Gallegos",
    timeZone: "America/Argentina/Rio_Gallegos",
  },
  {
    country: "Argentina",
    place: "Salta",
    timeZone: "America/Argentina/Salta",
  },
  {
    country: "Argentina",
    place: "San Juan",
    timeZone: "America/Argentina/San_Juan",
  },
  {
    country: "Argentina",
    place: "San Luis",
    timeZone: "America/Argentina/San_Luis",
  },
  {
    country: "Argentina",
    place: "Tucumán",
    timeZone: "America/Argentina/Tucuman",
  },
  {
    country: "Argentina",
    place: "Ushuaia",
    timeZone: "America/Argentina/Ushuaia",
  },
  {
    country: "Armenia",
    place: "Yerevan",
    timeZone: "Asia/Yerevan",
  },
  {
    country: "Aruba",
    place: "Oranjestad",
    timeZone: "America/Aruba",
  },
  {
    country: "Australia",
    place: "Adelaide",
    timeZone: "Australia/Adelaide",
  },
  {
    country: "Australia",
    place: "Brisbane",
    timeZone: "Australia/Brisbane",
  },
  {
    country: "Australia",
    place: "Broken Hill",
    timeZone: "Australia/Broken_Hill",
  },
  {
    country: "Australia",
    place: "Currie",
    timeZone: "Australia/Currie",
  },
  {
    country: "Australia",
    place: "Darwin",
    timeZone: "Australia/Darwin",
  },
  {
    country: "Australia",
    place: "Eucla",
    timeZone: "Australia/Eucla",
  },
  {
    country: "Australia",
    place: "Hobart",
    timeZone: "Australia/Hobart",
  },
  {
    country: "Australia",
    place: "Lindeman",
    timeZone: "Australia/Lindeman",
  },
  {
    country: "Australia",
    place: "Lord Howe",
    timeZone: "Australia/Lord_Howe",
  },
  {
    country: "Australia",
    place: "Melbourne",
    timeZone: "Australia/Melbourne",
  },
  {
    country: "Australia",
    place: "Perth",
    timeZone: "Australia/Perth",
  },
  {
    country: "Australia",
    place: "Sydney",
    timeZone: "Australia/Sydney",
  },
  {
    country: "Austria",
    place: "Vienna",
    timeZone: "Europe/Vienna",
  },
  {
    country: "Azerbaijan",
    place: "Baku",
    timeZone: "Asia/Baku",
  },
  {
    country: "Bahamas",
    place: "Nassau",
    timeZone: "America/Nassau",
  },
  {
    country: "Bahrain",
    place: "Manama",
    timeZone: "Asia/Bahrain",
  },
  {
    country: "Bangladesh",
    place: "Dhaka",
    timeZone: "Asia/Dhaka",
  },
  {
    country: "Barbados",
    place: "Bridgetown",
    timeZone: "America/Barbados",
  },
  {
    country: "Belarus",
    place: "Minsk",
    timeZone: "Europe/Minsk",
  },
  {
    country: "Belgium",
    place: "Brussels",
    timeZone: "Europe/Brussels",
  },
  {
    country: "Belize",
    place: "Belize City",
    timeZone: "America/Belize",
  },
  {
    country: "Benin",
    place: "Porto-Novo",
    timeZone: "Africa/Porto-Novo",
  },
  {
    country: "Bermuda",
    place: "Hamilton",
    timeZone: "Atlantic/Bermuda",
  },
  {
    country: "Bhutan",
    place: "Thimphu",
    timeZone: "Asia/Thimphu",
  },
  {
    country: "Bolivia",
    place: "La Paz",
    timeZone: "America/La_Paz",
  },
  {
    country: "Bonaire",
    place: "Kralendijk",
    timeZone: "America/Kralendijk",
  },
  {
    country: "Bosnia and Herzegovina",
    place: "Sarajevo",
    timeZone: "Europe/Sarajevo",
  },
  {
    country: "Botswana",
    place: "Gaborone",
    timeZone: "Africa/Gaborone",
  },
  {
    country: "Brazil",
    place: "Acre",
    timeZone: "America/Rio_Branco",
  },
  {
    country: "Brazil",
    place: "DeNoronha",
    timeZone: "America/Noronha",
  },
  {
    country: "Brazil",
    place: "Fortaleza",
    timeZone: "America/Fortaleza",
  },
  {
    country: "Brazil",
    place: "Maceió",
    timeZone: "America/Maceio",
  },
  {
    country: "Brazil",
    place: "Manaus",
    timeZone: "America/Manaus",
  },
  {
    country: "Brazil",
    place: "Recife",
    timeZone: "America/Recife",
  },
  {
    country: "Brazil",
    place: "Rio de Janeiro",
    timeZone: "America/Rio_de_Janeiro",
  },
  {
    country: "Brazil",
    place: "Salvador",
    timeZone: "America/Bahia",
  },
  {
    country: "Brazil",
    place: "São Paulo",
    timeZone: "America/Sao_Paulo",
  },
  {
    country: "British Virgin Islands",
    place: "Road Town",
    timeZone: "America/Tortola",
  },
  {
    country: "Brunei",
    place: "Bandar Seri Begawan",
    timeZone: "Asia/Brunei",
  },
  {
    country: "Bulgaria",
    place: "Sofia",
    timeZone: "Europe/Sofia",
  },
  {
    country: "Burkina Faso",
    place: "Ouagadougou",
    timeZone: "Africa/Ouagadougou",
  },
  {
    country: "Burundi",
    place: "Bujumbura",
    timeZone: "Africa/Bujumbura",
  },
  {
    country: "Cambodia",
    place: "Phnom Penh",
    timeZone: "Asia/Phnom_Penh",
  },
  {
    country: "Cameroon",
    place: "Yaoundé",
    timeZone: "Africa/Douala",
  },
  {
    country: "Canada",
    place: "Atikokan",
    timeZone: "America/Atikokan",
  },
  {
    country: "Canada",
    place: "Blanc-Sablon",
    timeZone: "America/Blanc-Sablon",
  },
  {
    country: "Canada",
    place: "Cambridge Bay",
    timeZone: "America/Cambridge_Bay",
  },
  {
    country: "Canada",
    place: "Creston",
    timeZone: "America/Creston",
  },
  {
    country: "Canada",
    place: "Dawson",
    timeZone: "America/Dawson",
  },
  {
    country: "Canada",
    place: "Dawson Creek",
    timeZone: "America/Dawson_Creek",
  },
  {
    country: "Canada",
    place: "Edmonton",
    timeZone: "America/Edmonton",
  },
  {
    country: "Canada",
    place: "Glace Bay",
    timeZone: "America/Glace_Bay",
  },
  {
    country: "Canada",
    place: "Goose Bay",
    timeZone: "America/Goose_Bay",
  },
  {
    country: "Canada",
    place: "Halifax",
    timeZone: "America/Halifax",
  },
  {
    country: "Canada",
    place: "Inuvik",
    timeZone: "America/Inuvik",
  },
  {
    country: "Canada",
    place: "Iqaluit",
    timeZone: "America/Iqaluit",
  },
  {
    country: "Canada",
    place: "Moncton",
    timeZone: "America/Moncton",
  },
  {
    country: "Canada",
    place: "Montréal",
    timeZone: "America/Montreal",
  },
  {
    country: "Canada",
    place: "Nipigon",
    timeZone: "America/Nipigon",
  },
  {
    country: "Canada",
    place: "Pangnirtung",
    timeZone: "America/Pangnirtung",
  },
  {
    country: "Canada",
    place: "Rainy River",
    timeZone: "America/Rainy_River",
  },
  {
    country: "Canada",
    place: "Rankin Inlet",
    timeZone: "America/Rankin_Inlet",
  },
  {
    country: "Canada",
    place: "Regina",
    timeZone: "America/Regina",
  },
  {
    country: "Canada",
    place: "Resolute",
    timeZone: "America/Resolute",
  },
  {
    country: "Canada",
    place: "St. Johns",
    timeZone: "America/St_Johns",
  },
  {
    country: "Canada",
    place: "Swift Current",
    timeZone: "America/Swift_Current",
  },
  {
    country: "Canada",
    place: "Thunder Bay",
    timeZone: "America/Thunder_Bay",
  },
  {
    country: "Canada",
    place: "Toronto",
    timeZone: "America/Toronto",
  },
  {
    country: "Canada",
    place: "Vancouver",
    timeZone: "America/Vancouver",
  },
  {
    country: "Canada",
    place: "Whitehorse",
    timeZone: "America/Whitehorse",
  },
  {
    country: "Canada",
    place: "Winnipeg",
    timeZone: "America/Winnipeg",
  },
  {
    country: "Canada",
    place: "Yellowknife",
    timeZone: "America/Yellowknife",
  },
  {
    country: "Cape Verde",
    place: "Praia",
    timeZone: "Atlantic/Cape_Verde",
  },
  {
    country: "Cayman Islands",
    place: "George Town",
    timeZone: "America/Cayman",
  },
  {
    country: "Central African Republic",
    place: "Bangui",
    timeZone: "Africa/Bangui",
  },
  {
    country: "Chad",
    place: "N'Djamena",
    timeZone: "Africa/Ndjamena",
  },
  {
    country: "Chile",
    place: "Easter Island",
    timeZone: "Pacific/Easter",
  },
  {
    country: "Chile",
    place: "Santiago",
    timeZone: "America/Santiago",
  },
  {
    country: "China",
    place: "Beijing",
    timeZone: "Asia/Shanghai",
  },
  {
    country: "China",
    place: "Chongqing",
    timeZone: "Asia/Chongqing",
  },
  {
    country: "China",
    place: "Harbin",
    timeZone: "Asia/Harbin",
  },
  {
    country: "China",
    place: "Kashgar",
    timeZone: "Asia/Kashgar",
  },
  {
    country: "China",
    place: "Macao",
    timeZone: "Asia/Macau",
  },
  {
    country: "China",
    place: "Shanghai",
    timeZone: "Asia/Shanghai",
  },
  {
    country: "China",
    place: "Urumqi",
    timeZone: "Asia/Urumqi",
  },
  {
    country: "Christmas Island",
    place: "Flying Fish Cove",
    timeZone: "Indian/Christmas",
  },
  {
    country: "Cocos (Keeling) Islands",
    place: "West Island",
    timeZone: "Indian/Cocos",
  },
  {
    country: "Colombia",
    place: "Bogotá",
    timeZone: "America/Bogota",
  },
  {
    country: "Comoros",
    place: "Moroni",
    timeZone: "Indian/Comoro",
  },
  {
    country: "Congo (DRC)",
    place: "Kinshasa",
    timeZone: "Africa/Kinshasa",
  },
  {
    country: "Congo (Republic)",
    place: "Brazzaville",
    timeZone: "Africa/Brazzaville",
  },
  {
    country: "Cook Islands",
    place: "Rarotonga",
    timeZone: "Pacific/Rarotonga",
  },
  {
    country: "Costa Rica",
    place: "San José",
    timeZone: "America/Costa_Rica",
  },
  {
    country: "Croatia",
    place: "Zagreb",
    timeZone: "Europe/Zagreb",
  },
  {
    country: "Cuba",
    place: "Havana",
    timeZone: "America/Havana",
  },
  {
    country: "Curaçao",
    place: "Willemstad",
    timeZone: "America/Curacao",
  },
  {
    country: "Cyprus",
    place: "Nicosia",
    timeZone: "Asia/Nicosia",
  },
  {
    country: "Czech Republic",
    place: "Prague",
    timeZone: "Europe/Prague",
  },
  {
    country: "Denmark",
    place: "Copenhagen",
    timeZone: "Europe/Copenhagen",
  },
  {
    country: "Djibouti",
    place: "Djibouti",
    timeZone: "Africa/Djibouti",
  },
  {
    country: "Dominica",
    place: "Roseau",
    timeZone: "America/Dominica",
  },
  {
    country: "Dominican Republic",
    place: "Santo Domingo",
    timeZone: "America/Santo_Domingo",
  },
  {
    country: "Ecuador",
    place: "Guayaquil",
    timeZone: "America/Guayaquil",
  },
  {
    country: "Ecuador",
    place: "Quito",
    timeZone: "America/Lima",
  },
  {
    country: "Egypt",
    place: "Cairo",
    timeZone: "Africa/Cairo",
  },
  {
    country: "El Salvador",
    place: "San Salvador",
    timeZone: "America/El_Salvador",
  },
  {
    country: "Equatorial Guinea",
    place: "Malabo",
    timeZone: "Africa/Malabo",
  },
  {
    country: "Eritrea",
    place: "Asmara",
    timeZone: "Africa/Asmara",
  },
  {
    country: "Estonia",
    place: "Tallinn",
    timeZone: "Europe/Tallinn",
  },
  {
    country: "Eswatini",
    place: "Mbabane",
    timeZone: "Africa/Mbabane",
  },
  {
    country: "Ethiopia",
    place: "Addis Ababa",
    timeZone: "Africa/Addis_Ababa",
  },
  {
    country: "Falkland Islands",
    place: "Stanley",
    timeZone: "Atlantic/Stanley",
  },
  {
    country: "Faroe Islands",
    place: "Tórshavn",
    timeZone: "Atlantic/Faroe",
  },
  {
    country: "Fiji",
    place: "Fiji",
    timeZone: "Pacific/Fiji",
  },
  {
    country: "Finland",
    place: "Helsinki",
    timeZone: "Europe/Helsinki",
  },
  {
    country: "France",
    place: "Paris",
    timeZone: "Europe/Paris",
  },
  {
    country: "French Guiana",
    place: "Cayenne",
    timeZone: "America/Cayenne",
  },
  {
    country: "French Polynesia",
    place: "Papeete",
    timeZone: "Pacific/Tahiti",
  },
  {
    country: "Gabon",
    place: "Libreville",
    timeZone: "Africa/Libreville",
  },
  {
    country: "Gambia",
    place: "Banjul",
    timeZone: "Africa/Banjul",
  },
  {
    country: "Georgia",
    place: "Tbilisi",
    timeZone: "Asia/Tbilisi",
  },
  {
    country: "Germany",
    place: "Berlin",
    timeZone: "Europe/Berlin",
  },
  {
    country: "Ghana",
    place: "Accra",
    timeZone: "Africa/Accra",
  },
  {
    country: "Gibraltar",
    place: "Gibraltar",
    timeZone: "Europe/Gibraltar",
  },
  {
    country: "Greece",
    place: "Athens",
    timeZone: "Europe/Athens",
  },
  {
    country: "Greenland",
    place: "Nuuk",
    timeZone: "America/Nuuk",
  },
  {
    country: "Grenada",
    place: "St. George's",
    timeZone: "America/Grenada",
  },
  {
    country: "Guadeloupe",
    place: "Pointe-à-Pitre",
    timeZone: "America/Guadeloupe",
  },
  {
    country: "Guam",
    place: "Hagåtña",
    timeZone: "Pacific/Guam",
  },
  {
    country: "Guatemala",
    place: "Guatemala City",
    timeZone: "America/Guatemala",
  },
  {
    country: "Guernsey",
    place: "St. Peter Port",
    timeZone: "Europe/Guernsey",
  },
  {
    country: "Guinea",
    place: "Conakry",
    timeZone: "Africa/Conakry",
  },
  {
    country: "Guinea-Bissau",
    place: "Bissau",
    timeZone: "Africa/Bissau",
  },
  {
    country: "Guyana",
    place: "Georgetown",
    timeZone: "America/Guyana",
  },
  {
    country: "Haiti",
    place: "Port-au-Prince",
    timeZone: "America/Port-au-Prince",
  },
  {
    country: "Honduras",
    place: "Tegucigalpa",
    timeZone: "America/Tegucigalpa",
  },
  {
    country: "Hong Kong",
    place: "Hong Kong",
    timeZone: "Asia/Hong_Kong",
  },
  {
    country: "Hungary",
    place: "Budapest",
    timeZone: "Europe/Budapest",
  },
  {
    country: "Iceland",
    place: "Reykjavik",
    timeZone: "Atlantic/Reykjavik",
  },
  {
    country: "India",
    place: "Kolkata",
    timeZone: "Asia/Kolkata",
  },
  {
    country: "Indonesia",
    place: "Jakarta",
    timeZone: "Asia/Jakarta",
  },
  {
    country: "Indonesia",
    place: "Jayapura",
    timeZone: "Asia/Jayapura",
  },
  {
    country: "Indonesia",
    place: "Makassar",
    timeZone: "Asia/Makassar",
  },
  {
    country: "Indonesia",
    place: "Pontianak",
    timeZone: "Asia/Pontianak",
  },
  {
    country: "Iran",
    place: "Tehran",
    timeZone: "Asia/Tehran",
  },
  {
    country: "Iraq",
    place: "Baghdad",
    timeZone: "Asia/Baghdad",
  },
  {
    country: "Ireland",
    place: "Dublin",
    timeZone: "Europe/Dublin",
  },
  {
    country: "Isle of Man",
    place: "Douglas",
    timeZone: "Europe/Isle_of_Man",
  },
  {
    country: "Israel",
    place: "Jerusalem",
    timeZone: "Asia/Jerusalem",
  },
  {
    country: "Italy",
    place: "Rome",
    timeZone: "Europe/Rome",
  },
  {
    country: "Jamaica",
    place: "Kingston",
    timeZone: "America/Jamaica",
  },
  {
    country: "Japan",
    place: "Tokyo",
    timeZone: "Asia/Tokyo",
  },
  {
    country: "Jersey",
    place: "Saint Helier",
    timeZone: "Europe/Jersey",
  },
  {
    country: "Jordan",
    place: "Amman",
    timeZone: "Asia/Amman",
  },
  {
    country: "Kazakhstan",
    place: "Almaty",
    timeZone: "Asia/Almaty",
  },
  {
    country: "Kazakhstan",
    place: "Aqtau",
    timeZone: "Asia/Aqtau",
  },
  {
    country: "Kazakhstan",
    place: "Aqtobe",
    timeZone: "Asia/Aqtobe",
  },
  {
    country: "Kazakhstan",
    place: "Atyrau",
    timeZone: "Asia/Atyrau",
  },
  {
    country: "Kazakhstan",
    place: "Oral",
    timeZone: "Asia/Oral",
  },
  {
    country: "Kazakhstan",
    place: "Oskemen",
    timeZone: "Asia/Qostanay",
  },
  {
    country: "Kazakhstan",
    place: "Qyzylorda",
    timeZone: "Asia/Qyzylorda",
  },
  {
    country: "Kazakhstan",
    place: "Nur-Sultan",
    timeZone: "Asia/Qostanay",
  },
  {
    country: "Kenya",
    place: "Nairobi",
    timeZone: "Africa/Nairobi",
  },
  {
    country: "Kiribati",
    place: "Tarawa",
    timeZone: "Pacific/Tarawa",
  },
  {
    country: "Kosovo",
    place: "Pristina",
    timeZone: "Europe/Belgrade",
  },
  {
    country: "Kuwait",
    place: "Kuwait City",
    timeZone: "Asia/Kuwait",
  },
  {
    country: "Kyrgyzstan",
    place: "Bishkek",
    timeZone: "Asia/Bishkek",
  },
  {
    country: "Laos",
    place: "Vientiane",
    timeZone: "Asia/Vientiane",
  },
  {
    country: "Latvia",
    place: "Riga",
    timeZone: "Europe/Riga",
  },
  {
    country: "Lebanon",
    place: "Beirut",
    timeZone: "Asia/Beirut",
  },
  {
    country: "Lesotho",
    place: "Maseru",
    timeZone: "Africa/Maseru",
  },
  {
    country: "Liberia",
    place: "Monrovia",
    timeZone: "Africa/Monrovia",
  },
  {
    country: "Libya",
    place: "Tripoli",
    timeZone: "Africa/Tripoli",
  },
  {
    country: "Liechtenstein",
    place: "Vaduz",
    timeZone: "Europe/Vaduz",
  },
  {
    country: "Lithuania",
    place: "Vilnius",
    timeZone: "Europe/Vilnius",
  },
  {
    country: "Luxembourg",
    place: "Luxembourg",
    timeZone: "Europe/Luxembourg",
  },
  {
    country: "Macau",
    place: "Macau",
    timeZone: "Asia/Macau",
  },
  {
    country: "Madagascar",
    place: "Antananarivo",
    timeZone: "Indian/Antananarivo",
  },
  {
    country: "Malawi",
    place: "Lilongwe",
    timeZone: "Africa/Blantyre",
  },
  {
    country: "Malaysia",
    place: "Kuala Lumpur",
    timeZone: "Asia/Kuala_Lumpur",
  },
  {
    country: "Malaysia",
    place: "Kuching",
    timeZone: "Asia/Kuching",
  },
  {
    country: "Maldives",
    place: "Malé",
    timeZone: "Indian/Maldives",
  },
  {
    country: "Mali",
    place: "Bamako",
    timeZone: "Africa/Bamako",
  },
  {
    country: "Malta",
    place: "Valletta",
    timeZone: "Europe/Malta",
  },
  {
    country: "Marshall Islands",
    place: "Majuro",
    timeZone: "Pacific/Majuro",
  },
  {
    country: "Martinique",
    place: "Fort-de-France",
    timeZone: "America/Martinique",
  },
  {
    country: "Mauritania",
    place: "Nouakchott",
    timeZone: "Africa/Nouakchott",
  },
  {
    country: "Mauritius",
    place: "Port Louis",
    timeZone: "Indian/Mauritius",
  },
  {
    country: "Mayotte",
    place: "Mamoudzou",
    timeZone: "Indian/Mayotte",
  },
  {
    country: "Mexico",
    place: "Cancún",
    timeZone: "America/Cancun",
  },
  {
    country: "Mexico",
    place: "Chihuahua",
    timeZone: "America/Chihuahua",
  },
  {
    country: "Mexico",
    place: "Hermosillo",
    timeZone: "America/Hermosillo",
  },
  {
    country: "Mexico",
    place: "Matamoros",
    timeZone: "America/Matamoros",
  },
  {
    country: "Mexico",
    place: "Mazatlán",
    timeZone: "America/Mazatlan",
  },
  {
    country: "Mexico",
    place: "Merida",
    timeZone: "America/Merida",
  },
  {
    country: "Mexico",
    place: "Mexico City",
    timeZone: "America/Mexico_City",
  },
  {
    country: "Mexico",
    place: "Monterrey",
    timeZone: "America/Monterrey",
  },
  {
    country: "Mexico",
    place: "Ojinaga",
    timeZone: "America/Ojinaga",
  },
  {
    country: "Mexico",
    place: "Tijuana",
    timeZone: "America/Tijuana",
  },
  {
    country: "Micronesia",
    place: "Palikir",
    timeZone: "Pacific/Pohnpei",
  },
  {
    country: "Moldova",
    place: "Chișinău",
    timeZone: "Europe/Chisinau",
  },
  {
    country: "Monaco",
    place: "Monaco",
    timeZone: "Europe/Monaco",
  },
  {
    country: "Mongolia",
    place: "Ulaanbaatar",
    timeZone: "Asia/Ulaanbaatar",
  },
  {
    country: "Montenegro",
    place: "Podgorica",
    timeZone: "Europe/Podgorica",
  },
  {
    country: "Montserrat",
    place: "Plymouth",
    timeZone: "America/Montserrat",
  },
  {
    country: "Morocco",
    place: "Casablanca",
    timeZone: "Africa/Casablanca",
  },
  {
    country: "Mozambique",
    place: "Maputo",
    timeZone: "Africa/Maputo",
  },
  {
    country: "Myanmar",
    place: "Yangon",
    timeZone: "Asia/Yangon",
  },
  {
    country: "Namibia",
    place: "Windhoek",
    timeZone: "Africa/Windhoek",
  },
  {
    country: "Nauru",
    place: "Yaren",
    timeZone: "Pacific/Nauru",
  },
  {
    country: "Nepal",
    place: "Kathmandu",
    timeZone: "Asia/Kathmandu",
  },
  {
    country: "Netherlands",
    place: "Amsterdam",
    timeZone: "Europe/Amsterdam",
  },
  {
    country: "New Caledonia",
    place: "Nouméa",
    timeZone: "Pacific/Noumea",
  },
  {
    country: "New Zealand",
    place: "Auckland",
    timeZone: "Pacific/Auckland",
  },
  {
    country: "New Zealand",
    place: "Chatham",
    timeZone: "Pacific/Chatham",
  },
  {
    country: "Nicaragua",
    place: "Managua",
    timeZone: "America/Managua",
  },
  {
    country: "Niger",
    place: "Niamey",
    timeZone: "Africa/Niamey",
  },
  {
    country: "Nigeria",
    place: "Lagos",
    timeZone: "Africa/Lagos",
  },
  {
    country: "Niue",
    place: "Alofi",
    timeZone: "Pacific/Niue",
  },
  {
    country: "Norfolk Island",
    place: "Kingston",
    timeZone: "Pacific/Norfolk",
  },
  {
    country: "North Korea",
    place: "Pyongyang",
    timeZone: "Asia/Pyongyang",
  },
  {
    country: "North Macedonia",
    place: "Skopje",
    timeZone: "Europe/Skopje",
  },
  {
    country: "Northern Mariana Islands",
    place: "Saipan",
    timeZone: "Pacific/Saipan",
  },
  {
    country: "Norway",
    place: "Oslo",
    timeZone: "Europe/Oslo",
  },
  {
    country: "Oman",
    place: "Muscat",
    timeZone: "Asia/Muscat",
  },
  {
    country: "Pakistan",
    place: "Karachi",
    timeZone: "Asia/Karachi",
  },
  {
    country: "Palau",
    place: "Ngerulmud",
    timeZone: "Pacific/Palau",
  },
  {
    country: "Panama",
    place: "Panama City",
    timeZone: "America/Panama",
  },
  {
    country: "Papua New Guinea",
    place: "Port Moresby",
    timeZone: "Pacific/Port_Moresby",
  },
  {
    country: "Paraguay",
    place: "Asunción",
    timeZone: "America/Asunción",
  },
  {
    country: "Peru",
    place: "Lima",
    timeZone: "America/Lima",
  },
  {
    country: "Philippines",
    place: "Manila",
    timeZone: "Asia/Manila",
  },
  {
    country: "Pitcairn Islands",
    place: "Adamstown",
    timeZone: "Pacific/Pitcairn",
  },
  {
    country: "Poland",
    place: "Warsaw",
    timeZone: "Europe/Warsaw",
  },
  {
    country: "Portugal",
    place: "Lisbon",
    timeZone: "Europe/Lisbon",
  },
  {
    country: "Qatar",
    place: "Doha",
    timeZone: "Asia/Qatar",
  },
  {
    country: "Romania",
    place: "Bucharest",
    timeZone: "Europe/Bucharest",
  },
  {
    country: "Russia",
    place: "Kaliningrad",
    timeZone: "Europe/Kaliningrad",
  },
  {
    country: "Russia",
    place: "Moscow",
    timeZone: "Europe/Moscow",
  },
  {
    country: "Russia",
    place: "Sakhalin",
    timeZone: "Asia/Sakhalin",
  },
  {
    country: "Russia",
    place: "Yakutsk",
    timeZone: "Asia/Yakutsk",
  },
  {
    country: "Rwanda",
    place: "Kigali",
    timeZone: "Africa/Kigali",
  },
  {
    country: "Saint Barthélemy",
    place: "Gustavia",
    timeZone: "America/St_Barthelemy",
  },
  {
    country: "Saint Helena, Ascension and Tristan da Cunha",
    place: "Jamestown",
    timeZone: "Atlantic/St_Helena",
  },
  {
    country: "Saint Kitts and Nevis",
    place: "Basseterre",
    timeZone: "America/St_Kitts",
  },
  {
    country: "Saint Lucia",
    place: "Castries",
    timeZone: "America/St_Lucia",
  },
  {
    country: "Saint Martin",
    place: "Marigot",
    timeZone: "America/St_Martin",
  },
  {
    country: "Saint Pierre and Miquelon",
    place: "Saint-Pierre",
    timeZone: "America/St_Pierre",
  },
  {
    country: "Saint Vincent and the Grenadines",
    place: "Kingstown",
    timeZone: "America/St_Vincent",
  },
  {
    country: "Samoa",
    place: "Apia",
    timeZone: "Pacific/Apia",
  },
  {
    country: "San Marino",
    place: "San Marino",
    timeZone: "Europe/San_Marino",
  },
  {
    country: "Sao Tome and Principe",
    place: "São Tomé",
    timeZone: "Africa/Sao_Tome",
  },
  {
    country: "Saudi Arabia",
    place: "Riyadh",
    timeZone: "Asia/Riyadh",
  },
  {
    country: "Senegal",
    place: "Dakar",
    timeZone: "Africa/Dakar",
  },
  {
    country: "Serbia",
    place: "Belgrade",
    timeZone: "Europe/Belgrade",
  },
  {
    country: "Seychelles",
    place: "Victoria",
    timeZone: "Indian/Mahe",
  },
  {
    country: "Sierra Leone",
    place: "Freetown",
    timeZone: "Africa/Freetown",
  },
  {
    country: "Singapore",
    place: "Singapore",
    timeZone: "Asia/Singapore",
  },
  {
    country: "Sint Eustatius",
    place: "Oranjestad",
    timeZone: "America/Aruba",
  },
  {
    country: "Sint Maarten",
    place: "Philipsburg",
    timeZone: "America/St_Maarten",
  },
  {
    country: "Slovakia",
    place: "Bratislava",
    timeZone: "Europe/Bratislava",
  },
  {
    country: "Slovenia",
    place: "Ljubljana",
    timeZone: "Europe/Ljubljana",
  },
  {
    country: "Solomon Islands",
    place: "Honiara",
    timeZone: "Pacific/Honiara",
  },
  {
    country: "Somalia",
    place: "Mogadishu",
    timeZone: "Africa/Mogadishu",
  },
  {
    country: "South Africa",
    place: "Bloemfontein",
    timeZone: "Africa/Johannesburg",
  },
];

export default TIMEZONES;
