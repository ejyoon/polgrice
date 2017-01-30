
var states = [1,2,3,4,5]
// var weightBins = [0.1,0.3,0.5,0.7,0.9]
var weightBins = [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99]

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
var alpha = 2
var speakerOptimality = 2
var speakerOptimality2 = 1

// measured in Experiment 1
// var literalSemanticsFromR = dataFromR.literalSemantics
//var literalSemanticsFromR = [{"utterance":"not_amazing","1":1,"2":0.92,"3":0.8,"4":0.24,"5":0.04},{"utterance":"not_bad","1":0.01,"2":0.28,"3":0.84,"4":0.88,"5":0.84},{"utterance":"not_good","1":1,"2":0.88,"3":0.16,"4":0.01,"5":0.01},{"utterance":"not_okay","1":0.92,"2":0.76,"3":0.12,"4":0.01,"5":0.12},{"utterance":"not_terrible","1":0.04,"2":0.44,"3":0.96,"4":0.92,"5":0.92},{"utterance":"yes_amazing","1":0.01,"2":0.01,"3":0.04,"4":0.68,"5":1},{"utterance":"yes_bad","1":1,"2":0.96,"3":0.01,"4":0.01,"5":0.01},{"utterance":"yes_good","1":0.01,"2":0.04,"3":0.84,"4":1,"5":1},{"utterance":"yes_okay","1":0.01,"2":0.28,"3":0.96,"4":0ß.76,"5":0.6},{"utterance":"yes_terrible","1":0.96,"2":0.52,"3":0.08,"4":0.01,"5":0.04}]

var literalSemanticsFromR = [{"utterance":"not_amazing","1":1,"2":0.92,"3":0.8,"4":0.24,"5":0.04},{"utterance":"not_bad","1":0.01,"2":0.28,"3":0.84,"4":0.88,"5":0.84},{"utterance":"not_good","1":1,"2":0.88,"3":0.16,"4":0.01,"5":0.01},{"utterance":"not_okay","1":0.92,"2":0.76,"3":0.12,"4":0.01,"5":0.12},{"utterance":"not_terrible","1":0.04,"2":0.44,"3":0.96,"4":0.92,"5":0.92},{"utterance":"yes_amazing","1":0.01,"2":0.01,"3":0.04,"4":0.68,"5":1},{"utterance":"yes_bad","1":1,"2":0.96,"3":0.01,"4":0.01,"5":0.01},{"utterance":"yes_good","1":0.01,"2":0.04,"3":0.84,"4":1,"5":1},{"utterance":"yes_okay","1":0.01,"2":0.28,"3":0.96,"4":0.76,"5":0.6},{"utterance":"yes_terrible","1":0.96,"2":0.52,"3":0.08,"4":0.01,"5":0.04}]

var literalSemanticsNoNull = _.object(map(function(lst){
  [lst.utterance, [lst[1], lst[2], lst[3], lst[4], lst[5]] ]
}, literalSemanticsFromR))


var literalSemantics = literalSemanticsNoNull
// to include null utterance
// var literalSemantics = _.extend(literalSemanticsNoNull,
                                   //                            {nullUtt: [1, 1, 1, 1, 1]})

display(literalSemantics)

//var phiWeights = [1,1,1,1,1,1,1,1,1,1,1]
var honestyWeights = [1,1,1,1,1,1,1,1,1,1,1]
var kindnessWeights = [1,1,1,1,1,1,1,1,1,1,1]


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
    
//    var eUtility = speakerGoals.phi*epistemicUtility;
//    var sUtility = (1-speakerGoals.phi)*socialUtility;
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
     //phi: [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99][discrete(phiWeights)]
      honesty: [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99][discrete(honestyWeights)],
//      kindness: [-0.9,-0.7,-0.5,-0.3,-0.1,0.1, 0.3, 0.5, 0.7, 0.9][discrete(kindnessWeights)]
      kindness: [0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99][discrete(kindnessWeights)]
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

var speaker2 = 

function(state, intendedGoals) {
 Infer({method: 'enumerate', samples: 10000}, 
 //Enumerate(
   function(){
    var utterance = utterancePrior()
    var L1 = listener1(utterance)
    factor(speakerOptimality2 * L1.score({"state":state, "goals":intendedGoals}))

    return utterance
  }
  //)
)
}
//)
// speaker2(1, {honesty:0.3, kindness: 0.7})

// var expectations = {
//  "heart1": speaker2(1, {honesty:0.9, kindness: 0.9}),
//  "heart2": speaker2(2, {honesty:0.9, kindness: 0.9}),
//  "heart3": speaker2(3, {honesty:0.9, kindness: 0.9}),
//  "heart4": speaker2(4, {honesty:0.9, kindness: 0.9}),
//  "heart5": speaker2(5, {honesty:0.9, kindness: 0.9})
// }

