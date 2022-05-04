const { check_array_length, check_obj } = require("../halpers/halper");

let competition_point = 10000;
let joined_point = 30;
let premium_point = 30;

function findPoitCal(partyData,party_id = null) {
  if (party_id){
    party_id = party_id.toString();
    var index = partyData.findIndex(function (party) {
      return party._id == party_id;
    });
    return partyData[index].vote_percentage;
  }else{
    return "0";
  }
}

const calPartycompetetionVoting = (competetionpercentage,partypercentage) => {
  let val1 = parseFloat(partypercentage.replace(',', '.'));
  let val2 = parseFloat(competetionpercentage.replace(',', '.'));
  return Math.abs(val1 - val2);
}


function competitionParty(competetions, partyData) {
  return competetions.competetionData.map(function (competion) {
    return calPartycompetetionVoting(findPoitCal(partyData, competion.party_id),competion.percentage_value);
  });
};

function sumOfArray(input){
  let intValue = input.reduce((a, b) => a + b, 0);
  return parseFloat(intValue).toFixed(2);
}

function dateDifference(input){
    if(input){
      let date1 = new Date(input);
      let date2 = new Date();
      var diffDays = date2.getDate() - date1.getDate();
      return diffDays;
    }else{
      return 0;
    }
}

function total_sum(competitionData, partyData , user_data) {
  let minutes_point = parseFloat(sumOfArray(competitionParty(competitionData, partyData)));
  let point_per_day = parseFloat(dateDifference(user_data.date) * 2);
  let cal_uuid_1 = (joined_point + (user_data.is_premium * premium_point)) * (parseFloat(dateDifference(user_data.date))/100);
  let cal_uuid_2 = (joined_point + (user_data.is_premium * premium_point)) * (parseFloat(dateDifference(user_data.date))/100);
  let plus_point = competition_point + point_per_day + cal_uuid_1 + cal_uuid_2;
  let final_point = plus_point - minutes_point;
  return parseFloat(final_point).toFixed(2);
}

function competitionCalculation(competitionDatas,partyData) {
  let resCompetition = [];
  for(let competition_Data of competitionDatas){
    if (check_array_length(competition_Data.competetion)) {
      for (let competitionData of competition_Data.competetion) {
        competitionData = competitionData.toObject();
        competitionData.point = total_sum(competitionData, partyData ,competition_Data);
        resCompetition.push(competitionData);
      }
    }
  }
  return resCompetition;
};


module.exports = {
  competitionCalculation: competitionCalculation,
};