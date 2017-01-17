var utterances = ["yes_terrible","yes_bad","yes_okay","yes_good","yes_amazing",
                  "not_terrible","not_bad","not_okay","not_good","not_amazing"
                  //                  ,"nullUtt"
                  ];

var cost = {
  "not_amazing": 2,
  "not_bad": 2,
  "not_good": 2,
  "not_okay": 2,
  "not_terrible": 2,
  "yes_amazing": 1,
  "yes_bad": 1,
  "yes_good": 1,
  "yes_okay": 1,
  "yes_terrible": 1,
  //  "nullUtt":0
};

var states = [1,2,3,4,5];
var statePrior = function(){
  return uniformDraw(states);
};

var utterancePrior = function(){
  //  return uniformDraw(utterances)
  return utterances[discrete(map(function(u) {return Math.exp(-cost[u]);}, utterances))];
};

// model parameters
var alpha = 1.25;
var speakerOptimality = 10;

// measured in Experiment 1
var literalSemantics = dataFromR.literalSemantics;

var honestyWeights = [1,1,1,1,1]
var kindnessWeights = [1,1,1,1,1]

var meaning = function(words, state){
  return flip(literalSemantics[words][state-1]);
}; 

var listener0 = cache(function(utterance) {
  Infer({method: "enumerate"}, function(){
    var state = statePrior();
    var m = meaning(utterance, state);
    condition(m);
    return state;
  });
}, 10);


//var speaker1 = cache(function(state, speakerGoals, rsaParameters) {
  
var speaker1 = cache(function(state, speakerGoals) {
  Infer({method: "enumerate"}, function(){
    var utterance = utterancePrior();
    
    var L0 = listener0(utterance);
    
    var epistemicUtility = L0.score(state);
    var socialUtility = expectation(L0, function(s){return alpha*s});
    
    var eUtility = speakerGoals.honesty*epistemicUtility;
    var sUtility = speakerGoals.kindness*socialUtility;

    var speakerUtility = eUtility+sUtility;

    factor(speakerOptimality*speakerUtility);
    
    return utterance;
  })
}, 10)

var listener1 = cache(function(utterance, rsaParameters) {
  Infer({method: "enumerate"}, function(){
    var speakerGoals = {
      honesty: [0.1, 0.3, 0.5, 0.7, 0.9][discrete(honestyWeights)],
      kindness: [0.1, 0.3, 0.5, 0.7, 0.9][discrete(kindnessWeights)]
    }
    
    var state = statePrior()
    
    var S1 = speaker1(state, speakerGoals, rsaParameters)
    
    observe(S1, utterance)
    
    return {
      state: state,
      goals: speakerGoals
    }
      })
}, 10)

var speaker2 = cache(function(state, intendedGoals, rsaParameters) {
  Enumerate(function(){
    
    var utterance = utterancePrior()
    
    var L1 = listener1(utterance, rsaParameters)
    
    factor(L1.score({"state":state, "goals":intendedGoals}))
    
    return utterance
    
  })
}, 10)
