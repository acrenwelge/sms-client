// index.js
module.exports = () => {
  console.log("============================")
  console.log('Creating resources...');
  var beginningOfProcess = new Date();
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
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  function getDayDiff(first, second) {
    let start = new Date(first);
    let end = new Date(second) || new Date();
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  let today = new Date();
  let todayString = `${today.getMonth()+1}/${today.getDate()}/${today.getFullYear()}`;
  let beginningDate = addDays(today,-30); // begin about month back
  for (let i = 0; i < totAssociates; i++) {
    let dateinterval = (i+1) % 5 + 1; // 5 day max interval
    let date1 = addDays(beginningDate, i); // add i days to beginning date
    let date2 = addDays(date1, dateinterval); // increment by the set interval
    let date3 = Math.random() > 0.5? addDays(date1, dateinterval*2) : null;
    let date4 = addDays(date1, dateinterval*3);
    let date5 = addDays(date1, dateinterval*4);
    let assoc = {
      selected: false,
      id: i+1,
      firstName: firstNames[i % firstNames.length], // loop through first names first
      lastName: lastNames[Math.floor(i / firstNames.length)], // match every first name to every last name
      attendance: null,
      batch: data.batches[i % data.batches.length], // loop through batches
      marketingStartDate: date1, // every associate should start marketing a day later than the previous
      stagingStartDate: date2, // each phase should take dateinterval number of days
      confirmationDate: date3,
      stagingEndDate: date4,
      projectStartDate: date5,
      numberInterviews: i % 4,
      repanelCount: (i+1) % 5,
      clientName: clients[i % clients.length] // loop through clients
    };
    if (Math.random() > 0.5) {
      assoc.stagingEndDate = addDays(assoc.stagingEndDate,1); // randomly extend staging by a day
    }
    if (Math.random() > 0.5) {
      assoc.projectStartDate = addDays(assoc.projectStartDate,1); // randomly extend project start date by a day
    }
    // adding attendance object:
    assoc.attendance = {}; // add 'attendance' property to associate
    let start = new Date(assoc.stagingStartDate);
    let end = new Date(assoc.stagingEndDate);
    let days = getDayDiff(start,end);
    for (let i=0;i<days;i++) { // loop through dates from staging start to end and assign attendance
      let day = addDays(start,i+1); // the day for attendance
      let dateString = `${day.getMonth()+1}/${day.getDate()}/${day.getFullYear()}`; // string representation
      assoc.attendance[dateString] = Math.random() > 0.5 ? true : false; // randomly assign
    }
    data.associates.push(assoc);
  }
  // let first associate be unconfirmed
  data.associates[0].confirmationDate = null;
  data.associates[0].projectStartDate = null;
  data.associates[0].stagingEndDate = null;
  data.associates[0].clientName = null;
  var endOfProcess = new Date();
  var processTime = endOfProcess.getTime() - beginningOfProcess.getTime();
  console.log("Finished!");
  console.log(`Total time: ${processTime} (ms)`);
  console.log("============================")
  return data;
}
