var filename = "EJY_polimp11"
var condCounts = "1,50;2,50;3,50;" //Example: "1,20;2,20;3,20"

// ---------------- HELPER ------------------
var NUM_SLIDERS = 5;

function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

function clearForm(oForm) {
  var sliderVar = "";
  for(var i=0; i<NUM_SLIDERS; i++)
  {
    sliderVar = "#slider" + i;
    $(sliderVar).slider("value", 20);
    $(sliderVar).css({"background":"#FFFFFF"});
    $(sliderVar + " .ui-slider-handle").css({
        "background":"#FAFAFA",
        "border-color": "#CCCCCC" });
    sliderVar = "slider" + i;
    document.getElementById(sliderVar).style.background = "";
  }
  
  var elements = oForm.elements; 
  
  oForm.reset();

  for(var i=0; i<elements.length; i++) {
    field_type = elements[i].type.toLowerCase();
    switch(field_type) {
    
      case "text": 
      case "password": 
      case "textarea":
            case "hidden":	
        
        elements[i].value = ""; 
        break;
          
      case "radio":
      case "checkbox":
          if (elements[i].checked) {
            elements[i].checked = false; 
        }
        break;
  
      case "select-one":
      case "select-multi":
                  elements[i].selectedIndex = -1;
        break;
  
      default: 
        break;
    }
  }
}

Array.prototype.random = function() {
  return this[random(this.length)];
}

// shuffle function
function shuffle (a) 
{ 
    var o = [];    
    for (var i=0; i < a.length; i++) {
	o[i] = a[i];
    }    
    for (var j, x, i = o.length;
	 i;
	 j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);	
    return o;
}

