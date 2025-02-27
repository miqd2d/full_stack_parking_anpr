import React, { useState } from 'react';
import './RegisterScreen_style.css';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';

function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '',
        l_name: '',
        DOB: '',
        nationality: '',
        username: '',
        password: '',
        plate_num: '',
        license_num: '',
        email: '',
        pho_num: '',
        country: '',
        state: '',
        city: '',
        countryCode: '',
    });

    const countries = [
        "India",
        "United States",
        "China",
        "Indonesia",
        "Pakistan",
        "Nigeria",
        "Bangladesh",
        "Russia",
        "Mexico",
        "Japan",
        "Brazil",
        "Ethiopia",
        "Philippines",
        "Egypt",
        "Vietnam",
        "DR Congo",
        "Germany",
        "Iran",
        "Turkey",
        "France",
        "United Kingdom",
        "Italy",
        "Tanzania",
        "Myanmar",
        "South Africa",
        "Kenya",
        "Colombia",
        "Argentina",
        "Uganda",
        "Algeria",
        "Sudan",
        "South Korea",
        "Canada",
        "Poland",
        "Ukraine",
        "Morocco",
        "Kuwait",
        "Saudi Arabia",
        "Peru",
        "Afghanistan",
        "Malaysia",
        "Mozambique",
        "Yemen",
        "Nepal",
        "Ghana",
        "Angola",
        "Madagascar",
        "Cameroon",
        "Niger",
        "Venezuela"
    ];  // Placeholder for top 100 countries list

    const states = {
        "India": ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh","Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
        "China": ["Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hong Kong", "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Macau", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanxi", "Shanghai", "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"],
        "Indonesia": ["Aceh", "Bali", "Banten", "Bengkulu", "Gorontalo", "Jakarta", "Jambi", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung", "Kepulauan Riau", "Maluku", "Maluku Utara", "Nanggroe Aceh Darussalam", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan", "Sumatera Utara", "Yogyakarta"],
        "Pakistan": ["Balochistan", "Gilgit-Baltistan", "Khyber Pakhtunkhwa", "Punjab", "Sindh"],
        "Kuwait": ["Kuwait City"],
        "Nigeria": ["Lagos", "Kano", "Abuja"],
        "Bangladesh": ["Dhaka", "Chittagong", "Khulna"],
        "Russia": ["Moscow", "Saint Petersburg", "Novosibirsk"],
        "Mexico": ["Mexico City", "Guadalajara", "Monterrey"],
        "Japan": ["Tokyo", "Yokohama", "Osaka"],
        "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília"],
        "Ethiopia": ["Addis Ababa", "Oromia", "Amhara"],
        "Philippines": ["Metro Manila", "Calabarzon", "Central Luzon"],
        "Egypt": ["Cairo", "Giza", "Alexandria"],
        "Vietnam": ["Hồ Chí Minh City", "Hanoi", "Hai Phòng"],
        "DR Congo": ["Kinshasa", "Katanga", "Kasai"],
        "Germany": ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg"],
        "Iran": ["Tehran", "Mazandaran", "Isfahan"],
        "Turkey": ["Istanbul", "Ankara", "Izmir"],
        "France": ["Île-de-France", "Occitanie", "Hauts-de-France"],
        "United Kingdom": ["England", "Scotland", "Wales"],
        "Italy": ["Lombardy", "Sicily", "Campania"],
        "Tanzania": ["Dar es Salaam", "Mwanza", "Arusha"],
        "Myanmar": ["Yangon", "Mandalay", "Shan State"],
        "South Africa": ["Gauteng", "KwaZulu-Natal", "Western Cape"],
        "Kenya": ["Nairobi", "Mombasa", "Kiambu"],
        "Colombia": ["Bogotá", "Antioquia", "Valle del Cauca"],
        "Argentina": ["Buenos Aires", "Córdoba", "Santa Fe"],
        "Uganda": ["Central", "Kampala", "Wakiso"],
        "Algeria": ["Algiers", "Oran", "Constantine"],
        "Sudan": ["Khartoum", "North Darfur", "South Darfur"],
        "South Korea": ["Seoul", "Gyeonggi-do", "Busan"],
        "Canada": ["Ontario", "Quebec", "British Columbia"],
        "Poland": ["Masovia", "Greater Poland", "Silesia"],
        "Ukraine": ["Kyiv", "Dnipropetrovsk Oblast", "Odessa Oblast"],
        "Morocco": ["Rabat-Salé-Kénitra", "Casablanca-Settat", "Fès-Meknès"],
        "Saudi Arabia": ["Riyadh", "Makkah Region", "Eastern Province"],
        "Peru": ["Lima", "Callao", "Arequipa"],
        "Afghanistan": ["Kabul", "Kandahar", "Herat"],
        "Malaysia": ["Selangor", "Johor", "Sarawak"],
        "Mozambique": ["Maputo City", "Maputo Province", "Zambezia Province"],
        "Yemen": ["Sana'a", "Aden", "Ta'izz"],
        "Nepal": ["Bagmati", "Province No. 1", "Province No. 2"],
        "Ghana": ["Greater Accra", "Ashanti", "Eastern"],
        "Angola": ["Luanda", "Huila", "Benguela"],
        "Madagascar": ["Antananarivo", "Antsiranana", "Toamasina"],
        "Cameroon": ["Centre", "Littoral", "Ouest"],
        "Niger": ["Niamey", "Dosso", "Tillabéri"],
        "Venezuela": ["Distrito Capital", "Miranda", "Zulia"]
    };

    const cities = {
        "Andhra Pradesh": ["Amaravati", "Visakhapatnam", "Vijayawada"],
        "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
        "Assam": ["Guwahati", "Dispur", "Silchar"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur"],
        "Chhattisgarh": ["Raipur", "Bilaspur", "Durg"],
        "Delhi" : ["Delhi","Lajpat Nagar", "Cannaught Place", "Rajiv nagar", "Firozabad"],
        "Goa": ["Panaji", "Vasco da Gama", "Margao"],
        "Gujarat": ["Gandhinagar", "Ahmedabad", "Surat"],
        "Haryana": ["Chandigarh", "Faridabad", "Gurgaon"],
        "Himachal Pradesh": ["Shimla", "Manali", "Dharamsala"],
        "Jammu and Kashmir": ["Srinagar", "Jammu", "Leh"],
        "Jharkhand": ["Ranchi", "Dhanbad", "Jamshedpur"],
        "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
        "Kerala": ["Thiruvananthapuram", "Kochi, Kozhikode"],
        "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Manipur": ["Imphal", "Churachandpur", "Thoubal"],
        "Meghalaya": ["Shillong", "Tura, Jowai"],
        "Mizoram": ["Aizawl", "Lunglei, Aizawl"],
        "Nagaland": ["Kohima", "Dimapur, Mokokchung"],
        "Odisha": ["Bhubaneswar", "Cuttack, Puri"],
        "Punjab": ["Chandigarh", "Ludhiana, Amritsar"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Tonk"],
        "Sikkim": ["Gangtok", "Pelling, Namchi"],
        "Tamil Nadu": ["Chennai", "Coimbatore, Madurai"],
        "Telangana": ["Hyderabad", "Warangal, Nizamabad"],
        "Tripura": ["Agartala", "Durgapur, Udaipur"],
        "Uttar Pradesh": ["Lucknow", "Kanpur, Agra"],
        "Uttarakhand": ["Dehradun", "Haridwar, Rishikesh"],
        "West Bengal": ["Kolkata", "Howrah, Siliguri"],
        "Kuwait City": ["Kuwait City"]
    };

    // This function dynamically sets the options for state and city

    const renderCityOptions = () => {
        if (formData.country === "India" && formData.state) {
            return (cities[formData.state] || []).map((city, index) => (
                <option key={index} value={city}>{city}</option>
            ));
        } else {
            // For countries other than India, show city as country
            return <option value={formData.state}>{formData.state}</option>;
        }
    };

    const countryCodes = {
        "India": "+91",
        "Argentina": "+54",
        "Bolivia": "+591",
        "Brazil": "+55",
        "Chile": "+56",
        "Colombia": "+57",
        "Ecuador": "+593",
        "Guyana": "+592",
        "Paraguay": "+595",
        "Peru": "+51",
        "Suriname": "+597",
        "Uruguay": "+598",
        "Venezuela": "+58",
        "United States": "+1",
        "Canada": "+1",
        "Carribean" : "+1",
        "Mexico": "+52",
        "Belize": "+501",
        "Costa Rica": "+506",
        "Cuba": "+53",
        "El Salvador": "+503",
        "Guatemala": "+502",
        "Haiti": "+509",
        "Honduras": "+504",
        "Nicaragua": "+505",
        "Panama": "+507",
        "Algeria": "+213",
        "Angola": "+244",
        "Benin": "+229",
        "Botswana": "+267",
        "Burkina Faso": "+226",
        "Burundi": "+257",
        "Cameroon": "+237",
        "Cape Verde": "+238",
        "Central African Republic": "+236",
        "Chad": "+235",
        "Comoros": "+269",
        "Congo, Democratic Republic of the": "+243",
        "Congo, Republic of the": "+242",
        "Côte d'Ivoire": "+225",
        "Djibouti": "+253",
        "Egypt": "+20",
        "Equatorial Guinea": "+240",
        "Eritrea": "+291",
        "Eswatini": "+268",
        "Ethiopia": "+251",
        "Gabon": "+241",
        "Gambia": "+220",
        "Ghana": "+233",
        "Guinea": "+224",
        "Guinea-Bissau": "+245",
        "Kenya": "+254",
        "Lesotho": "+266",
        "Liberia": "+231",
        "Libya": "+218",
        "Madagascar": "+261",
        "Malawi": "+265",
        "Mali": "+223",
        "Mauritania": "+222",
        "Mauritius": "+230",
        "Morocco": "+212",
        "Mozambique": "+258",
        "Namibia": "+264",
        "Niger": "+227",
        "Nigeria": "+234",
        "Rwanda": "+250",
        "São Tomé and Príncipe": "+239",
        "Senegal": "+221",
        "Seychelles": "+248",
        "Sierra Leone": "+232",
        "Somalia": "+252",
        "South Africa": "+27",
        "South Sudan": "+211",
        "Sudan": "+249",
        "Tanzania": "+255",
        "Togo": "+228",
        "Tunisia": "+216",
        "Uganda": "+256",
        "Zambia": "+260",
        "Zimbabwe": "+263",
        "Australia": "+61",
        "Afghanistan": "+93",
        "Armenia": "+374",
        "Azerbaijan": "+994",
        "Bahrain": "+973",
        "Bangladesh": "+880",
        "Bhutan": "+975",
        "Brunei": "+673",
        "Cambodia": "+855",
        "China": "+86",
        "East Timor": "+670",
        "Georgia": "+995",
        "Indonesia": "+62",
        "Iran": "+98",
        "Iraq": "+964",
        "Israel": "+972",
        "Japan": "+81",
        "Jordan": "+962",
        "Kazakhstan": "+7",
        "Kuwait": "+965",
        "Kyrgyzstan": "+996",
        "Laos": "+856",
        "Lebanon": "+961",
        "Malaysia": "+60",
        "Maldives": "+960",
        "Mongolia": "+976",
        "Myanmar": "+95",
        "Nepal": "+977",
        "North Korea": "+850",
        "Oman": "+968",
        "Pakistan": "+92",
        "Philippines": "+63",
        "Qatar": "+974",
        "Saudi Arabia": "+966",
        "Singapore": "+65",
        "South Korea": "+82",
        "Sri Lanka": "+94",
        "Syria": "+963",
        "Taiwan": "+886",
        "Tajikistan": "+992",
        "Thailand": "+66",
        "Turkey": "+90",
        "Turkmenistan": "+993",
        "United Arab Emirates": "+971",
        "Uzbekistan": "+998",
        "Vietnam": "+84",
        "Yemen": "+967"
    };

    const [errors, setErrors] = useState({});
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        let valid = true;
    
        // Required field checks
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                valid = false;
                newErrors[key] = "* Field Required";
            }
        });
    
        // Additional validations
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            valid = false;
            newErrors.email = "Enter a valid email address";
        }
        
        if (formData.pho_num && formData.pho_num.length > 15) {
            valid = false;
            newErrors.pho_num = "Mobile number cannot exceed 15 digits";
        }
    
        // Password length validation
        if (formData.password && formData.password.length < 8) {
            valid = false;
            newErrors.password = "Password must be at least 8 characters long";
        }
    
        setErrors(newErrors);
        return valid;
    };
    

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         console.log("Form Submitted Successfully", formData);
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    setModalMessage("Successfully registered!\nRedirecting to Log in....");
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        navigate('/');
                    }, 3000);
                } else if (response.status === 409) {
                    const errorResponse = await response.json();
                    setModalMessage(`Error: ${errorResponse.message}`);
                    setShowModal(true);
                } else {
                    setModalMessage("Username or Plate number already Registered. Please Try with a different one!");
                    setShowModal(true);
                }
            } catch (error) {
                setModalMessage(`Error: ${error.message}`);
                setShowModal(true);
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };
    
    
    const tandcmessage = "Terms & Conditions\n By checking this box, you agree to the following terms and conditions:\n1. Vehicle Information You agree to provide accurate and up-to-date information about your vehicle, including but not limited to its make, model, year, and license plate number.\n2. Personal Information You agree to provide accurate and up-to-date personal information, including but not limited to your name, address, phone number, and email address.\n3. User Agreement You agree to abide by the terms and conditions of the user agreement, which outlines the rights and responsibilities of both you and the application provider.\n4. Data Privacy You understand that your personal information will be processed in accordance with our privacy policy.\n5. Disclaimer The application provider is not responsible for any damages or losses that may arise from the use of the application or the services provided.\n\nPlease review these terms and conditions carefully before proceeding."
    
    return (
        <div className="mainBox">
            {showModal && (
                <Modal
                    message={modalMessage}
                    onClose={closeModal}
                    onConfirm={closeModal}
                />
            )}
            <form onSubmit={handleSubmit} noValidate>
                <h3>Register your Spot!</h3>

                <label htmlFor="name">First Name</label>
                <input type="text" name="name" id="name" placeholder="First Name" value={formData.name} onChange={handleChange} required />
                {errors.name && <div className="error-text">{errors.name}</div>}

                <label htmlFor="l_name">Last Name</label>
                <input type="text" name="l_name" id="l_name" placeholder="Last Name" value={formData.l_name} onChange={handleChange} required />
                {errors.l_name && <div className="error-text">{errors.l_name}</div>}

                <label htmlFor="DOB">Date of Birth</label>
                <input type="date" name="DOB" id="DOB" value={formData.DOB} onChange={handleChange} required />
                {errors.DOB && <div className="error-text">{errors.DOB}</div>}

                <label htmlFor="nationality">Nationality</label>
                <select name="nationality" id="nationality" value={formData.nationality} onChange={handleChange} required>
                    <option value="">Select Nationality</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </select>
                {errors.nationality && <span className="error-text">{errors.nationality}</span>}

                <label htmlFor="username">Preferred Username</label>
                <input type="text" name="username" id="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                {errors.username && <div className="error-text">{errors.username}</div>}

                <label htmlFor="password">Preferred Password</label>
                <input type="password" name="password" id="password" placeholder="Password (min. 8 characters)" value={formData.password} onChange={handleChange} required />
                {errors.password && <div className="error-text">{errors.password}</div>}

                <h4>Vehicle Details</h4>
                <label htmlFor="plate_num">Vehicle Plate Number</label>
                <input type="text" name="plate_num" id="plate_num" placeholder="Plate Number" value={formData.plate_num} onChange={handleChange} required />
                {errors.plate_num && <div className="error-text">{errors.plate_num}</div>}

                <label htmlFor="license_num">License Number</label>
                <input type="text" name="license_num" id="license_num" placeholder="License Number" value={formData.license_num} onChange={handleChange} required />
                {errors.license_num && <div className="error-text">{errors.license_num}</div>}

                <h4>Contact Info</h4>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="error-text">{errors.email}</div>}

                <div className="phone-group">
                    <label htmlFor="countryCode">Country Code</label>
                    <select name="countryCode" id="countryCode" value={formData.countryCode} onChange={handleChange} required>
                        <option value="">Code</option>
                        {Object.entries(countryCodes).map(([country, code], index) => (
                            <option key={index} value={code}>{code}</option>
                        ))}
                    </select>

                    <label htmlFor="pho_num">Mobile Number</label>
                    <input type="number" name="pho_num" id="pho_num" placeholder="Mobile Number" value={formData.pho_num} onChange={handleChange} required />
                    {errors.pho_num && <div className="error-text">{errors.pho_num}</div>}
                </div>

                <h4>Address Info</h4>
                <label htmlFor="country">Country</label>
                <select name="country" id="country" value={formData.country} onChange={handleChange} required>
                    <option value="">Select Country</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country}>{country}</option>
                    ))}
                </select>
                {errors.country && <div className="error-text">{errors.country}</div>}

                <label htmlFor="state">State</label>
                <select name="state" id="state" value={formData.state} onChange={handleChange} required>
                    <option value="">Select State</option>
                    {(states[formData.country] || []).map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
                {errors.state && <span className="error-text">{errors.state}</span>}

                <label htmlFor="city">City</label>
                <select name="city" id="city" value={formData.city} onChange={handleChange} required>
                    <option value="">Select City</option>
                    {renderCityOptions()}
                </select>
                {errors.city && <span className="error-text">{errors.city}</span>}
                
                <div className='register_checkbox'>
                <input type="checkbox" name="terms_cond_check" id="check_terms" required/>
                <label htmlFor="terms_cond_check">*I agree to the <Link onClick={() => {
                    setModalMessage(
                        <div id='terms_message'>
                          {tandcmessage.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                      );
                    setShowModal(true);
                }} to="">terms and conditions</Link> as set out by the user agreement.</label>
                </div>

                <button type="submit">Submit</button>
            </form>
            {/* Modal for displaying error
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                contentLabel="Error Message"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Error</h2>
                <p>{modalMessage}</p>
                <button onClick={() => setShowModal(false)}>Close</button>
            </Modal> */}
        </div>
    );
}

export default RegisterScreen;
