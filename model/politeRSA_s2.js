
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

var honestyWeights = [1,1,1,1,1]
// var kindnessWeights = [1,1,1,1,1,1,1,1,1,1]
var kindnessWeights = [1,1,1,1,1]


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

var listener1 = function(utterance) {
  Infer({method: "enumerate"}, function(){
      var speakerGoals = {
      honesty: [0.1, 0.3, 0.5, 0.7, 0.9][discrete(honestyWeights)],
//      kindness: [-0.9,-0.7,-0.5,-0.3,-0.1,0.1, 0.3, 0.5, 0.7, 0.9][discrete(kindnessWeights)]
      kindness: [0.1, 0.3, 0.5, 0.7, 0.9][discrete(kindnessWeights)]
      }
    
    var state = statePrior()
    
    var S1 = speaker1(state, speakerGoals)
    
    observe(S1, utterance)
    
    return {
      state: state,
      goals: speakerGoals
    }
  })
}

// listener1("terrible")

var speaker2 = function(state, intendedGoals) {
  Enumerate(function(){

    var utterance = utterancePrior()

    var L1 = listener1(utterance)

    factor(L1.score({"state":state, "goals":intendedGoals}))

    return utterance

  })
}

// speaker2(3, {honesty:0.9, kindness: 0.9})

// var expectations = {
//  "heart1": speaker2(1, {honesty:0.9, kindness: 0.9}),
//  "heart2": speaker2(2, {honesty:0.9, kindness: 0.9}),
//  "heart3": speaker2(3, {honesty:0.9, kindness: 0.9}),
//  "heart4": speaker2(4, {honesty:0.9, kindness: 0.9}),
//  "heart5": speaker2(5, {honesty:0.9, kindness: 0.9})
// }

//var expectations_nicehonest = {
//  "heart1": speaker1(1, {honesty:0.9, kindness: 0.9}),
//  "heart2": speaker1(2, {honesty:0.9, kindness: 0.9}),
//  "heart3": speaker1(3, {honesty:0.9, kindness: 0.9}),
//  "heart4": speaker1(4, {honesty:0.9, kindness: 0.9}),
//  "heart5": speaker1(5, {honesty:0.9, kindness: 0.9})
//}

//var expectations_honest = {
//  "heart1": speaker1(1, {honesty:0.9, kindness: 0.2}),
//  "heart2": speaker1(2, {honesty:0.9, kindness: 0.2}),
//  "heart3": speaker1(3, {honesty:0.9, kindness: 0.2}),
//  "heart4": speaker1(4, {honesty:0.9, kindness: 0.2}),
//  "heart5": speaker1(5, {honesty:0.9, kindness: 0.2})
//}

//var expectations_nice = {
//  "heart1": speaker1(1, {honesty:0.2, kindness: 0.9}),
//  "heart2": speaker1(2, {honesty:0.2, kindness: 0.9}),
//  "heart3": speaker1(3, {honesty:0.2, kindness: 0.9}),
//  "heart4": speaker1(4, {honesty:0.2, kindness: 0.9}),
//  "heart5": speaker1(5, {honesty:0.2, kindness: 0.9})
//}

var expectations_s1 = {
  "heart1": speaker1(1, {honesty:0.9, kindness: 0.9}),
  "heart2": speaker1(2, {honesty:0.9, kindness: 0.9}),
  "heart3": speaker1(3, {honesty:0.9, kindness: 0.9}),
  "heart4": speaker1(4, {honesty:0.9, kindness: 0.9}),
  "heart5": speaker1(5, {honesty:0.9, kindness: 0.9})
}

var expectations_s2 = {
  "heart1": speaker2(1, {honesty:0.9, kindness: 0.9}),
  "heart2": speaker2(2, {honesty:0.9, kindness: 0.9}),
  "heart3": speaker2(3, {honesty:0.9, kindness: 0.9}),
  "heart4": speaker2(4, {honesty:0.9, kindness: 0.9}),
  "heart5": speaker2(5, {honesty:0.9, kindness: 0.9})
}

var expectations = {
  "s1": expectations_s1,
  "s2": expectations_s2 
}

//var expectations = {
//  "nicehonest": expectations_nicehonest,
//  "honest": expectations_honest, 
//  "nice": expectations_nice 
//}

expectations
//print(literalSemanticsNoNull)