function shuffledArray(arrLength)
{
  var j, tmp;
  var arr = new Array(arrLength);
  for (i = 0; i < arrLength; i++)
  {
    arr[i] = i;
  }
  for (i = 0; i < arrLength-1; i++)
  {
    j = Math.floor((Math.random() * (arrLength - 1 - i)) + 0.99) + i;
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function shuffledSampleArray(arrLength, sampleLength)
{
  var arr = shuffledArray(arrLength);
  var beginIndex = Math.floor(Math.random() * (arrLength-sampleLength+1));
  return arr.slice(beginIndex, beginIndex+sampleLength);
}

function getRadioCheckedValue(formNum, radio_name)
{
   var oRadio = document.forms[formNum].elements[radio_name];
   for(var i = 0; i < oRadio.length; i++)
   {
      if(oRadio[i].checked)
      {
         return oRadio[i].value;
      }
   }
   return '';
}


// ---------------- PARAMETERS ------------------

// CONDITION ASSIGNMENT
// var cond = random(3)+1;
var expt = "adj_goalPos";
//var cond = random(3)+1;
var cond = 2;

// call the maker getter to get the cond variable 
//var xmlHttp = null;
//xmlHttp = new XMLHttpRequest();
//xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + condCounts +"&filename=" + filename, false );
//xmlHttp.send( null );
//var cond = xmlHttp.responseText;

var score = shuffle(["to be polite", "to be honest", "to be kind", "to be informative"]); // FIXME: randomize
//             , "40", "50", "60", "70", "80", "90"];

//if (cond === 1) {
//    
//    var allConditions = 
//        shuffle(
//[
//shuffle(
//    [
//{"domain":"poem",
// "polite":"polite",
// "utterance":"bad",
//},
//{"domain":"cake",
// "polite":"polite",
// "utterance":"great",
//},
//{"domain":"cookies",
// "polite":"polite",
// "utterance":"not_bad",
//},
//{"domain":"presentation", 
//"polite":"polite", 
//"utterance":"not_great"
//}
//]),
//shuffle(
//    [
//{"domain":"poem",
// "polite":"polite",
// "utterance":"not_great",
//},
//{"domain":"cake",
// "polite":"polite",
// "utterance":"not_bad",
//},
//{"domain":"cookies",
// "polite":"polite",
// "utterance":"great",
//},
//{"domain":"presentation", 
//"polite":"polite", 
//"utterance":"bad"
//}
//]),
//])
//    } else if (cond === 2) { 
//    
//    var allConditions = 
//        shuffle(
//[
//shuffle(
//    [
//{"domain":"poem",
// "polite":"honest",
// "utterance":"great",
//},
//{"domain":"cake",
// "polite":"honest",
// "utterance":"bad",
//},
//{"domain":"presentation",
// "polite":"honest",
// "utterance":"not_bad"
//},
//{"domain":"cookies",
// "polite":"honest", 
// "utterance":"not_great"
//}
//]),
//shuffle(
//    [
//{"domain":"poem",
// "polite":"honest",
// "utterance":"not_bad",
//},
//{"domain":"cake",
// "polite":"honest",
// "utterance":"not_great",
//},
//{"domain":"presentation",
// "polite":"honest",
// "utterance":"bad"
//},
//{"domain":"cookies",
// "polite":"honest", 
// "utterance":"great"
//}
//]),
//])
//    } else {
//            
    var allConditions = // FIXME!!
        shuffle(
[
    
shuffle(
    [
{"domain":"poem",
// "polite":"baseline",
 "state": "okay",
 "utterance":"terrible",
},
{"domain":"cake",
 "state":"terrible",
 "utterance":"amazing",
},
{"domain":"cookies",
 "state":"amazing",
 "utterance":"terrible",
},
{"domain":"presentation", 
"state":"good", 
"utterance":"bad"
}
]),
shuffle(
    [
{"domain":"poem",
 "state":"amazing",
 "utterance":"bad",
},
{"domain":"cake",
 "state":"good",
 "utterance":"terrible",
},
{"domain":"cookies",
 "state":"okay",
 "utterance":"amazing",
},
{"domain":"presentation", 
"state":"bad", 
"utterance":"amazing"
}
]),

]); 
//}
        

speakers = shuffle([["John","Bob",], ["Hailey", "Mika"], ["Karen", "Jenny"], ["Kyle", "James"]]);
speakers1 = shuffle(speakers[0]);
speakers2 = shuffle(speakers[1]);
speakers3 = shuffle(speakers[2]);
speakers4 = shuffle(speakers[3]);

var sents = {
    utterances: {
        terrible: {
            sent_utterance: " SP said, \"It was terrible!\""
        },        
        bad: {
            sent_utterance: " SP said, \"It was bad!\""
        },        
        okay: {
            sent_utterance: " SP said, \"It was okay!\"" 
        },
        good: {
            sent_utterance: " SP said, \"It was good!\"" 
        },
        amazing: {
            sent_utterance: " SP said, \"It was amazing!\"" 
        },
//        not_bad: {
//            sent_utterance: " SP said, \"Not bad.\""
//        },        
//        not_great: {
//            sent_utterance: " SP said, \"Not great.\"" 
//        },
//        bad: {
//            sent_utterance: " SP said, \"It was bad.\""
//        },        
//        great: {
//            sent_utterance: " SP said, \"It was great.\"" 
//        }
    },
    domains: {
        presentation: {
            sent_precontext: "Imagine that LS just gave a presentation, and", 
            sent_context: " LS approached SP who saw LS's presentation, and asked: \"How was my presentation?\"", 
            SP: speakers1[0],
            LS: speakers1[1],
            BB: "presentation",
	},
	   cookies: {
            sent_precontext: "Imagine that LS baked some cookies, and", 
            sent_context: " LS approached SP who tasted LS's cookie, and asked: \"How did my cookie taste?\"", 

            SP: speakers2[0],
            LS: speakers2[1],
            BB: "cookie",
	},
	   poem: {
            sent_precontext: "Imagine that LS wrote a poem, and", 
            sent_context: " LS approached SP who read LS's poem, and asked: \"How was my poem?\"", 

            SP: speakers3[0],
            LS: speakers3[1],
            BB: "poem",
	},        
	   cake: {
            sent_precontext: "Imagine that LS baked a cake, and", 
            sent_context: " LS approached SP who tasted LS's cake, and asked: \"How did my cake taste?\"", 

            SP: speakers4[0],
            LS: speakers4[1],
            BB: "cake",
	}    },
//    polites: {
//        honest: {
//            sent_polite: " SP is a very honest, blunt person."        
//        },
//        polite: {
//            sent_polite: " SP is a very polite person."        
//        },
//        baseline: {
//            sent_polite: ""                    
//        }
//    },
    states: {
        terrible: {
            state: " LS's BB was terrible."        
        },
        bad: {
            state: " LS's BB was bad."        
        },
        okay: {
            state: " LS's BB was just okay."        
        },
        good: {
            state: " LS's BB was good."        
        },
        amazing: {
            state: " LS's BB was amazing."        
        },
    }
}

function doSentSubs (sents, polite, domain, utterance)
{
    utterance = sents["utterances"][utterance]["sent_utterance"];
    precontext = sents["domains"][domain]["sent_precontext"];
    context = sents["domains"][domain]["sent_context"];
//    polite = sents["polites"][polite]["sent_polite"];
    state = sents["states"][state]["state"]
    question = "Based on what SP said, how likely do you think each of the following was SP's goal?";
    question2 = "Based on what SP said, how likely is it for YOU to ask for SP's opinion on your own BB?";
 
    BB = sents["domains"][domain]["BB"]; //Item 2
    SP = sents["domains"][domain]["SP"]; //speaker
    LS = sents["domains"][domain]["LS"]; //addressee
 
    utterance = utterance.replace("BB",BB).replace("SP",SP);
    context = context.replace("BB",BB).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("LS",LS).replace("LS",LS).replace("LS",LS);
    precontext = precontext.replace("BB",BB).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("LS",LS).replace("LS",LS).replace("LS",LS);
//    polite = polite.replace("BB",BB).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP);
    state = state.replace("BB",BB).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("LS",LS).replace("LS",LS).replace("LS",LS);
    question = question.replace("BB",BB).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("LS",LS).replace("LS",LS).replace("LS",LS);   
    question2 = question2.replace("BB",BB).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("SP",SP).replace("LS",LS).replace("LS",LS).replace("LS",LS);   
    
    return [utterance, context, state, precontext, question, question2];
}


// allConditions = shuffle(allConditions);

var numConditions = allConditions.length;
var chooseCondition = random(0, numConditions-1);
var allTrialOrders = allConditions[chooseCondition];
var numTrials = allTrialOrders.length;
var shuffledOrder = shuffledSampleArray(allTrialOrders.length, numTrials);
var currentTrialNum = 0;
var trial;
var numComplete = 0;
var buyer;

showSlide("instructions");
$("#trial-num").html(numComplete);
$("#total-num").html(numTrials);


var experiment = {
    
    data: {
    expt: expt,
    cond: cond,
    order: [],
    domain: [],
//    polite: [],
    state: [],
    utterance: [],
    context: [],
    goal0: score[0],
    goal1: score[1],
    goal2: score[2],
    goal3: score[3],
    inferredProb0: [],
    inferredProb1: [],
    inferredProb2: [],
    inferredProb3: [],
    inferredProb4: [],
    language: [],
	expt_aim: [],
	character_thoughts: [],
	expt_gen: [],
    numTrials: numTrials
    },
    
  end: function() {	
    experiment.data.language.push(document.getElementById("homelang").value);
	experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
	experiment.data.character_thoughts.push(document.getElementById("character_thoughts").value);
	experiment.data.expt_gen.push(document.getElementById("expcomments").value);
    showSlide("finished");
      
//    			//Decrement			
//			var xmlHttp = null;
//			xmlHttp = new XMLHttpRequest()
//			xmlHttp.open("GET", "http://langcog.stanford.edu/cgi-bin/subject_equalizer/decrementer.php?filename=" + filename + "&to_decrement=" + cond, false);
//			xmlHttp.send(null)
      
    setTimeout(function() {turk.submit(experiment.data) }, 1500);
  },
    
  next: function() {
    // Allow experiment to start if it's a turk worker OR if it's a test run
	if (window.self == window.top | turk.workerId.length > 0) {

    if (numComplete > 0) {

      var prob0 = parseInt(document.getElementById("hiddenSliderValue0").value) / 40.00;
      var prob1 = parseInt(document.getElementById("hiddenSliderValue1").value) / 40.00;
      var prob2 = parseInt(document.getElementById("hiddenSliderValue2").value) / 40.00;
      var prob3 = parseInt(document.getElementById("hiddenSliderValue3").value) / 40.00;
      var prob4 = parseInt(document.getElementById("hiddenSliderValue4").value) / 40.00;

      experiment.data.order.push(numComplete);
      experiment.data.utterance.push(trial.utterance);
      experiment.data.domain.push(trial.domain);
//      experiment.data.polite.push(trial.polite);
      experiment.data.state.push(trial.state);
      experiment.data.context.push(trial.context);
      experiment.data.inferredProb0.push(prob0);
      experiment.data.inferredProb1.push(prob1);
      experiment.data.inferredProb2.push(prob2);
      experiment.data.inferredProb3.push(prob3);
      experiment.data.inferredProb4.push(prob4);
   
      clearForm(document.forms[0]);
      clearForm(document.forms[1]);
    }
    if (numComplete >= numTrials) {
    	$('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
    	$("#trial-num").html(numComplete);
    	$("#total-num").html(numTrials);
    	showSlide("askInfo");
    } else {
    	$('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
    	$("#trial-num").html(numComplete);
    	$("#total-num").html(numTrials);
    	currentTrialNum = numComplete;
    	trial = allTrialOrders[shuffledOrder[numComplete]];
        utterance = trial.utterance;
//        polite = trial.polite;
        state = trial.state;
        domain = trial.domain;
        context = trial.context;
        sent_materials = doSentSubs(sents, state, domain, utterance);
      showSlide("stage");
      $("#context").html(sent_materials[3] + sent_materials[2] + sent_materials[1] + sent_materials[0]);  
      $("#question").html(sent_materials[4]);    
      
      for (var i = 0; i <= 11; i++)
      {         
        $("#score" + 10*i).html(score[i]);
      }
      $("#question2").html(sent_materials[5]);    

      numComplete++;      
    }}
  }
}

// scripts for sliders
$("#slider0").slider({
               animate: true,
               orientation: "vertical",
               max: 40 , min: 0, step: 1, value: 20,
               slide: function( event, ui ) {
                   $("#slider0 .ui-slider-handle").css({
                      "background":"#E0F5FF",
                      "border-color": "#001F29"
                   });
               },
               change: function( event, ui ) {
                   $('#hiddenSliderValue0').attr('value', ui.value);
                   $("#slider0").css({"background":"#99D6EB"});
                   $("#slider0 .ui-slider-handle").css({
                     "background":"#667D94",
                     "border-color": "#001F29" });
               }});



$("#slider1").slider({
               animate: true,
               orientation: "vertical",
               max: 40 , min: 0, step: 1, value: 20,
               slide: function( event, ui ) {
                   $("#slider1 .ui-slider-handle").css({
                      "background":"#E0F5FF",
                      "border-color": "#001F29"
                   });
               },
               change: function( event, ui ) {
                   $('#hiddenSliderValue1').attr('value', ui.value);
                   $("#slider1").css({"background":"#99D6EB"});
                   $("#slider1 .ui-slider-handle").css({
                     "background":"#667D94",
                     "border-color": "#001F29" });
               }});

$("#slider2").slider({
               animate: true,
               orientation: "vertical",
               max: 40 , min: 0, step: 1, value: 20,
               slide: function( event, ui ) {
                   $("#slider2 .ui-slider-handle").css({
                      "background":"#E0F5FF",
                      "border-color": "#001F29"
                   });
               },
               change: function( event, ui ) {
                   $('#hiddenSliderValue2').attr('value', ui.value);
                   $("#slider2").css({"background":"#99D6EB"});
                   $("#slider2 .ui-slider-handle").css({
                     "background":"#667D94",
                     "border-color": "#001F29" });
               }});
$("#slider3").slider({
               animate: true,
               orientation: "vertical",
               max: 40 , min: 0, step: 1, value: 20,
               slide: function( event, ui ) {
                   $("#slider3 .ui-slider-handle").css({
                      "background":"#E0F5FF",
                      "border-color": "#001F29"
                   });
               },
               change: function( event, ui ) {
                   $('#hiddenSliderValue3').attr('value', ui.value);
                   $("#slider3").css({"background":"#99D6EB"});
                   $("#slider3 .ui-slider-handle").css({
                     "background":"#667D94",
                     "border-color": "#001F29" });
               }});

 $("#slider4").slider({
               animate: true,
               max: 40 , min: 0, step: 1, value: 20,
               slide: function( event, ui ) {
                   $("#slider4 .ui-slider-handle").css({
                      "background":"#E0F5FF",
                      "border-color": "#001F29"
                   });
               },
               change: function( event, ui ) {
                   $('#hiddenSliderValue4').attr('value', ui.value);
                   $("#slider4").css({"background":"#99D6EB"});
                   $("#slider4 .ui-slider-handle").css({
                     "background":"#667D94",
                     "border-color": "#001F29" });
               }});

