const fs = require('fs');
const path = require('path');

const dataJsonPath = path.join(__dirname, '../../data/data.json');
const outputPath = path.join(__dirname, '../../src/data/indianLocations.ts');

// Base comprehensive dataset for all Indian States & Districts
const baseLocations = {
  "Gujarat": {
    "Ahmedabad": { "Sanand": ["Changodar", "Sanand Rural", "Viramgam"], "Daskroi": ["Bopal", "Aslali", "Kathwada"] },
    "Surat": { "Choryasi": ["Hazira", "Ichhapore"], "Olpad": ["Sayan", "Kim"] },
    "Vadodara": { "Vadodara": ["Makarpura", "Gorwa"], "Vaghodia": ["Jarod", "Vaghodia Rural"] },
    "Rajkot": { "Rajkot": ["Metoda", "Shapar"], "Gondal": ["Gondal Rural", "Shivrajgadh"] },
    "Bhavnagar": { "Bhavnagar": ["Bhavnagar Urban", "Vartej"], "Mahuva": ["Mahuva Rural", "Talgajarda"] },
    "Jamnagar": { "Jamnagar": ["Jamnagar Urban", "Bed"], "Jodiya": ["Jodiya Rural", "Balambha"] },
    "Junagadh": { "Junagadh": ["Junagadh Urban", "Vadal"], "Keshod": ["Keshod Rural", "Kevadra"] },
    "Gandhinagar": { "Gandhinagar": ["Kudasan", "Sargasan"], "Kalol": ["Kalol Urban", "Vavol"] },
    "Kheda": { "Nadiad": ["Nadiad Urban", "Pij"], "Anand": ["Anand Urban", "Vallabh Vidyanagar"] },
    "Mehsana": { "Mehsana": ["Mehsana Urban", "Langhnaj"], "Kadi": ["Kadi Urban", "Chhatral"] }
  },
  "Maharashtra": {
    "Pune": { "Haveli": ["Wagholi", "Hinjawadi", "Khadakwasla"], "Mulshi": ["Pirangut", "Paud", "Hinjewadi Phase 3"] },
    "Mumbai Suburban": { "Andheri": ["Versova", "Marol"], "Borivali": ["Gorai", "Dahisar"] },
    "Mumbai City": { "Colaba": ["Fort", "Nariman Point"], "Dadra": ["Dadar West", "Prabhadevi"] },
    "Nagpur": { "Nagpur Urban": ["Sitabuldi", "Dharampeth"], "Hingna": ["MIDC Hingna", "Wanadongri"] },
    "Nashik": { "Nashik": ["Satpur", "Ambad"], "Sinnar": ["Musalgaon", "Sinnar Rural"] },
    "Thane": { "Thane": ["Majiwada", "Koppr"], "Kalyan": ["Dombivli", "Kalyan East"] },
    "Aurangabad (Chhatrapati Sambhajinagar)": { "Aurangabad": ["Waluj", "Chikalthana"], "Paithan": ["Paithan Urban", "Pachod"] },
    "Solapur": { "Solapur North": ["Solapur Urban", "Bale"], "Pandharpur": ["Pandharpur Urban", "Bhalwani"] },
    "Kolhapur": { "Karveer": ["Kolhapur Urban", "Gokul Shirgaon"], "Hatkanangale": ["Ichalkaranji", "Shiroli"] },
    "Amravati": { "Amravati": ["Amravati Urban", "Badnera"], "Achalpur": ["Paratwada", "Achalpur Rural"] }
  },
  "Rajasthan": {
    "Jaipur": { "Sanganer": ["Pratap Nagar", "Sitapura"], "Amer": ["Kukas", "Jal Mahal"] },
    "Udaipur": { "Girwa": ["Bhuwana", "Bedla"], "Gogunda": ["Gogunda Rural", "Jaswantgarh"] },
    "Jodhpur": { "Jodhpur": ["Mandore", "Basni"], "Luni": ["Salawas", "Kudi Bhagtasni"] },
    "Kota": { "Kota": ["Vigyan Nagar", "Ranpur"], "Ladpura": ["Ladpura Rural", "Mandana"] },
    "Bikaner": { "Bikaner": ["Bikaner Urban", "Nal"], "Nokha": ["Nokha Urban", "Deshnoke"] },
    "Ajmer": { "Ajmer": ["Ajmer Urban", "Pushkar"], "Kishangarh": ["Kishangarh Urban", "Madanganj"] },
    "Bhilwara": { "Bhilwara": ["Bhilwara Urban", "Harni"], "Shahpura": ["Shahpura Rural", "Dhikola"] },
    "Alwar": { "Alwar": ["Alwar Urban", "Bhiwadi"], "Behror": ["Neemrana", "Behror Rural"] }
  },
  "Karnataka": {
    "Bengaluru Urban": { "Bengaluru South": ["Electronic City", "Begur"], "Bengaluru North": ["Yelahanka", "Peenya"] },
    "Mysuru": { "Mysuru": ["Hebbal", "Vijayanagar"], "Nanjangud": ["Kadakola", "Tandavapura"] },
    "Dakshina Kannada": { "Mangaluru": ["Panambur", "Surathkal"], "Bantwal": ["BC Road", "Vittal"] },
    "Belagavi": { "Belagavi": ["Belagavi Urban", "Udyambag"], "Chikodi": ["Chikodi Rural", "Nipani"] },
    "Hubballi-Dharwad": { "Dharwad": ["Dharwad Urban", "Navalur"], "Hubballi": ["Gokul Road", "Tarikhal"] },
    "Kalaburagi": { "Kalaburagi": ["Kalaburagi Urban", "Sedam"], "Aland": ["Aland Rural", "Khajuri"] },
    "Tumakuru": { "Tumakuru": ["Kyathsandra", "Antarasanahalli"], "Tiptur": ["Tiptur Urban", "Konasandra"] }
  },
  "Tamil Nadu": {
    "Chennai": { "Guindy": ["Velachery", "Adyar"], "Mambalam": ["T Nagar", "Ashok Nagar"] },
    "Coimbatore": { "Coimbatore North": ["Peelamedu", "Saravanampatti"], "Coimbatore South": ["Kuniyamuthur", "Sundarapuram"] },
    "Madurai": { "Madurai North": ["Tallakulam", "Sellur"], "Madurai South": ["Tiruparankundram", "Avaniyapuram"] },
    "Tiruchirappalli": { "Trichy Urban": ["Thillai Nagar", "Srirangam"], "Lalgudi": ["Lalgudi Rural", "Manachanallur"] },
    "Salem": { "Salem South": ["Fairlands", "Suramangalam"], "Attur": ["Attur Urban", "Narasingapuram"] },
    "Tirunelveli": { "Tirunelveli": ["Palayamkottai", "Melapalayam"], "Tenkasi": ["Tenkasi Urban", "Courtallam"] },
    "Erode": { "Erode": ["Perundurai", "Bhavani"], "Sathyamangalam": ["Sathy Urban", "Bannari"] }
  },
  "Uttar Pradesh": {
    "Lucknow": { "Sarojini Nagar": ["Amausi", "Banthra"], "Bakshi Ka Talab": ["BKT Rural", "Itaunja"] },
    "Kanpur Nagar": { "Kanpur": ["Panki", "Jajmau"], "Ghatampur": ["Ghatampur Rural", "Sajeti"] },
    "Varanasi": { "Varanasi": ["Sarnath", "Shivpur"], "Pindra": ["Phoolpur", "Pindra Rural"] },
    "Agra": { "Agra": ["Tajganj", "Sikandra"], "Fatehabad": ["Fatehabad Rural", "Fatehpur Sikri"] },
    "Gautam Buddha Nagar (Noida)": { "Noida": ["Sector 62", "Greater Noida"], "Dadri": ["Surajpur", "Dadri Rural"] },
    "Ghaziabad": { "Ghaziabad": ["Indirapuram", "Raj Nagar"], "Modinagar": ["Modinagar Urban", "Muradnagar"] },
    "Prayagraj (Allahabad)": { "Prayagraj": ["Civil Lines", "Naini"], "Phulpur": ["Phulpur Urban", "Jhunsi"] },
    "Gorakhpur": { "Gorakhpur": ["Gorakhpur Urban", "Bargadwa"], "Sahjanwa": ["Gida", "Sahjanwa Rural"] }
  },
  "Madhya Pradesh": {
    "Indore": { "Indore": ["Vijay Nagar", "Palasia"], "Sanwer": ["Sanwer Rural", "Manglia"] },
    "Bhopal": { "Huzur": ["Bairagarh", "Kolar"], "Berasia": ["Berasia Rural", "Dungariya"] },
    "Gwalior": { "Gwalior": ["Lashkar", "Morar"], "Dabra": ["Dabra Urban", "Bhitarwar"] },
    "Jabalpur": { "Jabalpur": ["Civil Lines", "Vijay Nagar"], "Patan": ["Patan Rural", "Shahpura"] },
    "Ujjain": { "Ujjain": ["Freeganj", "Nagnath"], "Nagda": ["Nagda Urban", "Unhel"] }
  },
  "West Bengal": {
    "Kolkata": { "Kolkata": ["Salt Lake", "New Town"], "Alipore": ["Bhitari", "Chetla"] },
    "Howrah": { "Howrah": ["Bally", "Shibpur"], "Uluberia": ["Uluberia Rural", "Bauri"] },
    "North 24 Parganas": { "Barasat": ["Madhyamgram", "Haroa"], "Barrackpore": ["Kanchrapara", "Naihati"] },
    "South 24 Parganas": { "Baruipur": ["Sonarpur", "Bangar"], "Diamond Harbour": ["Falta", "Kakir"] },
    "Darjeeling": { "Darjeeling": ["Kurseong", "Mirik"], "Siliguri": ["Matigara", "Bhaktinagar"] }
  },
  "Telangana": {
    "Hyderabad": { "Charminar": ["Faluknuma", "Bahadurpura"], "Khairatabad": ["Banjara Hills", "Jubilee Hills"] },
    "Medchal-Malkajgiri": { "Malkajgiri": ["Secunderabad", "Alwal"], "Kukatpally": ["KPHB", "Bachupally"] },
    "Warangal": { "Warangal Urban": ["Hanamkonda", "Kazipet"], "Warangal Rural": ["Narsampet", "Wardhannapet"] },
    "Nizamabad": { "Nizamabad": ["Nizamabad Urban", "Armoor"], "Bodhan": ["Bodhan Urban", "Ranjal"] }
  },
  "Punjab": {
    "Ludhiana": { "Ludhiana East": ["Focal Point", "Sahnewal"], "Ludhiana West": ["Model Town", "Sarabha Nagar"] },
    "Amritsar": { "Amritsar I": ["Chheharta", "Verka"], "Amritsar II": ["Jandiala", "Rayya"] },
    "Jalandhar": { "Jalandhar I": ["Model Town", "Cantonment"], "Jalandhar II": ["Adampur", "Kartarpur"] },
    "Patiala": { "Patiala": ["Patiala Urban", "Urban Estate"], "Rajpura": ["Rajpura Urban", "Ghanaur"] }
  },
  "Kerala": {
    "Ernakulam": { "Kochi": ["Kakkanad", "Edappally"], "Aluva": ["Angamaly", "Perumbavoor"] },
    "Thiruvananthapuram": { "Trivandrum": ["Kazhakkoottam", "Kowdiar"], "Neyyattinkara": ["Balaramapuram", "Parassala"] },
    "Kozhikode": { "Kozhikode": ["Kozhikode Urban", "Feroke"], "Vadakara": ["Vadakara Urban", "Orkkatteri"] }
  },
  "Bihar": {
    "Patna": { "Patna": ["Boring Road", "Danapur"], "Phulwari": ["Phulwari Sharif", "Bihta"] },
    "Gaya": { "Gaya": ["Gaya Urban", "Bodh Gaya"], "Sherghati": ["Sherghati Urban", "Dobhi"] },
    "Muzaffarpur": { "Muzaffarpur": ["Muzaffarpur Urban", "Kanti"], "Motipur": ["Motipur Urban", "Baruraj"] }
  },
  "Delhi": {
    "Central Delhi": { "Civil Lines": ["Daryaganj", "Paharganj"] },
    "South Delhi": { "Hauz Khas": ["Saket", "Greater Kailash"], "Defence Colony": ["Lajpat Nagar", "R K Puram"] },
    "North West Delhi": { "Rohini": ["Pitampura", "Shalimar Bagh"], "Model Town": ["Kashmere Gate", "Timarpur"] }
  }
};

// Merge data.json if available
if (fs.existsSync(dataJsonPath)) {
  console.log('Merging data/data.json records into locations base...');
  try {
    const rawData = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
    for (const item of rawData) {
      const state = item['State Name (In English)']?.trim();
      const district = item['District Name (In English)']?.trim();
      const subDistrict = item['Sub-District Name (In English)']?.trim();
      const village = item['Village Name (In English)']?.trim();

      if (!state || !district || !subDistrict || !village) continue;

      if (!baseLocations[state]) baseLocations[state] = {};
      if (!baseLocations[state][district]) baseLocations[state][district] = {};
      if (!baseLocations[state][district][subDistrict]) baseLocations[state][district][subDistrict] = [];

      if (!baseLocations[state][district][subDistrict].includes(village)) {
        baseLocations[state][district][subDistrict].push(village);
      }
    }
  } catch (err) {
    console.error('Error reading data/data.json:', err);
  }
}

const fileContent = `export const indianLocations: Record<string, Record<string, Record<string, string[]>>> = ${JSON.stringify(baseLocations, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Successfully generated full dataset at ${outputPath}`);
