// foreach helper function
var foreach = function(fn, lst) {
  var foreach_ = function(i) {
    if (i < lst.length) {
      fn(lst[i]);
      foreach_(i + 1);
    }
  };
  foreach_(0);
};
//
  
  var data = dataFromR.data;
  
  var goals = _.uniq(_.pluck(data, "goal"));
  var states = _.uniq(_.pluck(data, "true_state"));
  // var utterances = _.uniq(_.pluck(data, "utterance"));
  
  var dataAnalysis = function(){
    
    var RSAparameters = {
      speakerOptimality: uniform(0, 20),
      alpha: uniform(0, 5)
    };
    
    var goalWeightsAndPostPred = map(function(goal){
      
      var goalWeights = {
        honesty: uniform(0, 1),
        kindness: uniform(0, 1), // EY: should these be changed to -1 to 1?
        // meanness: uniform(0, 1)
      }
      
      var postPred = map(function(state){
        
        var utteranceData = _.pluck(_.where(data, {true_state: state, goal: goal}), "utterance"); // how to specify utterance with both utterance x utterance_prob from the data?
        
        var exptConditionInfo = {
          state: state, 
          utterance: false,
          goalWeights: goalWeights
        };
        
        var RSApredictions = speaker2(exptConditionInfo, RSAparameters);
        
        var linkedRSA = linkingFunction(RSApredictions);
        
        
        mapData({data: utteranceData}, function(d){ observe(RSApredictions, d) });
        mapData({data: utteranceData}, function(d){ observe(linkedRSA, d) });
        
        var postPred = expectation(RSApredictions)
        
        return {key: "posteriorPredictive", goal: goal, state: state, val: postPred}
        
      }, states)
      
      
      return [postPred, 
              {key: "weightHonest", goal: goal, utt: "NA", val: goalWeights.honesty},
              {key: "weightKind", goal: goal, utt: "NA", val: goalWeights.kindness},
              {key: "weightMean", goal: goal, utt: "NA", val: goalWeights.meanness}
              ]
      
    }, goals)
    
    
    var returnList = _.flatten([goalWeightsAndPostPred, 
                                {key: "speakerOptimality", goal: "NA", utt: "NA", val: RSAparameters.speakerOptimality},
                                {key: "alpha", goal: "NA", utt: "NA", val: RSAparameters.alpha}
                                ])
    
    var returnObj = _.object(map(function(i){
      [i.key + "_" + i.goal + "_" + i.state, i.val]
    }, returnList))
    
    return returnObj
    
  }
  