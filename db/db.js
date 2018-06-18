// index.js
module.exports = () => {
  const data = {
    associates: [],
    trainers: [],
    batches: [],
    clients: []
  }
  let trainers = ["Ryan", "Mehrab","Yuvi","William","Peter","Richard","Nick E.","Nick J.","Genesis","Steve",
    "Matt","Wezley","Blake","Mitch","Emily","Carolyn","August"];
  let firstNames = ["John","Alex","Mike","Bob","Alexandro","Jesus","Patrick"];
  let lastNames = ["Smith","Johnson","Williams","Jones","Brown","Miller","Wilson"];
  let totAssociates = firstNames.length*lastNames.length;
  let locations = ["Reston","USF","UTA","WVU","CUNY","Online"];
  let batchNames = ["1801Jan01Java","1802Feb02JTA","1803Mar21Salesforce","1804Apr18PEGA","1805May05Dynamics","1806Jun10BA","1807Jul04SysAdmin"];
  let skills = ["Java","JTA","Salesforce","PEGA","Dynamics","BA","SysAdmin"];
  let dates = [
    {
      start: "01-Jan-2018",
      end: "16-Mar-2018"
    },
    {
      start: "02-Feb-2018",
      end: "18-Apr-2018"
    },
    {
      start: "21-Mar-2018",
      end: "20-May-2018"
    },
    {
      start: "18-Apr-2018",
      end: "15-Jun-2018"
    },
    {
      start: "05-May-2018",
      end: "13-Jul-2018"
    },
    {
      start: "10-Jun-2018",
      end: "15-Aug-2018"
    }
  ]
  let clients = ["InfoSys","Cognizant","Accenture","Deloitte","TechMahindra"];

  // create trainers
  for (let i = 0; i < trainers.length; i++) {
    data.trainers.push({
      id: i+1,
      name: trainers[i]
    })
  }
  // create clients
  for (let i = 0; i < clients.length; i++) {
    data.clients.push({
      id: i+1,
      name: clients[i]
    })
  }
  // Create batches
  for (let i = 0; i < batchNames.length; i++) {
    data.batches.push({
      id: i+1,
      name: batchNames[i],
      location: locations[Math.floor(Math.random()*locations.length)], // random location
      skill: skills[i % batchNames.length],
      trainerName: trainers[i % batchNames.length],
      startDate: dates[i % dates.length].start,
      endDate: dates[i % dates.length].end
    });
  }
  // Create associates
  let date = new Date();
  for (let i = 0; i < totAssociates; i++) {
    data.associates.push({
      selected: false,
      id: i+1,
      firstName: firstNames[i % firstNames.length], // loop through first names first
      lastName: lastNames[Math.floor(i / firstNames.length)], // match every first name to every last name
      absent: Math.random() > 0.5 ? true : false, // randomly assign
      batch: data.batches[i % data.batches.length], // loop through batches
      marketingStartDate: date,
      stagingStartDate: date,
      confirmationDate: date,
      projectStartDate: date,
      stagingEndDate: date,
      numberInterviews: i % 4,
      repanelCount: (i+1) % 5,
      clientName: clients[i % clients.length] // loop through clients
    })
  }
  return data;
}
