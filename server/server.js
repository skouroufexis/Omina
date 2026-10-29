
const express = require('express')

var cors = require('cors')



const app = express()

app.use(cors())
app.use(express.json()) 





const port = 300

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.post('/currentLocation', (req, res) => {
  
  let latitude=req.body.latitude;
  let longitude=req.body.longitude;
  let key = process.env.API_KEY;

  let unit=req.body.unit;
  if(unit==1){
    unit='metric';
  }
  else{
    unit='imperial';
  }

  let url = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='
            +longitude+'&appid='+key+'&units='+unit;

  
  
fetch(url,callback)
.then(x => {
  if(x.ok){
    x.json()
    .then(y => callback(y));
    
  }
  else{
    res.json({
      status:400,
      error:'Error loading data'
      
    })
  }
  
}).catch(err=>{
  console.log(err)
})

function callback(y){
  console.log(y);
  res.json({
          status:200,
          name:y.name,
          country:y.sys.country,
          currentTemperature:y.main.temp.toFixed(),
          maxTemperature:y.main.temp_max.toFixed(),
          minTemperature:y.main.temp_min.toFixed(),
          icon:'https://openweathermap.org/img/wn/'+y.weather[0].icon+'@2x.png' 
        })
}



  
})

app.post('/weekly', (req, res) => {  
  let latitude=req.body.latitude;
  let longitude=req.body.longitude;
  let unit=req.body.unit;
  if(unit==1){
    unit='metric';
  }
  else{
    unit='imperial';
  }

let url = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='
            +longitude+'&appid=29ebeb672352e1b682402ec8674aad4b&units='+unit;
    
fetch(url)
.then(x =>{ 
  if(x.ok){
    x.json()
    .then(y=>{  
      let today= new Date();
      let todayDay=today.getDate();
      let todayMonth=today.getMonth();
      todayMonth=todayMonth+1;
      let todayYear=today.getFullYear();
  
  
  todayDay=todayDay.toString();
  todayMonth=todayMonth.toString();
  //reformat day and month
  if(todayMonth.length==1){
    todayMonth='0'+todayMonth;
  }
  
  let response=[];
  
    for(x of y.list){
  
      // reformat day
  
      let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
      let day=x.dt_txt.split(' ');
          day=day[0];
          day=day.split('-');
          day=day[2]+'-'+day[1]+'-'+day[0];
                
      let time=x.dt_txt.split(' ');
          time=time[1];
          time=time.split(':');
          time=time[0]+':'+time[1];
      
      // if(day!=todayDate ||1==1){      
        if(time=='06:00' || time=='12:00' ||time=='18:00'){
          
          
  
          //reformat month
          let month= day.split('-');
              month=month[1];
              month=Number(month);
              month=months[month-1];
  
              //reformat date
  
              day=day.split('-');
              day=day[0];
              
  
          
          
          x['dateDay']=day+' '+month;
          x['dateTime']=time;
          x.main.temp=x.main.temp.toFixed();                    
          x.weather[0].icon='https://openweathermap.org/img/wn/'+x.weather[0].icon+'@2x.png';           
          response.push(x);
        }
        
      // }
  
    }
    
    console.log(response);
    console.log('AAAAAA');
    response={status:200,response:response}
    res.json( response);
  
    }
    
    );
  }
  else{
    response={status:400,error:'Error loading data'}
    res.json(response);
  }
  
}).catch(err=>{
  console.log(err)
})

  
})

app.get('/getLocation', (req, res) => {
  
  let location = req.query.location;
  let unit =req.query.units;

  if(unit==1){
    unit='metric';
  }
  else{
    unit='imperial';
  }

  let url= 'https://api.openweathermap.org/data/2.5/weather?q='+location+'&units='+unit+'&appid=29ebeb672352e1b682402ec8674aad4b';

  fetch(url)
        .then(x => x.json())
        .then(y => { 

          console.log(y);    
          if(y.cod!=200){
            res.json(y)
          }
          else{
            
            res.json({
              cod:y.cod,
              longitude:y.coord.lon,
              latitude:y.coord.lat,
              name:y.name,
              country:y.sys.country,
              currentTemperature:y.main.temp.toFixed(),
              maxTemperature:y.main.temp_max.toFixed(),
              minTemperature:y.main.temp_min.toFixed(),
              icon:'https://openweathermap.org/img/wn/'+y.weather[0].icon+'@2x.png' 
            })
          }
          
        });

})

app.post('/hourly',(req,res)=>{

    let today= new Date();
    let todayDay=today.getDate();
        todayDay=todayDay.toString();  
        if(todayDay.length==1){
          todayDay='0'+todayDay;
        }

    let todayMonth=today.getMonth();
        todayMonth=todayMonth+1;
        todayMonth=todayMonth.toString();  
        if(todayMonth.length==1){
          todayMonth='0'+todayMonth;
        }

    
    let todayYear=today.getFullYear();

    let todayDate=todayYear+'-'+todayMonth+'-'+todayDay;
  
// "2024-04-02 21:00:00"

  let latitude=req.body.latitude;
  let longitude=req.body.longitude;  
  
  let unit=req.body.unit;
  if(unit==1){
    unit='metric';
  }
  else{
    unit='imperial';
  }

  
  let url = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid=29ebeb672352e1b682402ec8674aad4b&units='+unit;
  let response=[];
  fetch(url)
        .then(x => {
          if(x.ok){
            x.json()
            .then(y => {                      
              console.log(y);
              
              for(let c=0;c<8;c++){
     
               // '2024-04-06 21:00:00'
     
                 let iDate=y.list[c].dt_txt;
                 
                 iDate=iDate.split(" ");
                 iDate=iDate[0];
                 console.log(iDate)
     
     
                 let iTime=y.list[c].dt_txt;
                     iTime=iTime.split(' ');
                     iTime=iTime[1];
                     iTime=iTime.split(':');            
                     iTime=iTime[0]+':'+iTime[1];
                 y.list[c].time=iTime;            
                 y.list[c].weather[0].icon='https://openweathermap.org/img/wn/'+y.list[c].weather[0].icon+'@2x.png' 
     
                 console.log(iTime)
                 if(iDate==todayDate){
                   response.push(y.list[c])
                 }
               
              }
              response={status:200,response:response};              
              res.json(response);
             });

          }
          else{
            response={status:400,error:'Error loading data'};
            res.json(response);
          }
          
        
        }).catch(err=>{
          console.log(err)
        });
        
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

