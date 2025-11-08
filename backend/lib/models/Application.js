import mongoose from "mongoose";

const { Schema } = mongoose;
// helper functions 
const IndividualSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: '' },
    significance: { type: String, default: '' },
    imageUrl: { type: String, default: '' }
}, { _id: false });

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    side: { type: String, default: '' },
    role: { type: String, default: '' }
}, { _id: false });

const PhaseSchema = new mongoose.Schema({
    phaseTitle: { type: String, required: true },
    phaseDescription: { type: String, default: '' }
}, { _id: false });

const CasualtiesSchema = new mongoose.Schema({
    description: { type: String, default: '' },
    statistics: { type: [mongoose.Schema.Types.Mixed], default: [] } // Mixed because stats could be numbers, objects, etc.
}, { _id: false });

const ReadingItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, default: '' },
    year: { type: Number }
}, { _id: false });







const applicationSchema = new Schema({




    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'],
        default: 'pending'
    },




    event:{

        title: { type: String, required: true, trim: true },
        subtitle: { type: String, default: '' },
        summary: { type: String, default: '' },
        
        coreInfo: {
            eventName: { type: String, required: true },
            startingDate: { type: Date },
            endDate: { type: Date },
            country: { type: String, default: '' },
            locations: { type: [String], default: [] },
            eventTags: { type: [String], default: [] }
        },
        
        historicalContext: { type: String, default: '' },
        prelude: { type: String, default: '' },
        
        keyPlayers: {
            individuals: { type: [IndividualSchema], default: [] },
            groups: { type: [GroupSchema], default: [] }
        },
        
        mainNarrative: {
            introduction: { type: String, default: '' },
            phases: { type: [PhaseSchema], default: [] },
            
            chronologicalTimeline: {
                type: [{
                    title: { type: String, default: '' },
                    date: { type: Date },
                    description: { type: String, default: '' }
                }],
                default: []
            }
        },
        
        impactAndConsequences: {
            immediateAftermath: { type: String, default: '' },
            longTermConsequences: { type: String, default: '' },
            casualtiesAndLosses: { type: CasualtiesSchema, default: () => ({}) }
        },
        
        analysisAndInterpretation: {
            rootCauses: { type: String, default: '' },
            historicalSignificance: { type: String, default: '' },
            controversiesAndDebates: { type: String, default: '' },
            legacy: {
                commemoration: { type: String, default: '' },
                inPopularCulture: { type: String, default: '' }
            },
            sourcesAndReading: {
                primarySources: { type: [mongoose.Schema.Types.Mixed], default: [] }, // allow flexible primary source objects or URLs
                furtherReading: { type: [ReadingItemSchema], default: [] },
                bibliography: { type: String, default: '' }
            }
        }
    }




}, { timestamps: true });
const Application = mongoose.model('Application', applicationSchema)
export default Application;