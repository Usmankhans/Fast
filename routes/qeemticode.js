var userData = { 
Produced_Quantity: [ { hasValue: 2, hasTime: 0 } ],

  Actual_Unit_Busy_Time:
   [ { hasValue_ROB9: 6, hasTime: 0 },
     { hasValue_ROB12: 2, hasTime: 0 },
     { hasValue_ROB7: 4, hasTime: 0 },
     { hasValue_ROB2: 8, hasTime: 0 },
     { hasValue_ROB6: 12, hasTime: 0 },
     { hasValue_ROB10: 32, hasTime: 0 },
     { hasValue_ROB5: 44, hasTime: 0 },
     { hasValue_ROB1: 56, hasTime: 0 },
     { hasValue_ROB8: 76, hasTime: 0 },
     { hasValue_ROB3: 54, hasTime: 0 },
     { hasValue_ROB11: 38, hasTime: 0 },
     { hasValue_ROB4: 24, hasTime: 0 } ]
	 ,
  
  Actual_Production_Time:
   [ { hasValue_ROB7: 98, hasTime: 0 },
     { hasValue_ROB3: 88, hasTime: 0 },
     { hasValue_ROB12: 78, hasTime: 0 },
     { hasValue_ROB4: 76, hasTime: 0 },
     { hasValue_ROB8: 56, hasTime: 0 },
     { hasValue_ROB5: 44, hasTime: 0 },
     { hasValue_ROB1: 16, hasTime: 0 },
     { hasValue_ROB9: 66, hasTime: 0 },
     { hasValue_ROB11: 14, hasTime: 0 },
     { hasValue_ROB6: 18, hasTime: 0 },
     { hasValue_ROB10: 26, hasTime: 0 },
     { hasValue_ROB2: 48, hasTime: 0 } ]
	 
};

var formula = "Actual_Production_Time / Produced_Quantity * 100";

function start() {
//sorting data before sending for calculation
for (var key in userData) {
		userData[key].sort(function (a, b) {
      return Object.keys(a)[0].replace(/\D/g,'') - Object.keys(b)[0].replace(/\D/g,''); 
})}


calculate(userData, formula) 
}

function calculate(para1, para2){
		
    	var paraArray = formula.split(" ");
      //console.log(paraArray);
      argu = [];
      paraArray.forEach(function(x){
      if(x.length > 1 && isNaN(x))
      	argu.push(x);
      });
     
     // console.log(argu);
      formula = "return ".concat(formula);
      //console.log(formula);
      var myFunc = new Function(argu, formula);
      //console.log(myFunc(9,3))
      
      var data1 = para1[argu[0]];
      var data2 = para1[argu[1]];



     
      var len = data1.length > 1 ? data1.length : data2.length;
      console.log(len);
   
      for(var i = 0; i < len; i++){
      var a = data1.length > 1 ? data1[i][Object.keys(data1[i])[0]] : data1[0][Object.keys(data1[0])[0]]
      var b = data2.length > 1 ? data2[i][Object.keys(data2[i])[0]] : data2[0][Object.keys(data2[0])[0]]
      console.log(Object.keys(data1[i])[0] + " :: "+myFunc(a,b))
      
      }
      
      
      
      
}

start();