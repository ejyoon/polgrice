var states = [1,2,3,4,5]
var weightBins = [0.1,0.3,0.5,0.7,0.9]

var utterances = ["yes_terrible","yes_bad","yes_okay","yes_good","yes_amazing",
                  "not_terrible","not_bad","not_okay","not_good","not_amazing"
                  //                  ,"nullUtt"
                  ]

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

var statePrior = function(){
  return uniformDraw(states)
}

var utterancePrior = function(){
  //  return uniformDraw(utterances)
  return utterances[discrete(map(function(u) {return Math.exp(-cost[u]);}, utterances))];
}

// model parameters
var alpha = 1.25
var speakerOptimality = 10

// measured in Experiment 1
var literalSemanticsFromR = dataFromR.literalSemantics

var literalSemanticsNoNull = _.object(map(function(lst){
  [lst.utterance, [lst[1], lst[2], lst[3], lst[4], lst[5]] ]
}, literalSemanticsFromR))


var literalSemantics = literalSemanticsNoNull
// to include null utterance
// var literalSemantics = _.extend(literalSemanticsNoNull,
                                   //                            {nullUtt: [1, 1, 1, 1, 1]})

display(literalSemantics)

var meaning = function(words, state){
  return flip(literalSemantics[words][state-1])
} 

var listener0 = cache(function(utterance) {
  Infer({method: "enumerate"}, function(){
    var state = statePrior()
    var m = meaning(utterance, state)
    condition(m)
    return state
  })
})

var speaker1 = cache(function(state, speakerGoals) {
  Infer({method: "enumerate"}, function(){
    var utterance = utterancePrior()
    
    var L0 = listener0(utterance)
    
    var epistemicUtility = L0.score(state)
    var socialUtility = expectation(L0, function(s){return alpha*s})
    
    var eUtility = speakerGoals.honesty*epistemicUtility 
    var sUtility = speakerGoals.kindness*socialUtility
    
    var speakerUtility = eUtility+sUtility
    
    factor(speakerOptimality*speakerUtility)
    
    return utterance
  })
})

var listener1 = function(exptCondition) {
  Infer({method: "enumerate"}, function(){
    
    var utterance = exptCondition["utterance"][0]
    var trueState = exptCondition["state"][0]
    var knownGoalsWeights = exptCondition.goalWeights
    
    var state = statePrior()
    
    // Expt 2. goal weights are known (e.g. "speaker is trying to be nice")
    var speakerGoals = knownGoalsWeights ?
    {
      honesty: knownGoalsWeights["honesty"][0],
      kindness: knownGoalsWeights["kindness"][0]
    } : 
    {
      honesty: uniformDraw(weightBins),
      kindness: uniformDraw(weightBins)
    }
    
    // Expt 3. trueState is known.
    condition(trueState ? trueState == state : true)
    
    var S1 = speaker1(state, speakerGoals)
    
    observe(S1, utterance)
    
    return {
      state: state,
      goals: speakerGoals
    }
  })
}
// listener1(dataFromR.exptCond)
var expectations_nice = {
  "yes_terrible": listener1(dataFromR.exptCond1),
  "yes_bad": listener1(dataFromR.exptCond2),
  "yes_okay": listener1(dataFromR.exptCond3),
  "yes_good": listener1(dataFromR.exptCond4),
  "yes_amazing": listener1(dataFromR.exptCond5),
  "not_terrible": listener1(dataFromR.exptCond16),
  "not_bad": listener1(dataFromR.exptCond17),
  "not_okay": listener1(dataFromR.exptCond18),
  "not_good": listener1(dataFromR.exptCond19),
  "not_amazing": listener1(dataFromR.exptCond20),
}
var expectations_mean = {
  "yes_terrible": listener1(dataFromR.exptCond6),
  "yes_bad": listener1(dataFromR.exptCond7),
  "yes_okay": listener1(dataFromR.exptCond8),
  "yes_good": listener1(dataFromR.exptCond9),
  "yes_amazing": listener1(dataFromR.exptCond10),
  "not_terrible": listener1(dataFromR.exptCond21),
  "not_bad": listener1(dataFromR.exptCond22),
  "not_okay": listener1(dataFromR.exptCond23),
  "not_good": listener1(dataFromR.exptCond24),
  "not_amazing": listener1(dataFromR.exptCond25),
  
}
var expectations_honest = {
  "yes_terrible": listener1(dataFromR.exptCond11),
  "yes_bad": listener1(dataFromR.exptCond12),
  "yes_okay": listener1(dataFromR.exptCond13),
  "yes_good": listener1(dataFromR.exptCond14),
  "yes_amazing": listener1(dataFromR.exptCond15),
  "not_terrible": listener1(dataFromR.exptCond26),
  "not_bad": listener1(dataFromR.exptCond27),
  "not_okay": listener1(dataFromR.exptCond28),
  "not_good": listener1(dataFromR.exptCond29),
  "not_amazing": listener1(dataFromR.exptCond30),
  
}
var expectations = {
  "honest": expectations_honest,
  "nice": expectations_nice, 
  "mean": expectations_mean
}
expectations
//print(literalSemanticsNoNull)