var expectations_nicehonest = {
  "heart1": speaker2(1, {honesty:0.8, kindness: 0.8}),
  "heart2": speaker2(2, {honesty:0.8, kindness: 0.8}),
  "heart3": speaker2(3, {honesty:0.8, kindness: 0.8}),
  "heart4": speaker2(4, {honesty:0.8, kindness: 0.8}),
  "heart5": speaker2(5, {honesty:0.8, kindness: 0.8})
}

var expectations_honest = {
  "heart1": speaker2(1, {honesty:0.9, kindness: 0.1}),
  "heart2": speaker2(2, {honesty:0.9, kindness: 0.1}),
  "heart3": speaker2(3, {honesty:0.9, kindness: 0.1}),
  "heart4": speaker2(4, {honesty:0.9, kindness: 0.1}),
  "heart5": speaker2(5, {honesty:0.9, kindness: 0.1})
}

var expectations_nice = {
  "heart1": speaker2(1, {honesty:0.1, kindness: 0.9}),
  "heart2": speaker2(2, {honesty:0.1, kindness: 0.9}),
  "heart3": speaker2(3, {honesty:0.1, kindness: 0.9}),
  "heart4": speaker2(4, {honesty:0.1, kindness: 0.9}),
  "heart5": speaker2(5, {honesty:0.1, kindness: 0.9})
}

var expectations_kindofhonest = {
  "heart1": speaker2(1, {honesty:0.7, kindness: 0.3}),
  "heart2": speaker2(2, {honesty:0.7, kindness: 0.3}),
  "heart3": speaker2(3, {honesty:0.7, kindness: 0.3}),
  "heart4": speaker2(4, {honesty:0.7, kindness: 0.3}),
  "heart5": speaker2(5, {honesty:0.7, kindness: 0.3})
}

var expectations_kindofnice = {
  "heart1": speaker2(1, {honesty:0.3, kindness: 0.7}),
  "heart2": speaker2(2, {honesty:0.3, kindness: 0.7}),
  "heart3": speaker2(3, {honesty:0.3, kindness: 0.7}),
  "heart4": speaker2(4, {honesty:0.3, kindness: 0.7}),
  "heart5": speaker2(5, {honesty:0.3, kindness: 0.7})
}

//var expectations_dataHonest = {
//  "heart1": speaker2(1, {honesty:0.5, kindness: 0.5}),
//  "heart2": speaker2(2, {honesty:0.5, kindness: 0.5}),
//  "heart3": speaker2(3, {honesty:0.5, kindness: 0.5}),
//  "heart4": speaker2(4, {honesty:0.5, kindness: 0.5}),
//  "heart5": speaker2(5, {honesty:0.5, kindness: 0.5})
//}

//var expectations_dataNice = {
//  "heart1": speaker2(1, {honesty:0.3, kindness: 0.7}),
//  "heart2": speaker2(2, {honesty:0.3, kindness: 0.7}),
//  "heart3": speaker2(3, {honesty:0.3, kindness: 0.7}),
//  "heart4": speaker2(4, {honesty:0.3, kindness: 0.7}),
//  "heart5": speaker2(5, {honesty:0.3, kindness: 0.7})
//}

//var expectations_dataNicehonest = {
//  "heart1": speaker2(1, {honesty:0.4, kindness: 0.6}),
//  "heart2": speaker2(2, {honesty:0.4, kindness: 0.6}),
//  "heart3": speaker2(3, {honesty:0.4, kindness: 0.6}),
//  "heart4": speaker2(4, {honesty:0.4, kindness: 0.6}),
//  "heart5": speaker2(5, {honesty:0.4, kindness: 0.6})
//}


//var expectations_s1 = {
//  "heart1": speaker1(1, {honesty:0.9, kindness: 0.9}),
//  "heart2": speaker1(2, {honesty:0.9, kindness: 0.9}),
//  "heart3": speaker1(3, {honesty:0.9, kindness: 0.9}),
//  "heart4": speaker1(4, {honesty:0.9, kindness: 0.9}),
//  "heart5": speaker1(5, {honesty:0.9, kindness: 0.9})
//}

//var expectations_s2 = {
//  "heart1": speaker2(1, {honesty:0.9, kindness: 0.9}),
//  "heart2": speaker2(2, {honesty:0.9, kindness: 0.9}),
//  "heart3": speaker2(3, {honesty:0.9, kindness: 0.9}),
//  "heart4": speaker2(4, {honesty:0.9, kindness: 0.9}),
//  "heart5": speaker2(5, {honesty:0.9, kindness: 0.9})
// }

//var expectations = {
//  "s1": expectations_s1,
//  "s2": expectations_s2 
//}

var expectations = {
  "nicehonest": expectations_nicehonest,
  "honest": expectations_honest, 
  "nice": expectations_nice, 
  "kindofhonest": expectations_kindofhonest, 
  "kindofnice": expectations_kindofnice 
//  "dataHonest": expectations_dataHonest, 
//  "dataNice": expectations_dataNice, 
//  "dataNicehonest": expectations_dataNicehonest 
}

expectations
//print(literalSemanticsNoNull)
