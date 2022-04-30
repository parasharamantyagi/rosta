


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

function total_sum(competitionData, partyData) {
  let sum_val = parseFloat(sumOfArray(competitionParty(competitionData.competetion, partyData))) +
      parseFloat(dateDifference(competitionData.competetion.date) * 2) + parseFloat(competitionData.referral_code.length) + parseFloat(dateDifference(competitionData.competetion.date))/100;
  return parseFloat(sum_val).toFixed(2);;
}

function competitionCalculation(competitionDatas,partyData) {
  let resCompetition = [];
  for(let competitionData of competitionDatas){
    competitionData = competitionData.toObject();
    competitionData.point = total_sum(competitionData, partyData);
    resCompetition.push(competitionData);
  }
  return resCompetition;
};


module.exports = {
  competitionCalculation: competitionCalculation,
};