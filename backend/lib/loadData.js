import events from "./data.js";
import Event from "./models/Event.js"

const load_data = async () => {
    for(const obj of events){
        try{
            await Event.create(obj);
            console.log("Event added successfully");
        }catch(err){
            console.log("could not add event");
        }
    }
}

export default load_data;
