# EMU_TelemetrySimulator
This is the EMU Telemetry Simulator for the 2019 SUITS Challenge. The purpose of this code is to generate mock EMU telemetry data for
students to implement within their user interface designs.

## Acronyms: 
  ```
  DCU - Display and Control Unit
  EVA - Extra Vehicular Activity
  UIA - Umbilical Interface Assembly 
  ```
## Code Sections: 

### Models: 

  **SimulationControl.js**
  
    Mongoose Schema for DCU switches. 
    Sets values and types for each switch. Switches can be manipulated by user.  
  
  **SimulationFailure.js**
  
    Mongoose Schema for available errors. 
    Currently contains fan error only. 
    
  **SimulationStateUIA.js**
  
    Mongoose Schema for UIA. 
    Sets names and types for each component of the UIA.
    Values will be changed depending on user manipulation. 
 
 **SimlulationState.js**
  
    Mongoose Schema for EVA telemetry values.
    Sets value names and types for each telemetry data point. 
 
 **SimulationUIA.js**
  
    Mongoose Schema for UIA controls. 
    Sets value names and types for each UIA switch. Switches can be manipulated by user.  
    

### Routes: 

  **evarouter.js**
  
  
    Sets HTTP request methods for EVA portion of the simulation. 
  
  **uiarouter.js**
  
    Sets HTTP request methods for UIA portion of the simulation. 
  
### Simulations:

   **evasimulation.js**
  
     This is where the simulation takes place for the EVA. EVA data is updated and sent to the database here.
  
   **uiasimulation.js**
     
     This is where the simulation takes place for the UIA. UIA data is updated and sent to the database here.
  
  
### Telemetry:

  **eva_telemetry.js**
    
    All EVA Telemetry Data is generated here
 
  **uia_telemetry.js**
    
    All UIA Telemetry Data is generated here

## Support
If you have any questions or need any help please visit our website [NASA SUITS](https://microgravityuniversity.jsc.nasa.gov/nasasuits.cfm) or contact us at: [NASA-SUITS@mail.nasa.gov](nasa-suits@mail.nasa.gov)



