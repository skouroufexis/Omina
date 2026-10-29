import React from 'react'
import  { useState,useEffect } from 'react';

import background from './background.jpg';

import logo2 from './logo2.png';

import loading from './loading.gif';





function FullBody(){
    //views according to user selection
    // 0 = main view
    // 1 = SideMenu
    // 2 = Locations
    // 3 = Week

    const [isSplash,setSplash]=useState(false);

    const [viewDisplay, toggleView] = useState(0); 
    
    let [locationError, setLocationError] = useState(''); 

    let [location, setLocation] = useState({latitude:'',longitude:''}); 

    let [locationData,setLocationData]=useState('');
    
    let [weekData,setWeekData]=useState('');

    let [myLocations,setMyLocations]=useState('');
    
    let [isSavedLocation,setIsSavedLocation]=useState(false);

    let [hourlyData,setHourlyData]=useState('');

    let [errorCurrentLocation,setErrorCurrentLocation]=useState('');

    let [errorWeekly,setErrorWeekly]=useState('');
    let [errorHourly,setErrorHourly]=useState('');


    let queryLocation=[];

    

    
    
    useEffect(() => {

        if(myLocations!=''){
             //check if current location is saved
            checkSaved();
        }
    }, [myLocations]); 

    //initialize values
      
    let temperatureFormat;

    if(localStorage.getItem('temperatureFormat')!=null){
        temperatureFormat=localStorage.getItem('temperatureFormat');    
    }
    else{
        temperatureFormat='°C';
        localStorage.setItem('temperatureFormat',temperatureFormat);
    }  
    
    const today = new Date();

    

    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    
     

    function SplashScreen(){
        return(
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <img src={logo2}></img>
                    </div>
                </div>
            </div>
        )
    }

    function MainBody(){

    
        return(
            <div className="container   transition" id="mainBody" onLoad={getCurrentLocation()}>   
                                  

                                  
                                  
                <div className="row p-2 membrane" id='topMenu'>       
                
                    <button className="col-1 btn  fa fa-cog " onClick={()=>toggleView(1)}></button>
                    <button className="col-1 btn  fa fa-map-marker" onClick={()=>{
                        
                        localStorage.removeItem('selectedQueryLocation');
                        setLocation({latitude:'',longitude:''});
                        setLocationData('');
                        getCurrentLocation();                                
                        }
                        
                        }></button>
                    <button className="col-1 btn  fa fa-compass " onClick={()=>toggleView(2)} ></button>

                    
                 </div>
    
                <div className='row membrane1 whitesmoke'>
                    <div className='col mt-1 text-center'>{today.getDate()} {months[today.getMonth()]} {today.getFullYear()}</div>
                </div>

                
                
                
                 <div className='row text-center shadow-sm'>
                    
                    {(locationData=='' && errorCurrentLocation=='') && 
                    
                    <div>
                        <div><img id='loading' src={loading}></img></div>
                        <p>Loading</p>
                    </div>
                    
                    
                    }

                    {(locationData=='' && errorCurrentLocation!='') && 
                    
                    <div>
                        
                        <p>{errorCurrentLocation}</p>
                    </div>
                    
                    
                    }


                    {locationData!='' && 
                    <div className='membrane1'>
                        
                        <h2 className='white mt-1'>{locationData.name}</h2>
                        
                        <div className='whitesmoke'><small>max: {locationData.maxTemperature} {temperatureFormat} </small></div>                        
                        <h1 className='white border'>{locationData.currentTemperature} {temperatureFormat} <img src={locationData.icon}></img> </h1>
                        <p className='whitesmoke '><small>min: {locationData.minTemperature} {temperatureFormat} </small></p>
                        
                    </div>
                    
                    }

                    

                        

                    {(isSavedLocation==false && location.latitude!='' && locationData!='') &&
                    <button className='btn btn-main rounded-0 ' onClick={()=>saveLocation()}><i class="fa fa-star unsaved"></i></button>
                    }

                   {(isSavedLocation==true && location.latitude!='' && locationData!='') &&
                    <button className='btn btn-main rounded-0' onClick={()=>removeLocation()}><i class="fa fa-star saved"></i></button>
                    }

                 </div>    

                {locationError!='' &&
                
                <div className='row text-center my-1'>
                <p>{locationError}</p>
                </div>       
                
                }


            </div>
        )
    }
    
    function DayTimes(){
        
            return (
            

                <div className="container" id="dayTimes" onLoad={hourly()}>                    
                    <div className='row sticky-top p-2  membrane text-start'><b>Daily forecast</b></div>

                    {errorHourly!='' &&
                        <div className='row mt-1 shadow-sm'>
                            <p>{errorHourly}</p>
                        </div>
                    }

                    {hourlyData!='' &&                    
                        <div>
                            
                            {hourlyData.map((l, index) => (
                                
                                <div className='row mt-1 shadow-sm'>
                                    <div className='col margin-v-auto text-center black '>{l.time}</div>
                                    <div className='col margin-v-auto text-center black'>{l.main.temp.toFixed()} {temperatureFormat}</div>
                                    <div className='col margin-v-auto text-center'><img className='smallIcon' src={l.weather[0].icon}></img></div>                                    
                                </div>
                            ))}
                        </div>
                       
                    }

                    
                </div>
            )
        
        
    }
    
    function Week(){
        return(
            <div className="container  transition_slide-up transition" id="weekDays" onLoad={playTransition('weekDays','up')} >
                <div className='row'>
                        <button className='btn  text-start col-1 fa fa-caret-left mt-1' onClick={()=>unsetTransition('weekDays','up')}></button>
                </div>   
                
                <div className="row"> 
                    <div className='col green text-end'>                    
                        <h2>{locationData.name} </h2>
                    </div>                                                        
                </div>

                {errorWeekly!='' &&
                    <div className='row  p-2 black'>
                    <p>{errorWeekly}</p>
                    </div>
                }

                {weekData!=''&&
                <div id='weekDataContainer'>

                    <div className='row  btn-lightgreen mt-1 white p-2  text-left'>
                        {weekData[0].dateDay}
                    </div>

                    <div className='row'>
                        <div className='col-4'>
                            {weekData[0].dateTime}
                            <img className='smallIcon' src={weekData[0].weather[0].icon}></img>
                        </div>

                        <div className='col-4 '>
                            {weekData[1].dateTime}
                            <img className='smallIcon' src={weekData[1].weather[0].icon}></img>
                        </div>
                        <div className='col-4 '>
                            {weekData[2].dateTime}
                            <img className='smallIcon' src={weekData[2].weather[0].icon}></img>
                        </div>

                        <div className='col-4'>
                            {weekData[0].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[1].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[2].main.temp} {temperatureFormat}                        
                        </div>
                    </div>

                    <div className='row my-1  text-left p-2 border green '>
                        {weekData[3].dateDay}
                    </div>

                    <div className='row  '>
                        <div className='col-4'>
                            {weekData[3].dateTime}
                            <img className='smallIcon' src={weekData[3].weather[0].icon}></img>                        
                        </div>

                        <div className='col-4'>
                            {weekData[4].dateTime}
                            <img className='smallIcon' src={weekData[4].weather[0].icon}></img>
                        </div>

                        <div className='col-4'>
                            {weekData[5].dateTime}
                            <img className='smallIcon' src={weekData[5].weather[0].icon}></img>
                        </div>

                        <div className='col-4'>
                            {weekData[3].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[4].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[5].main.temp} {temperatureFormat}                        
                        </div>
                        

                    </div>

                    <div className='row my-1  text-left p-2 border green  '>
                        {weekData[6].dateDay}
                    </div>

                    <div className='row'>
                        <div className='col-4'>
                            {weekData[6].dateTime}
                            <img className='smallIcon' src={weekData[6].weather[0].icon}></img>
                        </div>

                        <div className='col-4'>
                            {weekData[7].dateTime}
                            <img className='smallIcon' src={weekData[7].weather[0].icon}></img>
                        </div>
                        <div className='col-4'>
                            {weekData[8].dateTime}
                            <img className='smallIcon' src={weekData[8].weather[0].icon}></img>
                        </div>


                        <div className='col-4'>
                            {weekData[6].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[7].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[8].main.temp} {temperatureFormat}                        
                        </div>
                    </div>

                    <div className='row my-1  text-left green border p-2'>
                        {weekData[9].dateDay}
                    </div>

                    <div className='row'>
                        <div className='col-4'>
                            {weekData[9].dateTime}
                            <img className='smallIcon' src={weekData[9].weather[0].icon}></img>
                        </div>

                        <div className='col-4'>
                            {weekData[10].dateTime}
                            <img className='smallIcon' src={weekData[10].weather[0].icon}></img>
                        </div>
                            <div className='col-4'>
                            {weekData[11].dateTime}      
                            <img className='smallIcon' src={weekData[11].weather[0].icon}></img>                  
                        </div>

                        <div className='col-4'>
                            {weekData[9].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[10].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[11].main.temp} {temperatureFormat}                        
                        </div>
                    </div>

                    <div className='row my-1  text-left green border p-2'>
                        {weekData[12].dateDay}
                    </div>

                    <div className='row'>
                        <div className='col-4'>
                            {weekData[12].dateTime}
                            <img className='smallIcon' src={weekData[12].weather[0].icon}></img>                                                
                        </div>

                        <div className='col-4'>
                            {weekData[13].dateTime} {weekData[13].main.temp}
                            <img className='smallIcon' src={weekData[13].weather[0].icon}></img>
                        </div>
                        <div className='col-4'>
                            {weekData[14].dateTime}
                            <img className='smallIcon' src={weekData[14].weather[0].icon}></img>
                        </div>

                        <div className='col-4'>
                            {weekData[12].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[13].main.temp} {temperatureFormat}                        
                        </div>

                        <div className='col-4'>
                            {weekData[14].main.temp} {temperatureFormat}                        
                        </div>
                    </div>
                </div>

            }   

            </div>
            
        )
    }
    
    
    function Menu(){
        return (
            <div className="container transition_slide-left transition" id='menu' onLoad={playTransition('menu','left')}>                
                    <div className='row mt-1'>
                        
                        <button className='btn text-start col-1 fa fa-caret-left' onClick={()=>unsetTransition('menu','left')}></button>
                    </div>     



                    <div className='row mt-1 membrane2  text-left'>
                        <button className='btn   col-6 '><b>Temperature unit:</b></button>                        
                                                            
                        <button className='btn btn-primary   col-6 ' id='buttonTemperatureFormat' onClick={()=>toggleTemperatureFormat()}>{temperatureFormat}</button>                            
                                                                                                   
                    </div>  
                                              

                                              
            </div>
        )
    }

    function Locations(){

        return (
            <div className="container transition_slide-right transition" id='locations' onLoad={playTransition('locations','right')}>                
                    <div className='row'>
                        <button className='btn col-1 fa fa-caret-left' onClick={()=>unsetTransition('locations','right')}></button>
                    </div>     



                    <div className='row my-3'>
                       <i class="fa fa-search col-1 p-1  text-center"></i> 
                       <input className='col-11 p-1 search' type='search' id='searchLocation' name='searchLocation'  placeholder='search location' onChange={()=>{getLocation()}}></input>                                                                                              
                    </div>  


                    <div className='row my-1'>
                        <div className='col-1'></div>
                        
                            
                            <div className='col'></div>
                        
                        
                    </div>  

                    
                    <div className='row my-1'>                                                
                        <button className='col-12 btn btn-primary2 text-start transition_opacity transition' id='queryLocation' onClick={()=>getQueryLocation(queryLocation[0])}></button>                                                    
                    </div>


                    {myLocations!='' &&
                    
                    <div>

                        <div className='row  my-1'>                        
                            <div className='col'>Saved locations</div>                                                                        
                        </div>

                        <div className='row'>
                            
                            {myLocations.map((l, index) => (
                                <button className='col-12  btn btn-lightgreen text-start my-1' key={index} onClick={()=>getLocation(l.name)} ><i class="fa fa-angle-right"></i> {l.name} ({l.country}) </button>
                            ))}
                        </div>
                        

                    </div>
                    
                    }
                              
            </div>
        )


    }


    // if(!isSplash){
    //     return <SplashScreen />
    // }

    if(viewDisplay==0){
        return (
            
                <div className="container transition" id='mainContainer'>
                        {/* <button onClick={()=>clearLocalStorage()}>clear</button>  */}
                                                        
                        <MainBody />
                        <DayTimes />

                        
                        <div className='container' id='btn_openWeek'>                        
                            <div className='row my-1 membrane'>
                                <button className='btn  rounded-0 text-start' onClick={()=>{
                                    weeklyForecast();
                                    toggleView(3);  
                                    
                                    
                                    }
                                }> <b>5-day forecast &nbsp; <i class="fa fa-caret-right"></i></b>
                                </button>                            
                            </div>
                        </div>
                        
                        
                </div>
            
        )
    }
    if(viewDisplay==1){
        return(
            <div className="container">
            <Menu/>
            </div>
        )
    }

    if(viewDisplay==2){
        return(
            <div className="container">
            <Locations/>
            </div>
        )
    }

    if(viewDisplay==3){
        return(
            <div className="container">
            <Week />
            </div>
        )
    }

    function playTransition(id,transition){
        
        switch(transition) {
            case 'left':
                //allowing for element to load before applying transition    
                setTimeout(() => {
                    let element=document.getElementById(id);        
                    element.style.opacity=1;
                    element.style.transform='translateX(0)';
                }, 200);
              break;

              case 'right':
                //allowing for element to load before applying transition    
                setTimeout(() => {
                    let element=document.getElementById(id);        
                    element.style.opacity=1;
                    element.style.transform='translateX(0)';
                }, 200);
              break;

              case 'up':
                //allowing for element to load before applying transition    
                setTimeout(() => {
                    let element=document.getElementById(id);        
                    element.style.opacity=1;
                    element.style.transform='translateY(0)';
                }, 200);
              break;


            case 'fade':
                setTimeout(() => {
                    let element=document.getElementById(id);        
                    element.style.opacity=1;                    
                }, 200);
              break;
            default:
              // code block
          }
        
        
        
    }

    function unsetTransition(id,transition){
        let element=document.getElementById(id);                   
        switch(transition) {
            case 'left':
                     
                element.style.opacity=0;
                element.style.transform='translateX(-10)';

                setTimeout(() => {
                toggleView(0);                   
                }, 200);    
              break;
              case 'up':    
                         
                element.style.opacity=0;
                element.style.transform='translateY(-10)';

                setTimeout(() => {
                toggleView(0);                   
                }, 200);
                
              break;

            case 'right':
                element.style.opacity=0;
                element.style.transform='translateX(10)';

                setTimeout(() => {
                toggleView(0);                   
                }, 200);    
            case 'fade':
                setTimeout(() => {
                    let element=document.getElementById(id);        
                    element.style.opacity=0;                    
                }, 200);
                
              break;
            default:
              // code block
            }      
    }

    function toggleTemperatureFormat(){

        //new values will be assigned to temperatures after conversion
        let newData=locationData;
        
        

        
        if(temperatureFormat=='°C'){
            temperatureFormat='°F';

            // °F = °C × (9/5) + 32
            
            //convert to °F
            if(newData!=''){

                newData.currentTemperature= newData.currentTemperature*9;
                newData.currentTemperature=newData.currentTemperature/5;
                newData.currentTemperature=newData.currentTemperature+32;

                newData.maxTemperature=newData.maxTemperature*9;
                newData.maxTemperature=newData.maxTemperature/5;
                newData.maxTemperature=newData.maxTemperature+32;
                newData.minTemperature=newData.minTemperature*9;
                newData.minTemperature=newData.minTemperature/5;
                newData.minTemperature=newData.minTemperature+32;
                newData.currentTemperature=newData.currentTemperature.toFixed();
                newData.minTemperature=newData.minTemperature.toFixed();
                newData.maxTemperature=newData.maxTemperature.toFixed();                
                setLocationData(newData);

            }
            


        }
        else{
            temperatureFormat='°C';

            // °C = (°F - 32) × 5/9
             //convert to °C
             if(newData!=''){

                newData.currentTemperature= newData.currentTemperature-32;
                newData.currentTemperature=newData.currentTemperature*5;
                newData.currentTemperature=newData.currentTemperature/9;

                newData.minTemperature= newData.minTemperature-32;
                newData.minTemperature=newData.minTemperature*5;
                newData.minTemperature=newData.minTemperature/9;

                newData.maxTemperature= newData.maxTemperature-32;
                newData.maxTemperature=newData.maxTemperature*5;
                newData.maxTemperature=newData.maxTemperature/9;

                newData.currentTemperature=newData.currentTemperature.toFixed();
                newData.minTemperature=newData.minTemperature.toFixed();
                newData.maxTemperature=newData.maxTemperature.toFixed();

                setLocationData(newData);

            }


        }   
        localStorage.setItem('temperatureFormat',temperatureFormat);
        document.getElementById('buttonTemperatureFormat').innerHTML=temperatureFormat
    }
        
    function clearLocalStorage(){
        localStorage.clear();

        
    }

    function getCurrentLocation(){       
        
        // let url = 'http://localhost:300/currentLocation';
        let url = 'https://api.omina.domes-web.net/currentLocation';

        let unit =localStorage.getItem('temperatureFormat');
        if(unit=='°C'){
            unit=1;
        }
        else{
            unit=2;
        }

        let selectedQueryLocation=localStorage.getItem('selectedQueryLocation')
        
        if(selectedQueryLocation==null){//find location from geolocation
            
            //find current position   
            if(location.latitude==''){

                if(navigator.geolocation){
            
                    navigator.geolocation.getCurrentPosition(success,failed);   
    
                    function success(position){
                        let location = {"latitude":position.coords.latitude,"longitude":position.coords.longitude,'unit':unit};
                        setLocation(location);                      
                     
                        
                        
                    //send post request                        
                    if(location!=''){
                        fetch(url,{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json;charset=utf-8'
                                    },
                            body:JSON.stringify(location)
                        })
                        .then(x => x.json())
                        .then(y=>{

                            if(y.status==200){
                                console.log(y.status);
                                setErrorCurrentLocation('');
                                setLocationData(y);
                            //retrieve saved locations
                            getMyLocations();                                                                            
                            }
                            else{
                                console.log(y.status)
                                setLocationData('');
                                
                                setErrorCurrentLocation(y.error);

                            }
                            
                        }); 
                    }
    
                                                                                            
                    }
    
                    function failed(e){
                        setLocationError(e.message);    
                        console.error(e)                
                    }
                }
                else{
                setLocationError('Unable to get current location');
                }  
                
            } 

        }
        else{//find query location
            
            if(locationData==''){
                setHourlyData('');
                selectedQueryLocation=JSON.parse(selectedQueryLocation);            
                setLocationData(selectedQueryLocation);
                let newLocation={latitude:selectedQueryLocation.latitude,longitude:selectedQueryLocation.longitude};
                console.log(newLocation)                
                setLocation(newLocation);
                console.log(location);
                getMyLocations();
                console.log(selectedQueryLocation);
            }                        
        }
                    
                       
            
    }


    function weeklyForecast(){

        let unit =localStorage.getItem('temperatureFormat');
        if(unit=='°C'){
            unit=1;
        }
        else{
            unit=2;
        }
        
        location.unit=unit;
        
           //send post request    
        
           let url = 'https://api.omina.domes-web.net/weekly';
            fetch(url,{
            method:'POST',
            headers:{
                    'Content-Type':'application/json;charset=utf-8'
                    },
                        body:JSON.stringify(location)
                     })
                .then(x => x.json())
                .then((y)=>{     
                    console.log('AUEI')
                        console.log(y)
                        if(y.status==200){
                            
                            setErrorWeekly('');
                            setWeekData(y.response);                            
                        }
                        else{
                            setErrorWeekly(y.error)
                            setWeekData('');
                        }
                                                
                    });                                                                          
    }

    function getMyLocations(){
        let locations=localStorage.getItem('myLocations');
        console.log(locations);
        if(locations!=null){
            locations=JSON.parse(locations);

            setMyLocations(locations);                            
        } 
           
    }



    function saveLocation(){
       
       //retrieve saved locations, if any 
       let savedLocations= localStorage.getItem('myLocations')
       let firstSavedLocation=[];

       let currentLocation={name:locationData.name,country:locationData.country, longitude:location.longitude,latitude:location.latitude}

       if(savedLocations!=null){
        savedLocations=JSON.parse(savedLocations);

        //add new location
        
        savedLocations.push(currentLocation);

        localStorage.setItem('myLocations',JSON.stringify(savedLocations));

        //populate myLocations
        setMyLocations(savedLocations);
        
       }
       else{
        //add new location
        firstSavedLocation.push(currentLocation);
        console.log(currentLocation);
        localStorage.setItem('myLocations',JSON.stringify(firstSavedLocation));

        //populate myLocations
        setMyLocations(firstSavedLocation);
       }                       
    }

    function removeLocation(){
        let savedLocations= localStorage.getItem('myLocations');
            savedLocations=JSON.parse(savedLocations);
        let name=locationData.name;
        let country=locationData.country;
        
        let newSavedLocations=[];
        
        for(let c of savedLocations){
            if(!(c.name==name && c.country==country)){
                newSavedLocations.push(c)
            }
        }        
        localStorage.setItem('myLocations',JSON.stringify(newSavedLocations));
        setIsSavedLocation(false);
        setMyLocations(newSavedLocations);
        

    }

    function checkSaved(){
        //iterate myLocations to see if location is saved
        setIsSavedLocation(false);
        console.log(myLocations)
        for(let i of myLocations){
            console.log(i.latitude);
            console.log(location.latitude);
            if(i.name==locationData.name && i.country==locationData.country){
                console.log('is saved')
                
                setIsSavedLocation(true);
            }
        }        
    }


    function getLocation(location){

        let unit =localStorage.getItem('temperatureFormat');
        if(unit=='°C'){
            unit=1;
        }
        else{
            unit=2;
        }


        let query;
        if(location==null){
            query=document.getElementById('searchLocation').value;
            query=query.trim();
        }
        else{
            query=location;
        }

        
        let url = 'https://api.omina.domes-web.net/getLocation?location='+query+'&units='+unit;    

        
        if(location==null){

            fetch(url)
            .then(x => x.json())
            .then(y => {
            console.log(y);
            if(y.cod==200){
                queryLocation=[];
                queryLocation.push(y)
                document.getElementById('queryLocation').innerHTML='';      
                document.getElementById('queryLocation').innerHTML=queryLocation[0].name+' ('+queryLocation[0].country+')';                              
                setTimeout(() => {
                    playTransition('queryLocation','fade');        
                }, 0);        
            }
            else{
                queryLocation=[];                                
                unsetTransition('queryLocation','fade')                
            }
            });

        }
        else{
            
            fetch(url)
            .then(x => x.json())
            .then(y => {
            console.log(y);
            if(y.cod==200){
                queryLocation=[];
                queryLocation.push(y)     
                setTimeout(() => {
                    getQueryLocation(queryLocation[0])                     
                }, 500);
                

            }            
            });

        }
        
        
    }

    function getQueryLocation(data){                
    localStorage.setItem('selectedQueryLocation',JSON.stringify(data));      
        
    //     checkSaved();    
        
        setTimeout(() => {

            unsetTransition('locations','right');   
            setLocationData('');    
                             
        }, 200);

        
                    
    }

    function hourly(){

        let unit =localStorage.getItem('temperatureFormat');
        if(unit=='°C'){
            unit=1;
        }
        else{
            unit=2;
        }

        if(hourlyData=='' && location.latitude!=''){

              
            let url='https://api.omina.domes-web.net/hourly';     
                   
            location.unit=unit;
            console.log(location)

            fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json;charset=utf-8'
                        },
                body:JSON.stringify(location)
            })
            .then(x => x.json())
            .then(y=>{
                if(y.status==200){
                    setErrorHourly('');
                    setHourlyData(y.response);                                                                                      
                }
                else{
                    setHourlyData('');
                    setErrorHourly(y.error);
                }
                
                
            });                         
            console.log(hourlyData)
            console.log(location);
        }
        else{
            console.log('loading hourly')            
            console.log(hourlyData)
        }

    }

}
 


export default  FullBody;


    




