const fs = require("fs")

const obj = JSON.parse(fs.readFileSync('./data.json', 'utf8'))

let newArray = [];

newArray = obj["results"].map(el => {
    let newObj = {};
    newObj.gender = el.gender
    newObj.email = el.email
    return newObj
})

// console.log(obj["results"])

const languageList = ["English","French","German","English","Japanese","Chinese","Russian","Portuguese","English","English"];
const countryList = ["United Kingdom", "France", "Germany", "United States", "Japan", "China", "Russia", "Brazil","Australia","Canada"]
const summaryList = [
    "I like to make friends from other countries and cultures. I am friendly and open minded, enjoy traveling, hiking, dancing, watching movies/ series. More about me will surface as we get to know each other :)",
    "Looking for new friends to communicate. I want to learn English. Perhaps I will learn another foreign language. Write me, we will get acquainted.",
    "Adventurous and passionate person who enjoys meeting new people and learning about other cultures. I live for rainy days, long walks on the beach and beautiful sunsets.",
    "We drank tea with taste of leaves, Cried together with the pouring rain. Oh, Autumn - you are a joy to my soul! Rich in soul, who is born in the fall ... ?Larisa Alekseevna Rubalskaya?",
    "I would like to practice common English conversations. Maybe to learn something new from other languages I was/I'm interested in. Polish in particular as I'm thinking about moving to Warsaw to work.",
    "I enjoy finding new friends. I believe you can learn from other people just by simply having a conversation. We all have a story to tell, be courage and tell your story to the world",
    "I'm a pretty nice guy so don't be afraid to send a message.:) I am a future electrophysiologist. During my free time I watch stuff, play games, glean knowledge from many sources,listen to music",
    "I will probably be too shy to message you. I am a teacher. I'm an introvert that forces myself to be extroverted. My favorite holiday is Christmas. ",
    "Well, I'm a fun and funny, happy, busy, and active guy...just looking for some new friends with similar and different interests. I'm into more things than I have time for, and, unfortunately, most keep me around the house...gardening, cooking, working out",
    "I am polite and courteous.  If I looked at your profile and didn't send you a message it's either because I'm too shy or your profile is closed to older men of my age.  I understand and I don't take it personally."
]
const hobbyList = ["Playing golf","Learing languages","Playing video game", "Cooking","Yoga","Football","Music","Watching TV","Painting","Work out"];


const convertCountryName = (country) => {
    if (isoCountries.hasOwnProperty(country)) {
        return isoCountries[country];
    } else {
        return country;
    }
} 
let password;


newArray.forEach( (el,i) => {
    if(el.gender === "male"){
        el.gender = "Male"
    }else {
        el.gender = "Female"
    }
    el.name = obj["results"][i].login.username;
    el.birth = parseInt(obj["results"][i].dob.date.split("T")[0].split("-").join(""));
    el.photo = el.gender === "Male" ? `man${Math.floor(Math.random()*30)+1}.jpg` : `female${Math.floor(Math.random()*30)+1}.jpg`
    // el.photo = obj["results"][i].picture.large;
    el.role = "user"
    el.active = true
    el.hobby = hobbyList[Math.floor(Math.random()*10)]
    el.learning = languageList[Math.floor(Math.random()*10)]
    const num = Math.floor(Math.random()*10)
    el.native = languageList[num]
    el.country = countryList[num];
    el.summary = summaryList[Math.floor(Math.random()*10)]
    el.password = "$2a$12$T/5ynwftbk9KU4o925kKF.A4UZb63ttp1TAkNiCV2wVSMiUJ80lpq";
    delete el.nat
})



fs.writeFileSync('./parseddata.json', JSON.stringify(newArray))






