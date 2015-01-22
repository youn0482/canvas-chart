//global variables for the canvas charts
var canvas, canvas2, context, context2;

//make the ajax call once the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        type : 'GET',
        dataType : 'json',
        async: false,
        url: 'http://m.edumedia.ca/youn0482/ajaxcalls/cheese.json',
        
}).done(buildCharts).fail(function(){
        alert("didnt work");
    });
});

//build both of the charts
function buildCharts(data){
   
    var arrSize = data.segments.length;
    var currentAngle = 0;
    var totalVal = 0;
    
    
    canvas = document.querySelector("#pie");
    context = canvas.getContext("2d");
    
    var cx = canvas.width/2;
    var cy = canvas.height/2; 
    var radius = 100;
    var big = 0;
    var small = 100000;
    
    //calcalate total values
    for (var t=0;t<arrSize;t++){
        totalVal = totalVal + Number(data.segments[t].value); 
        
        //find the biggest value for later comparison
        if (Number(data.segments[t].value) > big){
            big = Number(data.segments[t].value);
        }
        
        //find the smallest value for later comparison
        if (Number(data.segments[t].value) < small){
            small = Number(data.segments[t].value);
        }
        
    }
   
    
    
    //construct pie chart loop through each pie slice
    for(var i=0; i<arrSize; i++){
        
        //find percentage of value
        var pct = data.segments[i].value/totalVal;

        //calculate the ending Angle for the slice
        var endAngle = currentAngle + (pct * (Math.PI * 2));
       
        //draw the arc
        context.moveTo(cx, cy);
        context.beginPath();
        context.fillStyle = data.segments[i].color;
        
        //check to see if this is the biggest or smallest value and draw accordingly
        if ((data.segments[i].value) === big){
            context.arc(cx, cy, radius*0.9, currentAngle, endAngle, false);  
            context.lineTo(cx, cy);
            context.fill();
        }else if ((data.segments[i].value) === small){
            context.arc(cx, cy, radius * 1.1, currentAngle, endAngle, false);  
            context.lineTo(cx, cy);
            context.fill();  
        }else{
             context.arc(cx, cy, radius, currentAngle, endAngle, false);  
            context.lineTo(cx, cy);
            context.fill(); 
        }
        
        //Now draw the lines that will point to the values
        context.save();
        context.translate(cx, cy);//make the middle of the circle the (0,0) point
        context.strokeStyle = "#000";
        context.lineWidth = 1;
        context.beginPath();
        //angle to be used for the lines
        var midAngle = (currentAngle + endAngle)/2;//middle of two angles
        context.moveTo(0,0);//this value is to start at the middle of the cirle
        
        //to start further out...
        var dx = Math.cos(midAngle) * (0.8 * radius);
        var dy = Math.sin(midAngle) * (0.8 * radius);
        context.moveTo(dx, dy);
        
        //ending points for the lines
        var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
        var dy = Math.sin(midAngle) * (radius + 30);
        context.lineTo(dx, dy);
        context.stroke();
        
        //add the labels
        context.font = "bold 16px Arial";
        context.fillStyle = "black";
        context.fillText(data.segments[i].label, dx, dy);
        
        //put the canvas back to the original position
        context.restore();
        
        //reset the currentAngle to endAngle 
        currentAngle = endAngle;
    }
    
    
    //build the second chart
    canvas2 = document.querySelector("#chart");
    context2 = canvas2.getContext("2d");
    
    //set new x,y variables
    var x = 0;
    var y = 0;
    
        //loop to work through each item in cheese array
        for(var b=0; b<arrSize; b++){
            
            //find the percentage the targeted value and round it
            var pct = Math.round((data.segments[b].value/totalVal)*100);
            
            //set x to 150 to give room for labels and have y add 25 each time to
            //make a new line for each cheese
            x = 150;
            y = y + 25;
            
            //print the label
            context2.moveTo(x, y);
            context2.font = "bold 16px Arial";
            context2.fillStyle = "black";
            context2.textAlign = "right";
            context2.fillText(data.segments[b].label, x, y);
            
            //draw a circle for each values overall %
            for (var a=0; a<pct; a++){
                
                //add to x value to show circles in a horizontal line
                x = x + 10;
                
                //draw circle and color according to data
                context2.moveTo(x, y);
                context2.beginPath();
                context2.fillStyle = data.segments[b].color;
                context2.arc(x, y, 5, 0, Math.PI * 2, false);
                context2.closePath();
                context2.fill();
            }
        }
    
}